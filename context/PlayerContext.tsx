import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { Gradient } from '@/theme/tokens';
import { nativeTracks, nativeSubtitle } from '@/data/tracks';

/**
 * Now-playing state for the persistent mini-player, backed by a real audio
 * engine (expo-audio). A single player instance lives here and is reused as the
 * fan taps play across the app, so playback continues while they navigate.
 */

export type PlayerTrack = {
  title: string;
  subtitle: string;
  gradient: Gradient;
  source?: number; // bundled asset (require)
  uri?: string; // remote stream URL (your hosted audio)
};

type Player = ReturnType<typeof createAudioPlayer>;

type PlayerValue = {
  track: PlayerTrack;
  isPlaying: boolean;
  play: (track: PlayerTrack) => void;
  toggle: () => void;
};

const first = nativeTracks[0];
const DEFAULT_TRACK: PlayerTrack = {
  title: first.title,
  subtitle: nativeSubtitle(first),
  gradient: first.gradient,
  source: first.source,
};

const PlayerContext = createContext<PlayerValue | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const playerRef = useRef<Player | null>(null);
  const [track, setTrack] = useState<PlayerTrack>(DEFAULT_TRACK);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const player = createAudioPlayer(DEFAULT_TRACK.source ?? null);
    playerRef.current = player;
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});

    const sub = player.addListener('playbackStatusUpdate', (status: { playing?: boolean }) => {
      if (typeof status?.playing === 'boolean') setIsPlaying(status.playing);
    });

    return () => {
      try {
        sub.remove();
      } catch {}
      try {
        player.remove();
      } catch {}
    };
  }, []);

  const play = useCallback((next: PlayerTrack) => {
    setTrack(next);
    const player = playerRef.current;
    // A track streams from a remote URL (uri) or plays a bundled asset (source).
    const audioSource = next.source != null ? next.source : next.uri ? { uri: next.uri } : null;
    if (player && audioSource != null) {
      try {
        player.replace(audioSource as Parameters<typeof player.replace>[0]);
        player.seekTo(0);
        player.play();
      } catch {}
    }
    setIsPlaying(true);
  }, []);

  const toggle = useCallback(() => {
    const player = playerRef.current;
    if (!player) {
      setIsPlaying((p) => !p);
      return;
    }
    try {
      if (player.playing) {
        player.pause();
        setIsPlaying(false);
      } else {
        player.play();
        setIsPlaying(true);
      }
    } catch {
      setIsPlaying((p) => !p);
    }
  }, []);

  return <PlayerContext.Provider value={{ track, isPlaying, play, toggle }}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within a PlayerProvider');
  return ctx;
}
