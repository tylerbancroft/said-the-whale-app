import { StyleProp, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

/**
 * Hand-drawn ink accents — slightly irregular strokes that make each album page
 * feel like a printed, hand-framed artifact. The wobble is deterministic per
 * `seed`, so every record gets its own unique border (stable across renders).
 */

const frac = (x: number) => x - Math.floor(x);
// deterministic pseudo-random in [-amp, amp]
const jit = (seed: number, i: number, amp: number) =>
  (frac(Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453) * 2 - 1) * amp;

function wobblyRect(w: number, h: number, seed: number, amp: number, perSide = 6) {
  const corners = [[0, 0], [w, 0], [w, h], [0, h]];
  const pts: string[] = [];
  let k = 0;
  for (let s = 0; s < 4; s++) {
    const [x1, y1] = corners[s];
    const [x2, y2] = corners[(s + 1) % 4];
    for (let i = 0; i < perSide; i++) {
      const t = i / perSide;
      const x = x1 + (x2 - x1) * t + jit(seed, k, amp);
      const y = y1 + (y2 - y1) * t + jit(seed + 9, k, amp);
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
      k++;
    }
  }
  return 'M ' + pts.join(' L ') + ' Z';
}

function wobblyLine(w: number, seed: number, amp: number, seg = 9) {
  const pts: string[] = [];
  for (let i = 0; i <= seg; i++) {
    const x = (w / seg) * i;
    const y = amp + 1 + jit(seed, i, amp);
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return 'M ' + pts.join(' L ');
}

export function HandDrawnBox({
  size,
  color,
  seed = 1,
  amp = 2.6,
  strokeWidth = 1.5,
  style,
}: {
  size: number;
  color: string;
  seed?: number;
  amp?: number;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const pad = amp + 2;
  const inner = size - pad * 2;
  return (
    <Svg width={size} height={size} style={style} pointerEvents="none">
      <Path d={wobblyRect(inner, inner, seed, amp)} x={pad} y={pad} stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <Path d={wobblyRect(inner, inner, seed + 4, amp * 0.7)} x={pad} y={pad} stroke={color} strokeWidth={strokeWidth * 0.7} fill="none" strokeLinejoin="round" opacity={0.5} />
    </Svg>
  );
}

export function HandDrawnLine({
  width,
  color,
  seed = 1,
  amp = 1.6,
  style,
}: {
  width: number;
  color: string;
  seed?: number;
  amp?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Svg width={width} height={amp * 2 + 4} style={style} pointerEvents="none">
      <Path d={wobblyLine(width, seed, amp)} stroke={color} strokeWidth={1.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
