import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { PHOTO_COUNT } from '@/assets/photos';

/**
 * Shared band-photo index across all photo pages (Albums, Chat, Tour, News).
 * A random photo is chosen on first mount; the refresh control advances it, and
 * every photo page reads the same index so they stay in sync.
 */
type PhotoValue = { index: number; refresh: () => void };

const PhotoContext = createContext<PhotoValue | undefined>(undefined);

// Seeded once at module load (Math.random is fine at runtime; only the workflow
// sandbox forbids it). Keeps the first photo stable for the session.
const START = Math.floor(Math.random() * PHOTO_COUNT);

export function PhotoProvider({ children }: { children: ReactNode }) {
  const [index, setIndex] = useState(START);
  const refresh = useCallback(() => setIndex((i) => (i + 1) % PHOTO_COUNT), []);
  return <PhotoContext.Provider value={{ index, refresh }}>{children}</PhotoContext.Provider>;
}

export function usePhoto() {
  const ctx = useContext(PhotoContext);
  if (!ctx) throw new Error('usePhoto must be used within a PhotoProvider');
  return ctx;
}
