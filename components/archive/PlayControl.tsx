import { View, Text, Pressable, StyleSheet } from 'react-native';
import { archive, font } from '@/theme/archive';

/**
 * Shared play marks — filled faded-red, cream glyph.
 * Quiet boutique archive, not a ghost outline and not a streaming-app CTA.
 */

function PlayMark({ playing, size, color }: { playing: boolean; size: number; color: string }) {
  if (playing) {
    const bar = Math.max(3, Math.round(size * 0.28));
    const gap = Math.max(3, Math.round(size * 0.22));
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap }}>
        <View style={{ width: bar, height: size, backgroundColor: color }} />
        <View style={{ width: bar, height: size, backgroundColor: color }} />
      </View>
    );
  }
  return (
    <View
      style={{
        width: 0,
        height: 0,
        marginLeft: Math.round(size * 0.12),
        borderStyle: 'solid',
        borderTopWidth: Math.round(size * 0.42),
        borderBottomWidth: Math.round(size * 0.42),
        borderLeftWidth: Math.round(size * 0.7),
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: color,
      }}
    />
  );
}

export function PlayCircle({
  playing,
  onPress,
  size = 52,
}: {
  playing: boolean;
  onPress: () => void;
  size?: number;
}) {
  const mark = Math.round(size * 0.34);
  return (
    <Pressable
      onPress={onPress}
      hitSlop={4}
      accessibilityRole="button"
      accessibilityLabel={playing ? 'Pause' : 'Play'}
      style={({ pressed }) => [
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: pressed ? archive.color.redDark : archive.color.red,
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]}
    >
      <PlayMark playing={playing} size={mark} color={archive.color.paper} />
    </Pressable>
  );
}

export function VideoPlayBadge({ size = 32 }: { size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: 'rgba(196,97,78,0.92)',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <PlayMark playing={false} size={Math.round(size * 0.34)} color={archive.color.paper} />
    </View>
  );
}

export function PlayAlbumButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Play Album"
      style={({ pressed }) => [styles.albumBtn, pressed && { backgroundColor: archive.color.redDark }]}
    >
      <PlayMark playing={false} size={12} color={archive.color.paper} />
      <Text style={styles.albumBtnText}>Play Album</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  albumBtn: {
    marginTop: 22,
    minHeight: 52,
    minWidth: 220,
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 999,
    backgroundColor: archive.color.red,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  albumBtnText: {
    fontFamily: font.sans,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: archive.color.paper,
  },
});
