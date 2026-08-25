import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ImageBackground, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { AlbumArt } from '@/components/archive/AlbumArt';
import { PlayAlbumButton } from '@/components/archive/PlayControl';
import { SaveeeGallery, MediaLightbox } from '@/components/era/SaveeeGallery';
import { EraGallery } from '@/components/era/EraGallery';
import {
  findAlbum,
  bundledCatalog,
  trackHasAudio,
  firstPlayableIndex,
  heroImageOf,
  worldTilesOf,
  type WorldTile,
} from '@/data/catalog';
import { useCatalog } from '@/context/CatalogContext';
import { useArchivePlayer, lengthForTrack } from '@/context/ArchivePlayerContext';
import { archive, font } from '@/theme/archive';

export async function generateStaticParams(): Promise<{ id: string }[]> {
  return bundledCatalog.albums.map((a) => ({ id: a.id }));
}

/** Album world: era photo when the overlay has one, else the cream museum card. */
export default function AlbumDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { catalog } = useCatalog();
  const player = useArchivePlayer();
  const [open, setOpen] = useState<WorldTile | null>(null);

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
  const canPlayAlbum = firstPlayableIndex(album) >= 0;
  const hero = heroImageOf(album);
  const tiles = worldTilesOf(album);
  const photoWorld = Boolean(hero);
  const heroH = Math.max(520, Math.min(height * 0.78, 680));
  const ink = photoWorld ? archive.color.photoText : archive.color.ink;
  const meta = photoWorld ? archive.color.photoTextSoft : archive.color.warmGrey;
  const shadow = photoWorld ? archive.photoShadow : undefined;

  const openPlayer = (index: number) => {
    if (!trackHasAudio(album.tracks[index])) return;
    player.playTrack(album, index);
    router.push('/player');
  };

  const trackList = (
    <>
      <View style={styles.listWrap}>
        <Text style={[styles.listEyebrow, photoWorld && { color: archive.color.photoTextSoft }]}>Track List</Text>
        <View style={styles.list}>
          {albumTracks.map((tr) => {
            const i = album.tracks.indexOf(tr);
            const current = isCurrent && player.trackIndex === i;
            const locked = !trackHasAudio(tr);
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
              const locked = !trackHasAudio(tr);
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
                  <Text style={styles.num}>+</Text>
                  <Text style={styles.trackTitle}>{tr.title}</Text>
                  <Text style={styles.len}>{locked ? '—' : lengthForTrack(tr, i)}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : null}
    </>
  );

  const identity = (
    <View style={[styles.card, photoWorld && styles.cardOnPhoto]}>
      <AlbumArt album={album} size={210} radius={0} />
      <Text style={[styles.title, { color: ink }, shadow]}>{album.title}</Text>
      <Text style={[styles.meta, { color: meta }, shadow]}>{album.year} · {albumTracks.length} tracks</Text>
      <View style={styles.rule} />
      {album.desc && !photoWorld ? <Text style={styles.desc}>{album.desc}</Text> : null}
      {canPlayAlbum ? (
        <PlayAlbumButton onPress={() => openPlayer(firstPlayableIndex(album))} />
      ) : null}
    </View>
  );

  return (
    <View style={[styles.root, photoWorld && styles.rootPhoto]}>
      {photoWorld && hero ? (
        <ImageBackground source={hero} style={StyleSheet.absoluteFill} resizeMode="cover" />
      ) : null}
      {photoWorld ? (
        <LinearGradient
          colors={archive.scrim as unknown as [string, string, ...string[]]}
          locations={archive.scrimLocations as unknown as [number, number, ...number[]]}
          style={StyleSheet.absoluteFill}
        />
      ) : null}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 14) }, photoWorld && styles.topBarPhoto]}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Text style={[styles.back, photoWorld && styles.backPhoto, shadow]}>← Archive</Text>
          </Pressable>
          <Text style={[styles.recNo, photoWorld && { color: archive.color.photoTextSoft }, shadow]}>record no. {recNo}</Text>
        </View>

        {photoWorld ? <View style={{ minHeight: heroH - 80 }}>{identity}</View> : identity}

        {trackList}

        {tiles.length ? (
          <SaveeeGallery tiles={tiles} onOpen={setOpen} />
        ) : album.gallery.filter((g) => g.kind === 'photo').length ? (
          <EraGallery items={album.gallery.filter((g) => g.kind === 'photo')} />
        ) : null}
      </ScrollView>
      {open ? (
        <MediaLightbox
          tile={open}
          onClose={() => setOpen(null)}
          onVideoStart={() => {
            try {
              player.pause();
            } catch {}
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: archive.color.cream, overflow: 'hidden' },
  rootPhoto: { backgroundColor: '#1a1410' },
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
  topBarPhoto: { borderBottomColor: 'transparent' },
  back: {
    fontFamily: font.sans,
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: archive.color.deepBlue,
  },
  backPhoto: { color: archive.color.photoText },
  recNo: { fontFamily: font.script, fontSize: 13, color: archive.color.warmGrey },

  card: { paddingHorizontal: 28, paddingTop: 28, paddingBottom: 20, alignItems: 'center' },
  cardOnPhoto: { paddingTop: 18 },
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
    minHeight: 48,
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  num: { width: 22, fontSize: 11, letterSpacing: 1, textAlign: 'right', fontFamily: font.sans },
  trackTitle: { flex: 1, fontSize: 13.5, letterSpacing: 0.3, color: archive.color.ink, fontFamily: font.sans },
  len: { fontSize: 11, color: archive.color.warmGrey, letterSpacing: 1, fontFamily: font.sans },
});
