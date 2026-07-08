import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing, radius, serif } from '@/theme/tokens';
import { Catalog, CatalogAlbum, findAlbum } from '@/data/catalog';
import { loadCatalog } from '@/services/catalog';
import { usePlayer, PlayerTrack } from '@/context/PlayerContext';
import { Tag } from '@/components/ui';

export default function AlbumDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { play, track, isPlaying } = usePlayer();
  const [catalog, setCatalog] = useState<Catalog | null>(null);

  useEffect(() => {
    let alive = true;
    loadCatalog().then((c) => alive && setCatalog(c));
    return () => {
      alive = false;
    };
  }, []);

  const album: CatalogAlbum | undefined = catalog && id ? findAlbum(catalog, id) : undefined;

  return (
    <View style={styles.screen}>
      {/* Back */}
      <Pressable onPress={() => router.back()} style={[styles.back, { top: insets.top + spacing.sm }]} hitSlop={10}>
        <Ionicons name="chevron-back" size={26} color={colors.ink} />
      </Pressable>

      {!catalog ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : !album ? (
        <View style={styles.center}>
          <Text style={styles.empty}>Album not found.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
          {/* Header art */}
          <LinearGradient colors={album.gradient} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1.1 }} style={[styles.header, { paddingTop: insets.top + 64 }]}>
            <View style={styles.headerArt} />
            <Text style={styles.headerTitle}>{album.title}</Text>
            <Text style={styles.headerMeta}>
              {album.year ? `${album.year} · ` : ''}Said The Whale
            </Text>
          </LinearGradient>

          {/* Tracks */}
          <View style={styles.body}>
            {album.tracks.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="cloud-upload-outline" size={28} color={colors.foam} />
                <Text style={styles.emptyTitle}>Your masters go here</Text>
                <Text style={styles.emptyText}>
                  Upload this album’s songs to your audio hosting and they’ll stream right here — no app update
                  needed.
                </Text>
              </View>
            ) : (
              album.tracks.map((t, i) => {
                const playable = t.source != null || !!t.uri;
                const active = track.title === t.title;
                const pt: PlayerTrack = {
                  title: t.title,
                  subtitle: `Said The Whale · ${album.title}`,
                  gradient: album.gradient,
                  source: t.source,
                  uri: t.uri,
                };
                return (
                  <Pressable
                    key={t.id}
                    style={styles.trackRow}
                    disabled={!playable}
                    onPress={() => play(pt)}
                  >
                    <Text style={[styles.trackNum, active && { color: colors.accent }]}>
                      {active && isPlaying ? '▶' : i + 1}
                    </Text>
                    <View style={styles.trackMeta}>
                      <Text style={[styles.trackTitle, active && { color: colors.accent }, !playable && { color: colors.faint }]} numberOfLines={1}>
                        {t.title}
                      </Text>
                    </View>
                    {t.membersOnly ? <Tag label="Members" tone="gold" /> : null}
                    {!playable ? (
                      <Text style={styles.soon}>Soon</Text>
                    ) : (
                      <Ionicons name={active && isPlaying ? 'pause' : 'play'} size={17} color={colors.accent} />
                    )}
                  </Pressable>
                );
              })
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ground },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { color: colors.muted },

  back: {
    position: 'absolute',
    left: spacing.md,
    zIndex: 10,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  header: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
  headerArt: { width: 130, height: 130, borderRadius: radius.lg, backgroundColor: 'rgba(255,255,255,0.15)', marginBottom: spacing.lg },
  headerTitle: { color: colors.white, fontFamily: serif, fontSize: 30, lineHeight: 34 },
  headerMeta: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: spacing.xs, fontWeight: '600' },

  body: { paddingHorizontal: spacing.xl, paddingTop: spacing.md },

  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  trackNum: { color: colors.muted, fontSize: 14, fontWeight: '700', width: 20, textAlign: 'center' },
  trackMeta: { flex: 1, minWidth: 0 },
  trackTitle: { color: colors.ink, fontSize: 15, fontWeight: '600' },
  soon: { color: colors.faint, fontSize: 11, fontWeight: '700' },

  emptyState: { alignItems: 'center', paddingVertical: spacing.xxl, gap: spacing.sm },
  emptyTitle: { color: colors.ink, fontSize: 16, fontWeight: '700', marginTop: spacing.xs },
  emptyText: { color: colors.muted, fontSize: 13, textAlign: 'center', lineHeight: 19, maxWidth: 300 },
});
