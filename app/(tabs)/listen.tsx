import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Screen, AppHeader, SectionLabel, Tag, Button } from '@/components/ui';
import { colors, spacing, radius, serif, grad } from '@/theme/tokens';
import { Catalog, CatalogAlbum, CatalogTrack, playableTracks } from '@/data/catalog';
import { loadCatalog } from '@/services/catalog';
import { usePlayer, PlayerTrack } from '@/context/PlayerContext';

const toTrack = (album: CatalogAlbum, track: CatalogTrack): PlayerTrack => ({
  title: track.title,
  subtitle: `Said The Whale · ${album.title}`,
  gradient: album.gradient,
  source: track.source,
  uri: track.uri,
});

export default function Listen() {
  const router = useRouter();
  const { play, track, isPlaying } = usePlayer();
  const [catalog, setCatalog] = useState<Catalog | null>(null);

  useEffect(() => {
    let alive = true;
    loadCatalog().then((c) => {
      if (alive) setCatalog(c);
    });
    return () => {
      alive = false;
    };
  }, []);

  if (!catalog) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  const nowPlayable = playableTracks(catalog);

  return (
    <Screen>
      <AppHeader />

      {/* Featured */}
      <LinearGradient colors={grad.sunset} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }} style={styles.feature}>
        <LinearGradient colors={grad.cascadia} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }} style={styles.cover}>
          <Text style={styles.coverText}>Islands{'\n'}Disappear</Text>
        </LinearGradient>
        <Text style={styles.featureLabel}>STREAMS IN-APP · NO LINKS OUT</Text>
        <Text style={styles.featureTitle}>Your catalog, in your app</Text>
        {nowPlayable.length > 0 ? (
          <Button label="Play" icon="play" variant="light" onPress={() => play(toTrack(nowPlayable[0].album, nowPlayable[0].track))} />
        ) : null}
      </LinearGradient>

      {/* Playable now */}
      <SectionLabel>Now streaming — right in the app</SectionLabel>
      {nowPlayable.map(({ album, track: t }) => {
        const active = track.title === t.title;
        return (
          <Pressable key={t.id} style={styles.single} onPress={() => play(toTrack(album, t))}>
            <LinearGradient colors={album.gradient} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }} style={styles.singleArt}>
              <Ionicons name={active && isPlaying ? 'pause' : 'play'} size={16} color={colors.white} />
            </LinearGradient>
            <View style={styles.singleMeta}>
              <Text style={[styles.singleTitle, active && { color: colors.accent }]} numberOfLines={1}>
                {t.title}
              </Text>
              <Text style={styles.singleSub} numberOfLines={1}>
                Said The Whale · {album.title}
              </Text>
            </View>
            {active ? <Tag label={isPlaying ? 'Playing' : 'Paused'} /> : null}
          </Pressable>
        );
      })}

      {/* Albums */}
      <SectionLabel>Albums</SectionLabel>
      {catalog.albums.map((album) => {
        const count = album.tracks.length;
        return (
          <Pressable key={album.id} style={styles.albumRow} onPress={() => router.push(`/album/${album.id}`)}>
            <LinearGradient colors={album.gradient} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }} style={styles.albumArt}>
              <Ionicons name="musical-notes" size={18} color="rgba(255,255,255,0.9)" />
            </LinearGradient>
            <View style={styles.albumMeta}>
              <Text style={styles.albumTitle} numberOfLines={1}>
                {album.title}
              </Text>
              <Text style={styles.albumSub}>
                {album.year ? `${album.year} · ` : ''}
                {count > 0 ? `${count} ${count === 1 ? 'song' : 'songs'}` : 'Your masters go here'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.faint} />
          </Pressable>
        );
      })}

      <Text style={styles.note}>
        🎧 Streams natively inside the app — no Spotify, no links out. The three songs above play for real;
        upload your masters and every album fills in.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.ground },

  feature: { borderRadius: radius.xxl, padding: spacing.xl },
  cover: {
    width: 118,
    height: 118,
    borderRadius: radius.lg,
    justifyContent: 'flex-end',
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  coverText: { color: colors.white, fontFamily: serif, fontSize: 16, fontWeight: '700' },
  featureLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 11, letterSpacing: 1.4, fontWeight: '700' },
  featureTitle: { color: colors.white, fontFamily: serif, fontSize: 24, marginTop: 3, marginBottom: spacing.md },

  single: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm + 1 },
  singleArt: { width: 46, height: 46, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  singleMeta: { flex: 1, minWidth: 0 },
  singleTitle: { color: colors.ink, fontWeight: '700', fontSize: 14 },
  singleSub: { color: colors.muted, fontSize: 12, marginTop: 2 },

  albumRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm + 2 },
  albumArt: { width: 52, height: 52, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  albumMeta: { flex: 1, minWidth: 0 },
  albumTitle: { color: colors.ink, fontWeight: '700', fontSize: 14 },
  albumSub: { color: colors.muted, fontSize: 12, marginTop: 2 },

  note: { color: colors.muted, fontSize: 11.5, marginTop: spacing.xl, lineHeight: 17 },
});
