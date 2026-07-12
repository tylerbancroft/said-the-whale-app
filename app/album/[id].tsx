import { View, Text, Image, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Monogram } from '@/components/archive/Monogram';
import { ALBUMS, lengthForTrack, useArchivePlayer } from '@/context/ArchivePlayerContext';
import { initialsOf } from '@/data/redesign';
import { coverFor } from '@/assets/covers';
import { archive, font, contrastOn, withAlpha } from '@/theme/archive';

/**
 * Screen 2 — Album detail, "leaned harder" into Wes Anderson: the hero is a
 * bold poster in the record's own color, with bracketed eyebrow, star rating,
 * and monogram; the track list sits on cream below with the color carried
 * through the accents.
 */
export default function AlbumDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const player = useArchivePlayer();

  const album = ALBUMS.find((a) => String(a.id) === String(id));
  if (!album) {
    return (
      <View style={[styles.root, styles.center]}>
        <Pressable onPress={() => router.back()}><Text style={styles.backCream}>← Archive</Text></Pressable>
      </View>
    );
  }

  const recNo = String(album.id + 1).padStart(2, '0');
  const isCurrent = player.album?.id === album.id;
  const c = contrastOn(album.color);
  const onColorText = { color: c.ink };
  const onColorSoft = { color: c.soft };

  const openPlayer = (index: number) => {
    player.playTrack(album, index);
    router.push('/player');
  };

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        {/* Poster hero — the record's own color */}
        <View style={[styles.hero, { backgroundColor: album.color, paddingTop: insets.top + 14 }]}>
          <View style={[styles.heroFrame, { borderColor: c.frame }]} pointerEvents="none" />
          <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backAbs}>
            <Text style={[styles.back, onColorText]}>← Archive</Text>
          </Pressable>

          <Text style={[styles.eyebrow, onColorSoft]}>[ Record No. {recNo} ]</Text>
          {coverFor(album.id) ? (
            <Image source={coverFor(album.id)!} style={[styles.heroCover, { borderColor: c.frame }]} resizeMode="cover" />
          ) : (
            <View style={{ marginTop: 16 }}>
              <Monogram label={initialsOf(album)} size={150} color={c.ink} />
            </View>
          )}
          <Text style={[styles.title, onColorText]}>{album.title}</Text>
          <Text style={[styles.stars, onColorSoft]}>✦ ✦ ✦ ✦ ✦</Text>
          <Text style={[styles.meta, onColorSoft]}>
            {album.year && album.year !== '—' ? `${album.year}  ·  ` : ''}{album.tracks.length} tracks
          </Text>
        </View>

        {/* Cream card — description + play + track list, accented in the album color */}
        <View style={styles.card}>
          <Text style={styles.desc}>{album.desc}</Text>
          <Pressable
            onPress={() => openPlayer(0)}
            style={({ pressed }) => [
              styles.playBtn,
              { backgroundColor: album.color },
              c.light && { borderWidth: 1, borderColor: 'rgba(70,55,43,0.18)' },
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={[styles.playBtnText, { color: c.ink }]}>▶  Play Album</Text>
          </Pressable>

          <Text style={styles.listEyebrow}>· Track List ·</Text>
          <View style={styles.list}>
            {album.tracks.map((t, i) => {
              const current = isCurrent && player.trackIndex === i;
              return (
                <Pressable
                  key={i}
                  onPress={() => openPlayer(i)}
                  style={({ pressed }) => [
                    styles.row,
                    current && { backgroundColor: withAlpha(album.color, 0.16) },
                    pressed && !current && { backgroundColor: archive.color.cream },
                  ]}
                >
                  <Text style={[styles.num, { color: current ? album.color : archive.color.warmGrey }]}>{i + 1}</Text>
                  <Text style={[styles.trackTitle, { fontWeight: current ? '600' : '400' }]}>{t}</Text>
                  <Text style={styles.len}>{lengthForTrack(i)}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: archive.color.cream },
  center: { alignItems: 'center', justifyContent: 'center' },
  backCream: { fontFamily: font.sans, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: archive.color.deepBlue },

  hero: { paddingHorizontal: 28, paddingBottom: 30, alignItems: 'center' },
  heroFrame: { position: 'absolute', top: 10, left: 10, right: 10, bottom: 10, borderWidth: 1 },
  heroCover: { marginTop: 16, width: 188, height: 188, borderWidth: 1 },
  backAbs: { position: 'absolute', left: 20, top: undefined, paddingTop: 0, alignSelf: 'flex-start', zIndex: 2 },
  back: { fontFamily: font.sans, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase' },
  eyebrow: { fontFamily: font.sans, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', marginTop: 30 },
  title: { fontFamily: font.sans, fontSize: 23, fontWeight: '600', letterSpacing: 0.5, marginTop: 18, textAlign: 'center' },
  stars: { fontFamily: font.sans, fontSize: 10, letterSpacing: 3, marginTop: 12 },
  meta: { fontFamily: font.sans, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', marginTop: 10 },

  card: { paddingHorizontal: 28, paddingTop: 24, alignItems: 'center' },
  desc: { fontFamily: font.sans, fontSize: 13.5, lineHeight: 22, color: archive.color.bodySoft, textAlign: 'center', maxWidth: 300 },
  playBtn: { marginTop: 20, paddingVertical: 13, paddingHorizontal: 34, borderRadius: 999 },
  playBtnText: { fontFamily: font.sans, fontSize: 12, fontWeight: '600', letterSpacing: 3, textTransform: 'uppercase' },
  listEyebrow: { fontFamily: font.sans, fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: archive.color.warmGrey, marginTop: 26, marginBottom: 10 },
  list: { alignSelf: 'stretch', borderWidth: 1, borderColor: archive.color.line, backgroundColor: archive.color.paper },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, borderBottomWidth: 1, borderBottomColor: archive.color.rowBorder, paddingVertical: 13, paddingHorizontal: 16 },
  num: { width: 20, fontSize: 11, letterSpacing: 1, textAlign: 'right', fontFamily: font.sans },
  trackTitle: { flex: 1, fontSize: 13.5, letterSpacing: 0.3, color: archive.color.ink, fontFamily: font.sans },
  len: { fontSize: 11, color: archive.color.warmGrey, letterSpacing: 1, fontFamily: font.sans },
});
