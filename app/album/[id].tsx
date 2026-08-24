import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AlbumArt } from '@/components/archive/AlbumArt';
import { EraGallery } from '@/components/era/EraGallery';
import { EraVideos } from '@/components/era/EraVideoCard';
import { findAlbum, bundledCatalog } from '@/data/catalog';
import { useCatalog } from '@/context/CatalogContext';
import { useArchivePlayer, lengthForTrack } from '@/context/ArchivePlayerContext';
import { archive, font } from '@/theme/archive';

export async function generateStaticParams(): Promise<{ id: string }[]> {
  return bundledCatalog.albums.map((a) => ({ id: a.id }));
}

/** Cream museum card — matches design/stw-redesign album detail. */
export default function AlbumDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { catalog } = useCatalog();
  const player = useArchivePlayer();

  const album = findAlbum(catalog, String(id));
  if (!album) {
    return (
      <View style={[styles.root, styles.center]}>
        <Text style={styles.missing}>Record not found.</Text>
        <Pressable onPress={() => router.back()}><Text style={styles.back}>← Archive</Text></Pressable>
      </View>
    );
  }

  const recNo = album.recordNo ?? 'EP';
  const isCurrent = player.album?.id === album.id;
  const albumTracks = album.tracks.filter((t) => !t.extra);
  const extras = album.tracks.filter((t) => t.extra);
  const galleryPhotos = album.gallery.filter((g) => g.kind === 'photo');
  const canPlayAlbum = album.tracks.some((t) => !t.unplayable);

  const openPlayer = (index: number) => {
    if (album.tracks[index]?.unplayable) return;
    player.playTrack(album, index);
    router.push('/player');
  };

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 14) }]}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Text style={styles.back}>← Archive</Text>
          </Pressable>
          <Text style={styles.recNo}>record no. {recNo}</Text>
        </View>

        <View style={styles.card}>
          <AlbumArt album={album} size={210} radius={0} />
          <Text style={styles.title}>{album.title}</Text>
          <Text style={styles.meta}>{album.year} · {albumTracks.length} tracks</Text>
          <View style={styles.rule} />
          {album.desc ? <Text style={styles.desc}>{album.desc}</Text> : null}
          {canPlayAlbum ? (
            <Pressable
              onPress={() => openPlayer(album.tracks.findIndex((t) => !t.unplayable))}
              style={({ pressed }) => [styles.playBtn, pressed && { backgroundColor: archive.color.redDark }]}
            >
              <Text style={styles.playBtnText}>▶  Play Album</Text>
            </Pressable>
          ) : null}
        </View>

        {galleryPhotos.length ? <EraGallery items={galleryPhotos} /> : null}
        {album.videos?.length ? <EraVideos videos={album.videos} /> : null}

        <View style={styles.listWrap}>
          <Text style={styles.listEyebrow}>Track List</Text>
          <View style={styles.list}>
            {albumTracks.map((tr) => {
              const i = album.tracks.indexOf(tr);
              const current = isCurrent && player.trackIndex === i;
              const locked = Boolean(tr.unplayable);
              return (
                <Pressable
                  key={tr.id}
                  onPress={() => openPlayer(i)}
                  disabled={locked}
                  style={({ pressed }) => [
                    styles.row,
                    current && { backgroundColor: archive.color.rowActive },
                    pressed && !current && !locked && { backgroundColor: archive.color.cream },
                    locked && { opacity: 0.55 },
                  ]}
                >
                  <Text style={[styles.num, { color: current ? archive.color.red : archive.color.warmGrey }]}>
                    {albumTracks.indexOf(tr) + 1}
                  </Text>
                  <Text style={[styles.trackTitle, { fontWeight: current ? '600' : '400' }]}>{tr.title}</Text>
                  <Text style={styles.len}>{locked ? '—' : lengthForTrack(tr, i)}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {extras.length ? (
          <View style={styles.listWrap}>
            <View style={styles.list}>
              {extras.map((tr) => {
                const i = album.tracks.indexOf(tr);
                const current = isCurrent && player.trackIndex === i;
                return (
                  <Pressable
                    key={tr.id}
                    onPress={() => openPlayer(i)}
                    style={({ pressed }) => [
                      styles.row,
                      current && { backgroundColor: archive.color.rowActive },
                      pressed && !current && { backgroundColor: archive.color.cream },
                    ]}
                  >
                    <Text style={styles.num}>+</Text>
                    <Text style={styles.trackTitle}>{tr.title}</Text>
                    <Text style={styles.len}>{lengthForTrack(tr, i)}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: archive.color.cream },
  center: { alignItems: 'center', justifyContent: 'center', gap: 12 },
  missing: { fontFamily: font.sans, color: archive.color.body },

  topBar: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: archive.color.line,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  back: {
    fontFamily: font.sans,
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: archive.color.deepBlue,
  },
  recNo: { fontFamily: font.script, fontSize: 13, color: archive.color.warmGrey },

  card: { paddingHorizontal: 28, paddingTop: 28, paddingBottom: 20, alignItems: 'center' },
  title: {
    fontFamily: font.sans,
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: 1,
    color: archive.color.ink,
    textAlign: 'center',
    marginTop: 22,
  },
  meta: {
    fontFamily: font.sans,
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: archive.color.warmGrey,
    marginTop: 6,
  },
  rule: { width: 36, height: 1, backgroundColor: archive.color.red, marginVertical: 14 },
  desc: {
    fontFamily: font.sans,
    fontSize: 13.5,
    lineHeight: 22,
    color: archive.color.bodySoft,
    textAlign: 'center',
    maxWidth: 300,
  },
  playBtn: {
    marginTop: 20,
    backgroundColor: archive.color.red,
    paddingVertical: 13,
    paddingHorizontal: 34,
    borderRadius: 999,
  },
  playBtnText: {
    fontFamily: font.sans,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: archive.color.paper,
  },

  listWrap: { paddingHorizontal: 24, paddingBottom: 20 },
  listEyebrow: {
    fontFamily: font.sans,
    fontSize: 11,
    letterSpacing: 4,
    textTransform: 'uppercase',
    color: archive.color.warmGrey,
    textAlign: 'center',
    marginBottom: 10,
  },
  list: { borderWidth: 1, borderColor: archive.color.line, backgroundColor: archive.color.paper },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: archive.color.rowBorder,
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  num: { width: 22, fontSize: 11, letterSpacing: 1, textAlign: 'right', fontFamily: font.sans },
  trackTitle: { flex: 1, fontSize: 13.5, letterSpacing: 0.3, color: archive.color.ink, fontFamily: font.sans },
  len: { fontSize: 11, color: archive.color.warmGrey, letterSpacing: 1, fontFamily: font.sans },
});
