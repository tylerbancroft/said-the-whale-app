import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { createAudioPlayer, setAudioModeAsync, type AudioStatus } from 'expo-audio';
import {
  CatalogAlbum,
  CatalogTrack,
  trackHasAudio,
  audioSourceFor,
  firstPlayableIndex,
  nextPlayableIndex,
  prevPlayableIndex,
} from '@/data/catalog';

/**
 * One expo-audio player for the archive.
 *
 * Remote tracks: `player.replace({ uri: track.uri })` then `play()`.
 * Bundled tracks: `player.replace(track.source)` then `play()`.
 * `uri` wins when both exist (catalog.json overlay).
 */

export function secondsOf(len: string): number {
  const [m, s] = len.split(':').map(Number);
  return (m || 0) * 60 + (s || 0);
}
export function fmt(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
export function lengthForTrack(track: CatalogTrack, index: number): string {
  if (track.duration) return track.duration;
  const fallback = ['3:12', '4:05', '2:58', '3:41', '4:22', '3:34', '3:07', '4:48'];
  return fallback[index % fallback.length];
}

type ArchivePlayerValue = {
  album: CatalogAlbum | null;
  track: CatalogTrack | null;
  trackIndex: number;
  title: string | null;
  playing: boolean;
  elapsed: number;
  duration: number;
  hasTrack: boolean;
  isLiveAudio: boolean;
  playAlbum: (album: CatalogAlbum) => void;
  playTrack: (album: CatalogAlbum, index: number) => void;
  toggle: () => void;
  seekFraction: (f: number) => void;
  next: () => void;
  prev: () => void;
};

const Ctx = createContext<ArchivePlayerValue | undefined>(undefined);

export function ArchivePlayerProvider({ children }: { children: ReactNode }) {
  const [album, setAlbum] = useState<CatalogAlbum | null>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);

  const playerRef = useRef<ReturnType<typeof createAudioPlayer> | null>(null);
  const albumRef = useRef<CatalogAlbum | null>(null);
  const indexRef = useRef(0);
  const ignoreFinishRef = useRef(false);
  albumRef.current = album;
  indexRef.current = trackIndex;

  const track = album?.tracks[trackIndex] ?? null;
  const catalogDuration = album && track ? secondsOf(lengthForTrack(track, trackIndex)) : 0;
  const duration = audioDuration > 0 ? audioDuration : catalogDuration;
  const durationRef = useRef(duration);
  durationRef.current = duration;
  const isLiveAudio = Boolean(track && trackHasAudio(track));

  const loadAudio = useCallback((al: CatalogAlbum, next: CatalogTrack) => {
    const p = playerRef.current;
    const src = audioSourceFor(next);
    if (!p || src == null) return;
    ignoreFinishRef.current = true;
    try {
      p.replace(src);
      p.play();
      p.setActiveForLockScreen(true, {
        title: next.title,
        artist: 'Said The Whale',
        albumTitle: al.title,
      });
    } catch {}
    setTimeout(() => {
      ignoreFinishRef.current = false;
    }, 500);
  }, []);

  const playTrack = useCallback((al: CatalogAlbum, index: number) => {
    const tr = al.tracks[index];
    if (!tr || !trackHasAudio(tr)) return;
    setAlbum(al);
    setTrackIndex(index);
    setElapsed(0);
    setAudioDuration(0);
    setPlaying(true);
    loadAudio(al, tr);
  }, [loadAudio]);

  const playAlbum = useCallback((al: CatalogAlbum) => {
    const i = firstPlayableIndex(al);
    if (i < 0) return;
    playTrack(al, i);
  }, [playTrack]);

  const next = useCallback(() => {
    const al = albumRef.current;
    if (!al) return;
    const ni = nextPlayableIndex(al, indexRef.current);
    if (ni < 0) {
      setPlaying(false);
      try { playerRef.current?.pause(); } catch {}
      return;
    }
    playTrack(al, ni);
  }, [playTrack]);
  const nextRef = useRef(next);
  nextRef.current = next;

  const prev = useCallback(() => {
    const al = albumRef.current;
    if (!al) return;
    if (elapsed > 3) {
      setElapsed(0);
      try { playerRef.current?.seekTo(0); } catch {}
      return;
    }
    const pi = prevPlayableIndex(al, indexRef.current);
    if (pi < 0) {
      setElapsed(0);
      try { playerRef.current?.seekTo(0); } catch {}
      return;
    }
    playTrack(al, pi);
  }, [elapsed, playTrack]);

  const toggle = useCallback(() => {
    const player = playerRef.current;
    const al = albumRef.current;
    if (!al) return;
    try {
      if (player?.playing) {
        player.pause();
        setPlaying(false);
      } else {
        player?.play();
        setPlaying(true);
      }
    } catch {
      setPlaying((p) => !p);
    }
  }, []);

  const seekFraction = useCallback((f: number) => {
    const d = durationRef.current;
    if (!d) return;
    const t = Math.max(0, Math.min(1, f)) * d;
    setElapsed(t);
    try { playerRef.current?.seekTo(t); } catch {}
  }, []);

  useEffect(() => {
    const player = createAudioPlayer(null, { updateInterval: 250, keepAudioSessionActive: true });
    playerRef.current = player;
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: 'doNotMix',
    }).catch(() => {});

    const sub = player.addListener('playbackStatusUpdate', (status: AudioStatus) => {
      if (typeof status.playing === 'boolean') setPlaying(status.playing);
      if (typeof status.currentTime === 'number' && Number.isFinite(status.currentTime)) {
        setElapsed(status.currentTime);
      }
      if (typeof status.duration === 'number' && status.duration > 0) {
        setAudioDuration(status.duration);
      }
      if (status.didJustFinish && !ignoreFinishRef.current) {
        nextRef.current();
      }
    });

    return () => {
      try { sub.remove(); } catch {}
      try { player.setActiveForLockScreen(false); } catch {}
      try { player.remove(); } catch {}
    };
  }, []);

  const value: ArchivePlayerValue = {
    album,
    track,
    trackIndex,
    title: track?.title ?? null,
    playing,
    elapsed,
    duration,
    hasTrack: album != null,
    isLiveAudio,
    playAlbum,
    playTrack,
    toggle,
    seekFraction,
    next,
    prev,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useArchivePlayer() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useArchivePlayer must be used within an ArchivePlayerProvider');
  return ctx;
}
