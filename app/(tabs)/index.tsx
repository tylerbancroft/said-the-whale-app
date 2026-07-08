import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import { Screen, AppHeader, SectionLabel, Card, Tag, Art, Button, Avatar, DateChip } from '@/components/ui';
import { colors, spacing, radius, serif, grad } from '@/theme/tokens';
import { albums, shows } from '@/data/mock';
import { nativeTracks, nativeSubtitle } from '@/data/tracks';
import { usePlayer } from '@/context/PlayerContext';

export default function Home() {
  const router = useRouter();
  const { play } = usePlayer();
  const nextShow = shows[0];

  return (
    <Screen>
      <AppHeader />

      {/* Members-only new drop */}
      <LinearGradient colors={grad.hero} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1.4 }} style={styles.hero}>
        <View style={styles.heroKick}>
          <Tag label="Members only" tone="gold" />
          <Text style={styles.heroKickText}>New drop</Text>
        </View>
        <Text style={styles.heroTitle}>Demo: “Winter Coats” (unreleased)</Text>
        <Text style={styles.heroSub}>A rough take we’ve never put out. Yours because you’re in the Pod.</Text>
        <View style={styles.heroRow}>
          <Button
            label="Play"
            icon="play"
            onPress={() =>
              play({
                title: nativeTracks[0].title,
                subtitle: nativeSubtitle(nativeTracks[0]),
                gradient: nativeTracks[0].gradient,
                source: nativeTracks[0].source,
              })
            }
          />
          <Button label="Save" variant="ghost" icon="bookmark-outline" />
        </View>
      </LinearGradient>

      {/* Jump back in */}
      <SectionLabel>Jump back in</SectionLabel>
      <View style={styles.tiles}>
        {albums.map((a) => (
          <Pressable key={a.id} style={styles.tile} onPress={() => router.navigate('/listen')}>
            <Art gradient={a.gradient} size={42} round={radius.sm} />
            <Text style={styles.tileText} numberOfLines={2}>
              {a.title}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Pod teaser */}
      <SectionLabel actionLabel="Open →" onAction={() => router.navigate('/pod')}>
        Happening in the Pod
      </SectionLabel>
      <Card>
        <View style={styles.podRow}>
          <Avatar initials="TB" color="#E05A38" />
          <View style={styles.podBody}>
            <Text style={styles.podWho}>
              Tyler <Text style={styles.podBadge}>◈ BAND</Text> <Text style={styles.podWhen}>12m</Text>
            </Text>
            <Text style={styles.podText}>just posted the Winter Coats demo for you all — be gentle 🐋</Text>
          </View>
        </View>
      </Card>

      {/* Next show */}
      <SectionLabel actionLabel="All dates →" onAction={() => router.navigate('/shows')}>
        Next show
      </SectionLabel>
      <Card style={styles.showCard}>
        <DateChip month={nextShow.month} day={nextShow.day} />
        <View style={styles.showMeta}>
          <Text style={styles.showCity}>{nextShow.city}</Text>
          <Text style={styles.showVenue}>{nextShow.venue}</Text>
        </View>
        <Button label="Tickets" small />
      </Card>

      <Text style={styles.note}>🐋 Everything here is placeholder to show the layout — real content drops straight in.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { borderRadius: radius.xxl, padding: spacing.xl },
  heroKick: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  heroKickText: { color: colors.foam, fontWeight: '800', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase' },
  heroTitle: { color: colors.white, fontFamily: serif, fontSize: 23, marginBottom: spacing.xs, lineHeight: 28 },
  heroSub: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: spacing.lg, lineHeight: 19 },
  heroRow: { flexDirection: 'row', gap: spacing.md },

  tiles: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  tile: {
    width: '47%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  tileText: { color: colors.ink, fontWeight: '700', fontSize: 12, flex: 1 },

  podRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  podBody: { flex: 1 },
  podWho: { color: colors.ink, fontWeight: '700', fontSize: 13 },
  podBadge: { color: colors.gold, fontWeight: '800', fontSize: 9, letterSpacing: 0.5 },
  podWhen: { color: colors.faint, fontSize: 11, fontWeight: '500' },
  podText: { color: colors.foam, fontSize: 13, marginTop: 3, lineHeight: 18 },

  showCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  showMeta: { flex: 1 },
  showCity: { color: colors.ink, fontWeight: '700', fontSize: 15 },
  showVenue: { color: colors.muted, fontSize: 12.5, marginTop: 2 },

  note: { color: colors.muted, fontSize: 11.5, marginTop: spacing.xl, lineHeight: 17 },
});
