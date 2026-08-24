import { Image, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { EraGalleryItem } from '@/data/catalog';
import { archive, font } from '@/theme/archive';

export function EraGallery({ items, gold }: { items: EraGalleryItem[]; gold?: boolean }) {
  const { width } = useWindowDimensions();
  const pageW = Math.min(width, 390);
  if (!items.length) return null;

  if (gold) {
    return (
      <View style={styles.goldWrap}>
        <Text style={styles.eyebrow}>Photographs</Text>
        {items.map((item, i) => {
          const src = item.source ?? (item.uri ? { uri: item.uri } : undefined);
          if (!src) return null;
          const featured = item.featured || i === 0;
          return (
            <View key={item.id} style={[styles.goldCard, featured && styles.goldFeatured]}>
              <Image source={src} style={[styles.goldImg, { height: featured ? pageW * 0.92 : pageW * 0.62 }]} resizeMode="cover" />
              <Text style={styles.caption}>{item.caption}</Text>
              {item.credit ? <Text style={styles.credit}>{item.credit}</Text> : null}
            </View>
          );
        })}
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.eyebrow}>In this world</Text>
      <ScrollView horizontal pagingEnabled={false} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {items.map((item) => {
          const src = item.source ?? (item.uri ? { uri: item.uri } : undefined);
          if (!src) return null;
          return (
            <View key={item.id} style={[styles.card, { width: pageW * 0.72 }]}>
              <Image source={src} style={styles.img} resizeMode="cover" />
              <Text style={styles.caption}>{item.caption}</Text>
              {item.credit ? <Text style={styles.credit}>{item.credit}</Text> : null}
              <Text style={styles.kind}>{item.kind}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

export function EraCoverStudy({ source, caption }: { source: number; caption: string }) {
  const { width } = useWindowDimensions();
  const pageW = Math.min(width, 390);
  return (
    <View style={styles.study}>
      <Image source={source} style={{ width: pageW - 48, height: pageW - 48, alignSelf: 'center' }} resizeMode="cover" />
      <Text style={[styles.caption, { textAlign: 'center', paddingHorizontal: 28 }]}>{caption}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 8, marginBottom: 8 },
  goldWrap: { paddingHorizontal: 20, gap: 22, marginBottom: 12 },
  goldCard: { backgroundColor: archive.color.paper, borderWidth: 1, borderColor: archive.color.line, padding: 8, paddingBottom: 14 },
  goldFeatured: { padding: 0, paddingBottom: 16, borderWidth: 0, backgroundColor: 'transparent' },
  goldImg: { width: '100%', backgroundColor: '#EDE3CE' },
  eyebrow: {
    fontFamily: font.sans,
    fontSize: 11,
    letterSpacing: 4,
    textTransform: 'uppercase',
    color: archive.color.warmGrey,
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  row: { paddingHorizontal: 20, gap: 14 },
  card: { backgroundColor: archive.color.paper, borderWidth: 1, borderColor: archive.color.line, padding: 8, paddingBottom: 12 },
  img: { width: '100%', aspectRatio: 1, backgroundColor: '#EDE3CE' },
  caption: { fontFamily: font.sans, fontSize: 13, lineHeight: 19, color: archive.color.body, marginTop: 10 },
  credit: { fontFamily: font.script, fontSize: 13, color: archive.color.warmGrey, marginTop: 4 },
  kind: { fontFamily: font.sans, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: archive.color.warmGrey, marginTop: 8 },
  study: { marginVertical: 8 },
});
