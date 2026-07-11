import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { ALBUMS, ArchiveAlbum, TRACK_LENGTHS } from '@/data/redesign';
import { nativeTracks } from '@/data/tracks';

/**
 * Player state for the "Boutique Archive" redesign: current album + track,
 * a scrubbable elapsed clock, and a derived queue. Tracks with a bundled
 * recording ("I Love You", "Lucky") play for real via expo-audio; the rest
 * simulate playback (1s ticks, auto-advance) exactly like the design prototype
 * until the full catalog streams.
 */

// Bundled audio by (loose) track-title match.
const SOURCE_BY_TITLE: Record<string, number> = {};
for (const t of nativeTracks) SOURCE_BY_TITLE[t.title.toLowerCase()] = t.source;

export function lengthForTrack(trackIndex: number): string {
  return TRACK_LENGTHS[trackIndex % TRACK_LENGTHS.length];
}
export function secondsOf(len: string): number {
  const [m, s] = len.split(':').map(Number);
  return m * 60 + s;
}
export function fmt(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

type ArchivePlayerValue = {
  album: ArchiveAlbum | null;
  trackIndex: number;
  title: string | null;
  playing: boolean;
  elapsed: number;
  duration: number;
  hasTrack: boolean;
  playAlbum: (album: ArchiveAlbum) => void;
  playTrack: (album: ArchiveAlbum, index: number) => void;
  toggle: () => void;
  seekFraction: (f: number) => void;
  next: () => void;
  prev: () => void;
};

const Ctx = createContext<ArchivePlayerValue | undefined>(undefined);

export function ArchivePlayerProvider({ children }: { children: ReactNode }) {
  const [album, setAlbum] = useState<ArchiveAlbum | null>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const playerRef = useRef<ReturnType<typeof createAudioPlayer> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const duration = album ? secondsOf(lengthForTrack(trackIndex)) : 0;
  const durationRef = useRef(duration);
  durationRef.current = duration;

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

  // advanceRef lets the interval call the latest next() without re-subscribing.
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

  const loadReal = useCallback((title: string) => {
    const src = SOURCE_BY_TITLE[title.toLowerCase()];
    const p = playerRef.current;
    if (!p) return;
    try {
      if (src != null) {
        p.replace(src as Parameters<typeof p.replace>[0]);
        p.seekTo(0);
        p.play();
      } else {
        p.pause();
      }
    } catch {}
  }, []);

  const playTrack = useCallback((al: ArchiveAlbum, index: number) => {
    setAlbum(al);
    setTrackIndex(index);
    setElapsed(0);
    setPlaying(true);
    loadReal(al.tracks[index]);
    startTimer();
  }, [loadReal, startTimer]);

  const playAlbum = useCallback((al: ArchiveAlbum) => playTrack(al, 0), [playTrack]);

  const next = useCallback(() => {
    setAlbum((al) => {
      if (!al) return al;
      setTrackIndex((i) => {
        const ni = i + 1;
        if (ni >= al.tracks.length) { setPlaying(false); stopTimer(); return i; }
        setElapsed(0);
        loadReal(al.tracks[ni]);
        return ni;
      });
      return al;
    });
  }, [loadReal]);
  advanceRef.current = next;

  const prev = useCallback(() => {
    if (!album) return;
    setTrackIndex((i) => {
      const pi = Math.max(0, i - 1);
      setElapsed(0);
      loadReal(album.tracks[pi]);
      return pi;
    });
  }, [album, loadReal]);

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
    trackIndex,
    title: album ? album.tracks[trackIndex] : null,
    playing,
    elapsed,
    duration,
    hasTrack: album != null,
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

// Convenience for screens that want the album objects.
export { ALBUMS };
