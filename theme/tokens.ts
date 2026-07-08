import { Platform } from 'react-native';

/**
 * Said The Whale — design tokens.
 * v1 commits to a single "deep water" dark theme (music apps read best dark).
 * A light theme can be layered on later via the same token names.
 */

export const colors = {
  ground: '#071722', // app background
  backdrop: '#040D13', // deepest
  surface: '#0E2532', // cards
  surface2: '#143140', // elevated / tiles
  surface3: '#1B3E4F', // player bar
  ink: '#F0E9DB', // primary text (warm sand)
  muted: '#8AA6B4', // secondary text
  faint: '#5E7D8B', // tertiary text
  line: '#1E3E4E', // hairlines / borders
  accent: '#FF7A59', // west-coast sunset coral (CTAs, active)
  accentInk: '#17110E', // text on accent
  foam: '#63CBBB', // seafoam (tags, band voice)
  foamSoft: '#0F3A37', // seafoam tint bg
  gold: '#F0B429', // members / highlight
  goldSoft: '#2A2410', // gold tint bg
  white: '#FFFFFF',
} as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28 } as const;

export const radius = { sm: 8, md: 12, lg: 16, xl: 18, xxl: 24, pill: 999 } as const;

// Serif for editorial headings; system sans elsewhere.
export const serif = Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia' }) as string;

export type Gradient = readonly [string, string];

export const grad: Record<string, Gradient> = {
  sunset: ['#E8853F', '#C23B52'],
  cascadia: ['#2E9B8A', '#17323F'],
  eyes: ['#5B6BD6', '#2A2350'],
  hawaii: ['#F0B429', '#E05A38'],
  vault: ['#1B3E4F', '#0B3A4A'],
  hero: ['#0B3A4A', '#123040'],
  night: ['#123040', '#071722'],
};
