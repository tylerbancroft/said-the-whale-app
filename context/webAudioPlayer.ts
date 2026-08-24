import { Asset } from 'expo-asset';
import type { AudioStatus } from 'expo-audio';

/**
 * Small web-only player used by the archive.
 *
 * expo-audio has a web implementation, but its HTMLAudioElement `ended`
 * handler does not emit `didJustFinish`, so next-track would stall in the
 * browser. This path still loads remote songs with `replace({ uri })`
 * then `play()`, matching native.
 */

export type ArchiveAudioSource = { uri: string } | number;

type StatusHandler = (status: AudioStatus) => void;

function uriFromSource(src: ArchiveAudioSource): string | null {
  if (typeof src === 'object' && typeof src.uri === 'string' && src.uri) return src.uri;
  if (typeof src === 'number') {
    try {
      const asset = Asset.fromModule(src);
      return asset.uri || asset.localUri || null;
    } catch {
      return null;
    }
  }
  return null;
}

export type WebArchivePlayer = {
  playing: boolean;
  replace: (src: ArchiveAudioSource) => void;
  play: () => void;
  pause: () => void;
  seekTo: (seconds: number) => void;
  addListener: (event: 'playbackStatusUpdate', cb: StatusHandler) => { remove: () => void };
  setActiveForLockScreen: (
    active: boolean,
    meta?: { title?: string; artist?: string; albumTitle?: string },
  ) => void;
  remove: () => void;
};

export function createWebArchivePlayer(): WebArchivePlayer {
  const audio = new Audio();
  audio.preload = 'auto';
  let playing = false;
  const listeners = new Set<StatusHandler>();

  const emit = (partial: Partial<AudioStatus> = {}) => {
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    const status = {
      id: 'web',
      isLoaded: audio.readyState >= 1,
      duration,
      currentTime: audio.currentTime || 0,
      playbackState: '',
      timeControlStatus: playing ? 'playing' : 'paused',
      reasonForWaitingToPlay: '',
      playing,
      didJustFinish: false,
      isBuffering: audio.readyState > 0 && audio.readyState < 3,
      playbackRate: audio.playbackRate || 1,
      shouldCorrectPitch: true,
      mute: audio.muted,
      loop: audio.loop,
      isLive: audio.duration === Infinity,
      currentOffsetFromLive: null,
      error: null,
      ...partial,
    } as AudioStatus;
    listeners.forEach((cb) => cb(status));
  };

  audio.ontimeupdate = () => emit();
  audio.onplay = () => {
    playing = true;
    emit({ playing: true });
  };
  audio.onpause = () => {
    playing = false;
    emit({ playing: false });
  };
  audio.onended = () => {
    playing = false;
    emit({ playing: false, didJustFinish: true });
  };
  audio.onloadedmetadata = () => emit();
  audio.onerror = () => {
    playing = false;
    emit({ playing: false, isLoaded: false, error: 'Playback error' });
  };

  return {
    get playing() {
      return playing;
    },
    replace(src) {
      const uri = uriFromSource(src);
      if (!uri) return;
      audio.pause();
      audio.src = uri;
      audio.load();
    },
    play() {
      void audio.play().catch(() => {});
    },
    pause() {
      audio.pause();
    },
    seekTo(seconds) {
      if (Number.isFinite(seconds)) audio.currentTime = seconds;
    },
    addListener(_event, cb) {
      listeners.add(cb);
      return { remove: () => listeners.delete(cb) };
    },
    setActiveForLockScreen(active, meta) {
      if (typeof navigator === 'undefined' || !navigator.mediaSession) return;
      try {
        if (!active) {
          navigator.mediaSession.metadata = null;
          return;
        }
        navigator.mediaSession.metadata = new MediaMetadata({
          title: meta?.title ?? '',
          artist: meta?.artist ?? 'Said The Whale',
          album: meta?.albumTitle ?? '',
        });
        navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
      } catch {}
    },
    remove() {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      listeners.clear();
    },
  };
}
