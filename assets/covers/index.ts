/**
 * Real album artwork, keyed by album id. Resized to ~1000px for the app bundle
 * (originals were multi-MB). Nothing Special (id 7) is still pending its cover —
 * it falls back to the monogram until it lands.
 */
export const COVERS: Record<number, number> = {
  0: require('./howe-sounds.jpg'),
  1: require('./islands-disappear.jpg'),
  2: require('./little-mountain.jpg'),
  3: require('./hawaiii.jpg'),
  4: require('./as-long-as-your-eyes.jpg'),
  5: require('./cascadia.jpg'),
  6: require('./dandelion.jpg'),
  8: require('./b-sides.jpg'),
};

export function coverFor(id: number): number | null {
  return COVERS[id] ?? null;
}
