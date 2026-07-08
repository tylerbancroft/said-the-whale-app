import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, radius } from '@/theme/tokens';
import { usePlayer } from '@/context/PlayerContext';

/**
 * Persistent now-playing bar — sits just above the tab bar on every screen,
 * the way Spotify's does. Play/pause is live; audio playback gets wired in
 * when streaming lands.
 */
export function MiniPlayer() {
  const { track, isPlaying, toggle } = usePlayer();

  return (
    <View style={styles.wrap}>
      <View style={styles.bar}>
        <View style={[styles.progress, { width: isPlaying ? '38%' : '12%' }]} />
        <LinearGradient
          colors={track.gradient}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={styles.art}
        />
        <View style={styles.meta}>
          <Text style={styles.title} numberOfLines={1}>
            {track.title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {track.subtitle}
          </Text>
        </View>
        <Pressable onPress={toggle} hitSlop={10} style={styles.playBtn}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={16} color={colors.ground} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: spacing.sm },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface3,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    overflow: 'hidden',
  },
  progress: { position: 'absolute', left: 0, bottom: 0, height: 3, backgroundColor: colors.accent },
  art: { width: 38, height: 38, borderRadius: radius.sm },
  meta: { flex: 1, minWidth: 0 },
  title: { color: colors.ink, fontWeight: '700', fontSize: 12.5 },
  subtitle: { color: colors.muted, fontSize: 11, marginTop: 1 },
  playBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
