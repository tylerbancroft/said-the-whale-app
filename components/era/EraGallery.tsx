import { Image, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { EraGalleryItem } from '@/data/catalog';
import { archive, font } from '@/theme/archive';

/** Small photo strip under the cream museum card. Photos only — no captions. */
export function EraGallery({ items }: { items: EraGalleryItem[] }) {
  const { width } = useWindowDimensions();
  const pageW = Math.min(width, 390);
  const photos = items.filter((item) => item.kind === 'photo' && (item.source || item.uri));
  if (!photos.length) return null;

  const credit = photos.find((p) => p.credit)?.credit;

  return (
    <View style={styles.wrap}>
      {photos.map((item) => {
        const src = item.source ?? (item.uri ? { uri: item.uri } : undefined);
        if (!src) return null;
        return (
          <Image
            key={item.id}
            source={src}
            style={[styles.img, { width: pageW - 48, height: (pageW - 48) * 1.25 }]}
            resizeMode="cover"
          />
        );
      })}
      {credit ? <Text style={styles.credit}>{credit}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 24, paddingBottom: 8, alignItems: 'center', gap: 14 },
  img: { backgroundColor: '#EDE3CE' },
  credit: {
    fontFamily: font.sans,
    fontSize: 10,
    letterSpacing: 1.5,
    color: archive.color.warmGrey,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
});
