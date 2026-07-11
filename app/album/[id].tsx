import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { AlbumArt } from '@/components/archive/AlbumArt';
import { ALBUMS, lengthForTrack, useArchivePlayer } from '@/context/ArchivePlayerContext';
import { archive, font } from '@/theme/archive';

/** Screen 2 — Album detail: a cream "museum card" with the track list. */
export default function AlbumDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const player = useArchivePlayer();

  const album = ALBUMS.find((a) => String(a.id) === String(id));
  if (!album) {
    return (
      <View style={[styles.root, styles.center]}>
        <Text style={styles.missing}>Record not found.</Text>
        <Pressable onPress={() => router.back()}><Text style={styles.back}>← Archive</Text></Pressable>
      </View>
    );
  }

  const recNo = String(album.id + 1).padStart(2, '0');
  const isCurrent = player.album?.id === album.id;

  const openPlayer = (index: number) => {
    player.playTrack(album, index);
    router.push('/player');
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}><Text style={styles.back}>← Archive</Text></Pressable>
        <Text style={styles.recNo}>record no. {recNo}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        <View style={styles.hero}>
          <AlbumArt album={album} size={210} radius={0} />
          <Text style={styles.title}>{album.title}</Text>
          <Text style={styles.meta}>{album.year} · {album.tracks.length} tracks</Text>
          <View style={styles.rule} />
          <Text style={styles.desc}>{album.desc}</Text>
          <Pressable
            onPress={() => openPlayer(0)}
            style={({ pressed }) => [styles.playBtn, pressed && { backgroundColor: archive.color.redDark }]}
          >
            <Text style={styles.playBtnText}>▶  Play Album</Text>
          </Pressable>
        </View>

        <View style={styles.listWrap}>
          <Text style={styles.listEyebrow}>Track List</Text>
          <View style={styles.list}>
            {album.tracks.map((t, i) => {
              const current = isCurrent && player.trackIndex === i;
              return (
                <Pressable
                  key={i}
                  onPress={() => openPlayer(i)}
                  style={({ pressed }) => [
                    styles.row,
                    current && { backgroundColor: archive.color.rowActive },
                    pressed && !current && { backgroundColor: archive.color.cream },
                  ]}
                >
                  <Text style={[styles.num, { color: current ? archive.color.red : archive.color.warmGrey }]}>{i + 1}</Text>
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
  center: { alignItems: 'center', justifyContent: 'center', gap: 12 },
  missing: { fontFamily: font.sans, color: archive.color.body },

  header: { paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: archive.color.line, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back: { fontFamily: font.sans, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: archive.color.deepBlue },
  recNo: { fontFamily: font.script, fontSize: 13, color: archive.color.warmGrey },

  hero: { paddingHorizontal: 28, paddingTop: 28, paddingBottom: 20, alignItems: 'center' },
  title: { fontFamily: font.sans, fontSize: 22, fontWeight: '600', letterSpacing: 1, marginTop: 22, color: archive.color.ink, textAlign: 'center' },
  meta: { fontFamily: font.sans, fontSize: 11, letterSpacing: 3, color: archive.color.warmGrey, marginTop: 6, textTransform: 'uppercase' },
  rule: { width: 36, height: 1, backgroundColor: archive.color.red, marginVertical: 14 },
  desc: { fontFamily: font.sans, fontSize: 13.5, lineHeight: 22, color: archive.color.bodySoft, textAlign: 'center', maxWidth: 300 },
  playBtn: { marginTop: 20, backgroundColor: archive.color.red, paddingVertical: 13, paddingHorizontal: 34, borderRadius: 999 },
  playBtnText: { fontFamily: font.sans, fontSize: 12, fontWeight: '600', letterSpacing: 3, textTransform: 'uppercase', color: archive.color.paper },

  listWrap: { paddingHorizontal: 24, paddingBottom: 28 },
  listEyebrow: { fontFamily: font.sans, fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: archive.color.warmGrey, textAlign: 'center', marginBottom: 10 },
  list: { borderWidth: 1, borderColor: archive.color.line, backgroundColor: archive.color.paper },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, borderBottomWidth: 1, borderBottomColor: archive.color.rowBorder, paddingVertical: 13, paddingHorizontal: 16 },
  num: { width: 20, fontSize: 11, letterSpacing: 1, textAlign: 'right', fontFamily: font.sans },
  trackTitle: { flex: 1, fontSize: 13.5, letterSpacing: 0.3, color: archive.color.ink, fontFamily: font.sans },
  len: { fontSize: 11, color: archive.color.warmGrey, letterSpacing: 1, fontFamily: font.sans },
});
