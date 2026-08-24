import { ImageBackground, View, Text, StyleSheet, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AlbumArt } from '@/components/archive/AlbumArt';
import { EraGallery } from '@/components/era/EraGallery';
import { EraVideos } from '@/components/era/EraVideoCard';
import { Volume2Art } from '@/components/era/WordmarkArt';
import { findAlbum, trackHasAudio } from '@/data/catalog';
import { useCatalog } from '@/context/CatalogContext';
import { useArchivePlayer, lengthForTrack } from '@/context/ArchivePlayerContext';
import { archive, font } from '@/theme/archive';

/** Era world: photography / posters / video, then music playing inside that room. */
export default function AlbumDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
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
  const gold = album.era.density === 'gold';
  const heroPhoto = album.era.hero === 'photo'
    ? album.gallery.find((g) => g.kind === 'photo' && g.source)?.source
    : undefined;
  const albumTracks = album.tracks.filter((t) => !t.extra);
  const extras = album.tracks.filter((t) => t.extra);
  const lyricsTracks = album.tracks.filter((t) => t.lyrics);

  const openPlayer = (index: number) => {
    if (album.tracks[index]?.unplayable) return;
    player.playTrack(album, index);
    router.push('/player');
  };

  const canPlayAlbum = album.tracks.some((t) => !t.unplayable);

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={[styles.hero, { minHeight: gold ? Math.min(width, 480) * 1.05 : 320 }]}>
          {heroPhoto ? (
            <ImageBackground source={heroPhoto} style={StyleSheet.absoluteFill} resizeMode="cover" />
          ) : album.coverSource ? (
            <ImageBackground source={album.coverSource} style={StyleSheet.absoluteFill} resizeMode="cover" />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: album.color }]} />
          )}
          <LinearGradient
            colors={['rgba(35,26,18,0.15)', 'rgba(35,26,18,0.55)', 'rgba(35,26,18,0.88)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={[styles.heroBar, { paddingTop: insets.top + 10 }]}>
            <Pressable onPress={() => router.back()} hitSlop={8}><Text style={styles.heroBack}>← Archive</Text></Pressable>
            <Text style={styles.recNo}>record no. {recNo}</Text>
          </View>
          <View style={styles.heroCopy}>
            <Text style={styles.heroTag}>{album.era.tagline}</Text>
            <Text style={styles.heroTitle}>{album.title}</Text>
            <Text style={styles.heroMeta}>{album.releasedLabel} · {albumTracks.length} tracks</Text>
          </View>
        </View>

        <View style={styles.intro}>
          {album.artMode === 'volume2' ? (
            <Volume2Art size={210} radius={0} />
          ) : (
            <AlbumArt album={album} size={210} radius={0} />
          )}
          <View style={[styles.rule, { backgroundColor: album.era.accent }]} />
          <Text style={styles.desc}>{album.desc}</Text>
          <Text style={styles.essay}>{album.era.essay}</Text>
          {album.era.credit ? <Text style={styles.credit}>{album.era.credit}</Text> : null}
          {album.audioNote ? <Text style={styles.audioNote}>{album.audioNote}</Text> : null}
          {canPlayAlbum ? (
            <Pressable
              onPress={() => openPlayer(album.tracks.findIndex((t) => !t.unplayable))}
              style={({ pressed }) => [styles.playBtn, pressed && { backgroundColor: archive.color.redDark }]}
            >
              <Text style={styles.playBtnText}>▶  Play in this world</Text>
            </Pressable>
          ) : null}
        </View>

        <EraGallery items={album.gallery} gold={gold} />
        <EraVideos videos={album.videos} />

        {lyricsTracks.length ? (
          <View style={styles.lyricsWrap}>
            <Text style={styles.listEyebrow}>Lyrics</Text>
            {lyricsTracks.map((tr) => (
              <View key={tr.id} style={styles.lyricCard}>
                <Text style={styles.lyricTitle}>{tr.title}</Text>
                <Text style={styles.lyricBody}>{tr.lyrics}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <View style={styles.listWrap}>
          <Text style={styles.listEyebrow}>{gold ? 'Listen inside this world' : 'Track List'}</Text>
          <View style={styles.list}>
            {albumTracks.map((tr) => {
              const i = album.tracks.indexOf(tr);
              const current = isCurrent && player.trackIndex === i;
              const live = trackHasAudio(tr);
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
                  <Text style={[styles.num, { color: current ? archive.color.red : archive.color.warmGrey }]}>{i + 1}</Text>
                  <View style={styles.trackMeta}>
                    <Text style={[styles.trackTitle, { fontWeight: current ? '600' : '400' }]}>{tr.title}</Text>
                    {locked ? <Text style={styles.unplayable}>{tr.unplayable}</Text> : null}
                    {!locked && !live && tr.streamTodo ? <Text style={styles.todo}>bundled fallback · stream TODO</Text> : null}
                    {live ? <Text style={styles.live}>plays in-app</Text> : null}
                  </View>
                  <Text style={styles.len}>{locked ? '—' : lengthForTrack(tr, i)}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {extras.length ? (
          <View style={styles.listWrap}>
            <Text style={styles.listEyebrow}>Deluxe extras</Text>
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
  back: { fontFamily: font.sans, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: archive.color.deepBlue },

  hero: { justifyContent: 'space-between' },
  heroBar: { paddingHorizontal: 20, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heroBack: { fontFamily: font.sans, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: archive.color.photoText, ...archive.photoShadow },
  recNo: { fontFamily: font.script, fontSize: 13, color: archive.color.photoTextSoft, ...archive.photoShadow },
  heroCopy: { paddingHorizontal: 24, paddingBottom: 28 },
  heroTag: { fontFamily: font.script, fontSize: 16, color: archive.color.photoText, ...archive.photoShadow },
  heroTitle: { fontFamily: font.sans, fontSize: 26, fontWeight: '600', letterSpacing: 0.5, color: archive.color.photoText, marginTop: 6, ...archive.photoShadow },
  heroMeta: { fontFamily: font.sans, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: archive.color.photoTextSoft, marginTop: 8, ...archive.photoShadow },

  intro: { paddingHorizontal: 28, paddingTop: 28, paddingBottom: 20, alignItems: 'center' },
  rule: { width: 36, height: 1, marginVertical: 14 },
  desc: { fontFamily: font.sans, fontSize: 13.5, lineHeight: 22, color: archive.color.bodySoft, textAlign: 'center', maxWidth: 320 },
  essay: { fontFamily: font.sans, fontSize: 13.5, lineHeight: 22, color: archive.color.body, textAlign: 'center', maxWidth: 330, marginTop: 12 },
  credit: { fontFamily: font.script, fontSize: 14, color: archive.color.warmGrey, marginTop: 10, textAlign: 'center' },
  audioNote: { fontFamily: font.sans, fontSize: 12.5, lineHeight: 20, color: archive.color.red, textAlign: 'center', marginTop: 12, maxWidth: 300 },
  playBtn: { marginTop: 20, backgroundColor: archive.color.red, paddingVertical: 13, paddingHorizontal: 34, borderRadius: 999 },
  playBtnText: { fontFamily: font.sans, fontSize: 12, fontWeight: '600', letterSpacing: 2, textTransform: 'uppercase', color: archive.color.paper },

  listWrap: { paddingHorizontal: 24, paddingBottom: 20 },
  listEyebrow: { fontFamily: font.sans, fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: archive.color.warmGrey, textAlign: 'center', marginBottom: 10 },
  list: { borderWidth: 1, borderColor: archive.color.line, backgroundColor: archive.color.paper },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, borderBottomWidth: 1, borderBottomColor: archive.color.rowBorder, paddingVertical: 13, paddingHorizontal: 16 },
  num: { width: 20, fontSize: 11, letterSpacing: 1, textAlign: 'right', fontFamily: font.sans },
  trackMeta: { flex: 1 },
  trackTitle: { flex: 1, fontSize: 13.5, letterSpacing: 0.3, color: archive.color.ink, fontFamily: font.sans },
  len: { fontSize: 11, color: archive.color.warmGrey, letterSpacing: 1, fontFamily: font.sans },
  todo: { fontFamily: font.sans, fontSize: 10, color: archive.color.warmGrey, marginTop: 3 },
  live: { fontFamily: font.sans, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: archive.color.teal, marginTop: 3 },
  unplayable: { fontFamily: font.sans, fontSize: 11, color: archive.color.warmGrey, marginTop: 3, lineHeight: 15 },

  lyricsWrap: { paddingHorizontal: 24, paddingBottom: 16, gap: 12 },
  lyricCard: { backgroundColor: archive.color.paper, borderWidth: 1, borderColor: archive.color.line, padding: 16 },
  lyricTitle: { fontFamily: font.sans, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: archive.color.warmGrey, marginBottom: 8 },
  lyricBody: { fontFamily: font.sans, fontSize: 14, lineHeight: 24, color: archive.color.body },
});
