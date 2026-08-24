import { Image, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { EraGalleryItem } from '@/data/catalog';
import { archive, font } from '@/theme/archive';

type Row = { items: EraGalleryItem[]; wide: boolean };

function rowsFor(photos: EraGalleryItem[]): Row[] {
  const rows: Row[] = [];
  let pair: EraGalleryItem[] = [];
  const flushPair = () => {
    if (!pair.length) return;
    rows.push({ items: pair, wide: false });
    pair = [];
  };
  for (const p of photos) {
    if (p.wide) {
      flushPair();
      rows.push({ items: [p], wide: true });
    } else {
      pair.push(p);
      if (pair.length === 2) flushPair();
    }
  }
  flushPair();
  return rows;
}

/** Heins stills under the cream museum card. Credit once — no captions. */
export function EraGallery({ items }: { items: EraGalleryItem[] }) {
  const { width } = useWindowDimensions();
  const pageW = Math.min(width, 390);
  const photos = items.filter((item) => item.kind === 'photo' && (item.source || item.uri));
  if (!photos.length) return null;

  const credit = photos.find((p) => p.credit)?.credit;
  const gap = 8;
  const inner = pageW - 48;
  const colW = (inner - gap) / 2;
  const hero = photos[0].wide ? undefined : photos[0];
  const rows = rowsFor(hero ? photos.slice(1) : photos);

  const srcOf = (item: EraGalleryItem) =>
    item.source ?? (item.uri ? { uri: item.uri } : undefined);

  return (
    <View style={styles.wrap}>
      {hero ? (
        <Image
          key={hero.id}
          source={srcOf(hero)}
          style={[styles.img, { width: inner, height: inner * 1.22 }]}
          resizeMode="cover"
        />
      ) : null}
      {rows.map((row, i) => {
        if (row.wide) {
          const item = row.items[0];
          const src = srcOf(item);
          if (!src) return null;
          return (
            <Image
              key={item.id}
              source={src}
              style={[styles.img, { width: inner, height: inner * 0.66 }]}
              resizeMode="cover"
            />
          );
        }
        const full = row.items.length === 1;
        return (
          <View key={`row-${i}`} style={[styles.grid, { width: inner, gap }]}>
            {row.items.map((item) => {
              const src = srcOf(item);
              if (!src) return null;
              const w = full ? inner : colW;
              return (
                <Image
                  key={item.id}
                  source={src}
                  style={[styles.img, { width: w, height: w * 1.22 }]}
                  resizeMode="cover"
                />
              );
            })}
          </View>
        );
      })}
      {credit ? <Text style={styles.credit}>{credit}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 24, paddingBottom: 8, alignItems: 'center', gap: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  img: { backgroundColor: '#EDE3CE' },
  credit: {
    fontFamily: font.sans,
    fontSize: 10,
    letterSpacing: 1.5,
    color: archive.color.warmGrey,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
});
