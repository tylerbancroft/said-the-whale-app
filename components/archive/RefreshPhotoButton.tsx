import { Pressable, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { archive } from '@/theme/archive';

/**
 * Top-right 42px circular glass control on every photo page. Advances the shared
 * band photo. (Prototype draws a camera silhouette + ⟳; we use a camera-reverse
 * glyph for the same "load a different photo" meaning.)
 */
export function RefreshPhotoButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={8} style={styles.wrap} accessibilityLabel="Load a different photo">
      <BlurView intensity={22} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.tint} />
      <Ionicons name="camera-reverse-outline" size={20} color={archive.color.photoText} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 14,
    right: 16,
    zIndex: 3,
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: archive.color.circleGlassBorder,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tint: { ...StyleSheet.absoluteFillObject, backgroundColor: archive.color.circleGlassBg },
});
