import { Image, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { EraGalleryItem } from '@/data/catalog';
import { archive, font } from '@/theme/archive';

/** Heins stills under the cream museum card. Credit once — no captions. */
export function EraGallery({ items }: { items: EraGalleryItem[] }) {
  const { width } = useWindowDimensions();
  const pageW = Math.min(width, 390);
  const photos = items.filter((item) => item.kind === 'photo' && (item.source || item.uri));
  if (!photos.length) return null;

  const credit = photos.find((p) => p.credit)?.credit;
  const [hero, ...rest] = photos;
  const gap = 8;
  const inner = pageW - 48;
  const colW = (inner - gap) / 2;

  const srcOf = (item: EraGalleryItem) =>
    item.source ?? (item.uri ? { uri: item.uri } : undefined);

  return (
    <View style={styles.wrap}>
      {hero ? (
        <Image
          source={srcOf(hero)}
          style={[styles.img, { width: inner, height: inner * 1.22 }]}
          resizeMode="cover"
        />
      ) : null}
      <View style={[styles.grid, { width: inner, gap }]}>
        {rest.map((item) => {
          const src = srcOf(item);
          if (!src) return null;
          return (
            <Image
              key={item.id}
              source={src}
              style={[styles.img, { width: colW, height: colW * 1.22 }]}
              resizeMode="cover"
            />
          );
        })}
      </View>
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
