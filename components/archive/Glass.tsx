import { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { archive } from '@/theme/archive';

/**
 * "Apple glass" surface — blurred translucent panel used for content that needs
 * contrast over the photo pages (chat bubbles, composer, empty-state chips).
 */
export function Glass({
  children,
  style,
  radius = 16,
  intensity = 24,
}: {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  radius?: number;
  intensity?: number;
}) {
  return (
    <View style={[{ borderRadius: radius, overflow: 'hidden', borderWidth: 1, borderColor: archive.color.glassBorder }, style]}>
      <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: archive.color.glassBg }]} />
      {children}
    </View>
  );
}
