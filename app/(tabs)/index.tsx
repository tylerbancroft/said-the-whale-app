import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

import { ArchiveHeader } from '@/components/archive/ArchiveHeader';
import { PhotoBackdrop } from '@/components/archive/PhotoBackdrop';
import { AlbumArt } from '@/components/archive/AlbumArt';
import { appendixAlbums, studioAlbums } from '@/data/catalog';
import { useCatalog } from '@/context/CatalogContext';
import { archive, font } from '@/theme/archive';

const W = Math.min(Dimensions.get('window').width, 390);
const SIDE = archive.space.side;
const COL_GAP = archive.space.gapH;
const TILE = Math.floor((W - SIDE * 2 - COL_GAP) / 2);

/** Screen 1 — Albums (home): photo background, real sleeves, title + year. */
export default function AlbumsScreen() {
  const router = useRouter();
  const { catalog, ready } = useCatalog();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), ready ? 400 : 1400);
    return () => clearTimeout(t);
  }, [ready]);

  const studios = studioAlbums(catalog);
  const eps = appendixAlbums(catalog);

  return (
    <View style={styles.root}>
      <ArchiveHeader />
      {loading ? (
        <AlbumsLoading />
      ) : (
        <PhotoBackdrop>
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            <View style={styles.masthead}>
              <Text style={styles.eyebrow}>The Complete</Text>
              <Text style={styles.title}>Record Archive</Text>
              <View style={styles.rule} />
            </View>

            <View style={styles.grid}>
              {studios.map((al) => (
                <Pressable
                  key={al.id}
                  onPress={() => router.push(`/album/${al.id}`)}
                  style={({ pressed }) => [styles.tile, pressed && { transform: [{ translateY: 1 }] }]}
                >
                  <AlbumArt album={al} size={TILE} />
                  <Text style={styles.tileTitle} numberOfLines={2}>{al.short}</Text>
                  <Text style={styles.tileYear}>{al.year}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.footer}>nine records, two thousand seven to present</Text>

            <View style={styles.appendix}>
              <Text style={styles.appendixEyebrow}>EPs</Text>
              {eps.map((al) => (
                <Pressable
                  key={al.id}
                  onPress={() => router.push(`/album/${al.id}`)}
                  style={({ pressed }) => [styles.epRow, pressed && { opacity: 0.85 }]}
                >
                  <AlbumArt album={al} size={56} radius={8} />
                  <View style={styles.epMeta}>
                    <Text style={styles.epTitle}>{al.title}</Text>
                    <Text style={styles.epYear}>{al.year}</Text>
                  </View>
                  <Text style={styles.epArrow}>→</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </PhotoBackdrop>
      )}
    </View>
  );
}

function AlbumsLoading() {
  return (
    <View style={styles.loading}>
      <View style={styles.spinRing}>
        <View style={styles.spinInner} />
      </View>
      <Text style={styles.loadingCaption}>fetching the archive…</Text>
      <View style={styles.loadGrid}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={styles.loadTile}>
            <View style={styles.loadArt} />
            <View style={styles.loadLine} />
          </View>
        ))}
      </View>
    </View>
  );
}

const shadow = archive.photoShadow;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: archive.color.cream },
  scroll: { paddingTop: 28, paddingBottom: 48 },
  masthead: { alignItems: 'center', marginBottom: 24, paddingHorizontal: 22 },
  eyebrow: { fontFamily: font.sans, fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: 'rgba(247,241,227,0.85)', ...shadow },
  title: { fontFamily: font.sans, fontSize: 24, fontWeight: '500', letterSpacing: 1, marginTop: 4, color: archive.color.photoText, ...shadow },
  rule: { width: 36, height: 1, backgroundColor: archive.color.photoText, opacity: 0.9, marginTop: 12 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: SIDE },
  tile: { width: TILE, marginBottom: archive.space.gapV, alignItems: 'center' },
  tileTitle: { fontFamily: font.sans, fontSize: 12.5, fontWeight: '600', letterSpacing: 0.5, marginTop: 11, lineHeight: 17, textAlign: 'center', color: archive.color.photoText, ...shadow, textShadowRadius: 8 },
  tileYear: { fontFamily: font.sans, fontSize: 11, letterSpacing: 1, marginTop: 3, color: archive.color.photoTextSoft, ...shadow, textShadowRadius: 8, textAlign: 'center' },

  footer: { fontFamily: font.script, fontSize: 14, textAlign: 'center', marginTop: 8, paddingHorizontal: 22, color: 'rgba(247,241,227,0.9)', ...shadow },

  appendix: { marginTop: 36, marginHorizontal: 18, padding: 16, backgroundColor: 'rgba(35,26,18,0.42)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)', borderRadius: 16 },
  appendixEyebrow: { fontFamily: font.sans, fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: archive.color.photoTextSoft, textAlign: 'center', marginBottom: 8 },
  epRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(255,255,255,0.16)' },
  epMeta: { flex: 1 },
  epTitle: { fontFamily: font.sans, fontSize: 13, fontWeight: '600', color: archive.color.photoText },
  epYear: { fontFamily: font.sans, fontSize: 11, color: archive.color.photoTextSoft, marginTop: 2 },
  epArrow: { color: archive.color.photoTextSoft, fontSize: 16 },

  loading: { flex: 1, backgroundColor: archive.color.cream, alignItems: 'center', paddingTop: 44, paddingHorizontal: 24, gap: 28 },
  spinRing: { width: 56, height: 56, borderRadius: 28, borderWidth: 1, borderColor: archive.color.line, alignItems: 'center', justifyContent: 'center' },
  spinInner: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: archive.color.warmGrey, borderStyle: 'dashed' },
  loadingCaption: { fontFamily: font.script, fontSize: 15, color: archive.color.warmGrey },
  loadGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%' },
  loadTile: { width: '47%', borderWidth: 1, borderColor: archive.color.line, backgroundColor: archive.color.paper, padding: 10, marginBottom: 18 },
  loadArt: { aspectRatio: 1, backgroundColor: '#EDE3CE' },
  loadLine: { height: 10, width: '70%', alignSelf: 'center', marginTop: 12, backgroundColor: '#EDE3CE' },
});
