import { grad, Gradient } from '@/theme/tokens';
import { nativeTracks } from '@/data/tracks';

/**
 * The music catalog.
 *
 * This is the shape your app streams. In production it comes from a `catalog.json`
 * you host (see services/catalog.ts + the "your songs go here" guide), so you can
 * add albums and songs without shipping an app update. The bundled copy below is
 * the offline fallback and today's demo — the three songs with a `source` play
 * for real; the empty albums are where your masters get uploaded.
 */

export type CatalogTrack = {
  id: string;
  title: string;
  source?: number; // bundled asset (require) — demo only
  uri?: string; // remote stream URL — the real thing
  membersOnly?: boolean;
};

export type CatalogAlbum = {
  id: string;
  title: string;
  year?: number;
  gradient: Gradient;
  tracks: CatalogTrack[];
};

export type Catalog = { albums: CatalogAlbum[] };

const sourceOf = (id: string): number | undefined => nativeTracks.find((t) => t.id === id)?.source;

export const bundledCatalog: Catalog = {
  albums: [
    {
      id: 'islands-disappear',
      title: 'Islands Disappear',
      year: 2009,
      gradient: grad.eyes,
      tracks: [
        { id: 'i-love-you', title: 'I Love You', source: sourceOf('i-love-you') },
        { id: 'lucky', title: 'Lucky', source: sourceOf('lucky') },
      ],
    },
    { id: 'little-mountain', title: 'Little Mountain', year: 2011, gradient: grad.cascadia, tracks: [] },
    { id: 'hawaiii', title: 'hawaiii', year: 2013, gradient: grad.hawaii, tracks: [] },
    { id: 'eyes-wide', title: 'As Long As Your Eyes Are Wide', year: 2017, gradient: grad.eyes, tracks: [] },
    { id: 'cascadia', title: 'Cascadia', year: 2019, gradient: grad.cascadia, tracks: [] },
    { id: 'dandelion', title: 'Dandelion', year: 2021, gradient: grad.sunset, tracks: [] },
    {
      id: 'singles',
      title: 'Singles & Vault',
      gradient: grad.vault,
      tracks: [{ id: '2010', title: '2010', source: sourceOf('2010') }],
    },
  ],
};

export function findAlbum(catalog: Catalog, id: string): CatalogAlbum | undefined {
  return catalog.albums.find((a) => a.id === id);
}

/** Every track that can actually play right now (has audio attached). */
export function playableTracks(catalog: Catalog): { album: CatalogAlbum; track: CatalogTrack }[] {
  const out: { album: CatalogAlbum; track: CatalogTrack }[] = [];
  for (const album of catalog.albums) {
    for (const track of album.tracks) {
      if (track.source != null || track.uri) out.push({ album, track });
    }
  }
  return out;
}
