import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { CatalogAlbum, CatalogTrack, trackHasAudio } from '@/data/catalog';

/**
 * Player for era worlds: current album + track, a scrubbable elapsed clock.
 * Tracks with a bundled recording or a remote `uri` play via expo-audio;
 * the rest simulate playback (1s ticks, auto-advance) until catalog.json
 * supplies stream URLs.
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

function firstPlayableIndex(album: CatalogAlbum): number {
  const i = album.tracks.findIndex((t) => !t.unplayable);
  return i < 0 ? 0 : i;
}

export function ArchivePlayerProvider({ children }: { children: ReactNode }) {
  const [album, setAlbum] = useState<CatalogAlbum | null>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const playerRef = useRef<ReturnType<typeof createAudioPlayer> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const track = album?.tracks[trackIndex] ?? null;
  const duration = album && track ? secondsOf(lengthForTrack(track, trackIndex)) : 0;
  const durationRef = useRef(duration);
  durationRef.current = duration;
  const isLiveAudio = Boolean(track && trackHasAudio(track));

  useEffect(() => {
    playerRef.current = createAudioPlayer(null);
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      try { playerRef.current?.remove(); } catch {}
    };
  }, []);

  const stopTimer = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  const advanceRef = useRef<() => void>(() => {});

  const startTimer = useCallback(() => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setElapsed((e) => {
        if (e + 1 >= durationRef.current) {
          advanceRef.current();
          return 0;
        }
        return e + 1;
      });
    }, 1000);
  }, []);

  const loadAudio = useCallback((next: CatalogTrack | undefined) => {
    const p = playerRef.current;
    if (!p || !next) return;
    try {
      if (next.uri) {
        p.replace({ uri: next.uri } as Parameters<typeof p.replace>[0]);
        p.seekTo(0);
        p.play();
      } else if (next.source != null) {
        p.replace(next.source as Parameters<typeof p.replace>[0]);
        p.seekTo(0);
        p.play();
      } else {
        p.pause();
      }
    } catch {}
  }, []);

  const playTrack = useCallback((al: CatalogAlbum, index: number) => {
    const tr = al.tracks[index];
    if (!tr || tr.unplayable) return;
    setAlbum(al);
    setTrackIndex(index);
    setElapsed(0);
    setPlaying(true);
    loadAudio(tr);
    startTimer();
  }, [loadAudio, startTimer]);

  const playAlbum = useCallback((al: CatalogAlbum) => playTrack(al, firstPlayableIndex(al)), [playTrack]);

  const next = useCallback(() => {
    setAlbum((al) => {
      if (!al) return al;
      setTrackIndex((i) => {
        let ni = i + 1;
        while (ni < al.tracks.length && al.tracks[ni].unplayable) ni += 1;
        if (ni >= al.tracks.length) { setPlaying(false); stopTimer(); return i; }
        setElapsed(0);
        loadAudio(al.tracks[ni]);
        return ni;
      });
      return al;
    });
  }, [loadAudio]);
  advanceRef.current = next;

  const prev = useCallback(() => {
    if (!album) return;
    setTrackIndex((i) => {
      let pi = Math.max(0, i - 1);
      while (pi > 0 && album.tracks[pi].unplayable) pi -= 1;
      setElapsed(0);
      loadAudio(album.tracks[pi]);
      return pi;
    });
  }, [album, loadAudio]);

  const toggle = useCallback(() => {
    if (!album) return;
    setPlaying((p) => {
      const nextPlaying = !p;
      const player = playerRef.current;
      try { if (nextPlaying) player?.play(); else player?.pause(); } catch {}
      if (nextPlaying) startTimer(); else stopTimer();
      return nextPlaying;
    });
  }, [album, startTimer]);

  const seekFraction = useCallback((f: number) => {
    const d = durationRef.current;
    const t = Math.max(0, Math.min(1, f)) * d;
    setElapsed(t);
    try { playerRef.current?.seekTo(t); } catch {}
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
