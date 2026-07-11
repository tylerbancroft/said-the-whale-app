import { View, Text, StyleSheet } from 'react-native';
import { font } from '@/theme/archive';

/**
 * The record-ring monogram drawn directly on a color field (no filled block) —
 * used on the bolder "poster" pages where the whole hero is the album's color.
 */
export function Monogram({ label, size, color }: { label: string; size: number; color: string }) {
  const inset = Math.round(size * 0.06);
  return (
    <View style={[styles.box, { width: size, height: size }]}>
      <View style={[styles.frame, { top: inset, left: inset, right: inset, bottom: inset, borderColor: color }]} />
      <View style={[styles.ringOuter, { borderColor: color }]}>
        <View style={[styles.ringInner, { borderColor: color }]}>
          <Text style={{ color, fontFamily: font.sans, fontWeight: '500', fontSize: Math.round(size * 0.17) }}>{label}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', justifyContent: 'center' },
  frame: { position: 'absolute', borderWidth: 1 },
  ringOuter: { width: '58%', aspectRatio: 1, borderRadius: 9999, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  ringInner: { width: '62%', aspectRatio: 1, borderRadius: 9999, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
});
