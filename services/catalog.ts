import { Catalog, bundledCatalog, mergeCatalog } from '@/data/catalog';

/**
 * Loads the music catalog.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  TYLER: when your audio is hosted, set CATALOG_URL to your catalog.json.   │
 * │  The app will then stream your full, up-to-date catalog — and you can add  │
 * │  songs any time by editing that file, with no App Store update.            │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Until then (or if the network fails), it falls back to the bundled catalog,
 * so the app always works. Remote JSON overlays `uri` / `lyrics` / gallery
 * URLs onto the bundled era worlds (covers + track lists stay local).
 *
 * A track `uri` is an https MP3/M4A. The player loads it with
 * `player.replace({ uri: track.uri })` then `player.play()`.
 */

export const CATALOG_URL = ''; // e.g. 'https://media.saidthewhale.com/catalog.json'

export async function loadCatalog(): Promise<Catalog> {
  if (CATALOG_URL) {
    try {
      const res = await fetch(CATALOG_URL);
      if (res.ok) {
        const data = (await res.json()) as Catalog;
        if (data?.albums?.length) return mergeCatalog(data, bundledCatalog);
      }
    } catch {
      // fall through to bundled
    }
  }
  return bundledCatalog;
}
