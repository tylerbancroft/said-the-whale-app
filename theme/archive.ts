import { Platform } from 'react-native';

/**
 * "Boutique Archive" redesign tokens — warm cream + ink, Wes Anderson direction.
 * Values transcribed from design/stw-redesign/README.md + the HTML prototype.
 * These live alongside the original theme/tokens.ts during the redesign rebuild.
 */

export const archive = {
  color: {
    cream: '#F3ECDD', // app background
    paper: '#FBF6EA', // cards / surfaces
    ink: '#46372B', // primary text
    body: '#55473A', // body text
    bodySoft: '#6E5F50', // secondary body
    line: '#DCCFB6', // hairline on cream pages
    lineOnPhoto: 'rgba(255,255,255,0.2)',
    red: '#C4614E', // primary action
    redDark: '#A94F3E', // action pressed/hover
    dustyBlue: '#8FA8B4',
    deepBlue: '#53707E',
    mustard: '#D9A03F',
    teal: '#7C9C8F',
    paleYellow: '#EFDCA8',
    warmGrey: '#A79A87',
    softBrown: '#B98B6E',
    rowActive: '#F3E5D2', // highlighted track row
    rowBorder: '#EDE3CE',
    // photo-page text
    photoText: '#F7F1E3',
    photoTextSoft: 'rgba(247,241,227,0.75)',
    photoTextFaint: 'rgba(247,241,227,0.6)',
    // glass
    glassBg: 'rgba(35,26,18,0.42)',
    glassBorder: 'rgba(255,255,255,0.22)',
    // refresh button / circular glass
    circleGlassBg: 'rgba(35,26,18,0.35)',
    circleGlassBorder: 'rgba(255,255,255,0.5)',
  },
  // photo scrim (top → bottom) for full-bleed photo pages
  scrim: [
    'rgba(35,26,18,0.66)',
    'rgba(35,26,18,0.34)',
    'rgba(35,26,18,0.30)',
    'rgba(35,26,18,0.55)',
  ] as const,
  scrimLocations: [0, 0.26, 0.6, 1] as const,
  // text-shadow (photo pages) — RN maps to textShadow* props
  photoShadow: {
    textShadowColor: 'rgba(0,0,0,0.55)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 10,
  },
  space: { page: 22, pageWide: 28, section: 20, gapV: 26, gapH: 40, side: 26 },
  radius: { pill: 999, art: 14, card: 16, circle: 9999 },
} as const;

/**
 * Fonts: production wants Futura + Tilda (licensed). Until those are added,
 * we fall back the way the prototype does — a clean geometric sans for UI and a
 * script face for accents. System stacks keep the build asset-free for now.
 */
export const font = {
  // UI / wordmark — geometric sans (Futura stand-in until the licensed face lands)
  sans: Platform.select({
    ios: 'Avenir Next',
    android: 'sans-serif',
    default: 'Futura, "Century Gothic", "Avenir Next", "Segoe UI", system-ui, sans-serif',
  }) as string,
  // script accent (Tilda stand-in)
  script: Platform.select({
    ios: 'Snell Roundhand',
    android: 'sans-serif',
    default: '"Snell Roundhand", "Brush Script MT", "Segoe Script", cursive',
  }) as string,
};

export type ArchiveColor = keyof typeof archive.color;
