import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

import { ArchiveHeader } from '@/components/archive/ArchiveHeader';
import { PhotoBackdrop } from '@/components/archive/PhotoBackdrop';
import { AlbumArt } from '@/components/archive/AlbumArt';
import { ALBUMS } from '@/data/redesign';
import { archive, font } from '@/theme/archive';

const W = Dimensions.get('window').width;
const SIDE = archive.space.side; // 26
const COL_GAP = archive.space.gapH; // 40
const TILE = Math.floor((Math.min(W, 480) - SIDE * 2 - COL_GAP) / 2);

/** Screen 1 — Albums (home): the Record Archive over a band photo. */
export default function AlbumsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(t);
  }, []);

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
              {ALBUMS.map((al) => (
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

            <Text style={styles.footer}>eight records, two thousand seven to present</Text>
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
  scroll: { paddingTop: 28, paddingBottom: 32 },
  masthead: { alignItems: 'center', marginBottom: 24, paddingHorizontal: 22 },
  eyebrow: { fontFamily: font.sans, fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: 'rgba(247,241,227,0.85)', ...shadow },
  title: { fontFamily: font.sans, fontSize: 24, fontWeight: '500', letterSpacing: 1, marginTop: 4, color: archive.color.photoText, ...shadow },
  rule: { width: 36, height: 1, backgroundColor: archive.color.photoText, opacity: 0.9, marginTop: 12 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: SIDE },
  tile: { width: TILE, marginBottom: archive.space.gapV, alignItems: 'center' },
  tileTitle: { fontFamily: font.sans, fontSize: 12.5, fontWeight: '600', letterSpacing: 0.5, marginTop: 11, lineHeight: 17, textAlign: 'center', color: archive.color.photoText, ...shadow, textShadowRadius: 8 },
  tileYear: { fontFamily: font.sans, fontSize: 11, letterSpacing: 2, marginTop: 3, color: archive.color.photoTextSoft, ...shadow, textShadowRadius: 8 },

  footer: { fontFamily: font.script, fontSize: 14, textAlign: 'center', marginTop: 26, paddingHorizontal: 22, color: 'rgba(247,241,227,0.9)', ...shadow },

  // loading state (cream)
  loading: { flex: 1, backgroundColor: archive.color.cream, alignItems: 'center', paddingTop: 44, paddingHorizontal: 24, gap: 28 },
  spinRing: { width: 56, height: 56, borderRadius: 28, borderWidth: 1, borderColor: archive.color.line, alignItems: 'center', justifyContent: 'center' },
  spinInner: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: archive.color.warmGrey, borderStyle: 'dashed' },
  loadingCaption: { fontFamily: font.script, fontSize: 15, color: archive.color.warmGrey },
  loadGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%' },
  loadTile: { width: '47%', borderWidth: 1, borderColor: archive.color.line, backgroundColor: archive.color.paper, padding: 10, marginBottom: 18 },
  loadArt: { aspectRatio: 1, backgroundColor: '#EDE3CE' },
  loadLine: { height: 10, width: '70%', alignSelf: 'center', marginTop: 12, backgroundColor: '#EDE3CE' },
});
