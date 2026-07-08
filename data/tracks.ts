import { grad, Gradient } from '@/theme/tokens';

/**
 * Real Said The Whale recordings, bundled so native in-app playback works today.
 *
 * For the shipping app these would stream from your own storage (see README →
 * Roadmap → Native streaming) rather than being bundled — but bundling a few
 * proves the "plays inside the app, no links out" experience end to end.
 */

export type NativeTrack = {
  id: string;
  title: string;
  album?: string;
  gradient: Gradient;
  source: number; // require() asset handle
};

export const nativeTracks: NativeTrack[] = [
  { id: 'i-love-you', title: 'I Love You', album: 'Islands Disappear', gradient: grad.eyes, source: require('../assets/audio/i-love-you.m4a') },
  { id: 'lucky', title: 'Lucky', album: 'Islands Disappear', gradient: grad.cascadia, source: require('../assets/audio/lucky.mp3') },
  { id: '2010', title: '2010', gradient: grad.hawaii, source: require('../assets/audio/2010.mp3') },
];

export function nativeSubtitle(t: NativeTrack): string {
  return t.album ? `Said The Whale · ${t.album}` : 'Said The Whale';
}
