import { View, Text, StyleSheet } from 'react-native';
import { archive, font } from '@/theme/archive';

/**
 * Quiet type card for records without a sleeve. Cream + ink — no fake
 * concentric rings.
 */
export function WordmarkArt({
  size,
  radius = 14,
  color,
  line1,
  line2,
  line3,
  dark = true,
}: {
  size: number;
  radius?: number;
  color: string;
  line1: string;
  line2?: string;
  line3?: string;
  dark?: boolean;
}) {
  const cream = !dark;
  const bg = cream ? archive.color.paper : color;
  const ink = cream ? archive.color.ink : 'rgba(251,246,234,0.94)';
  const rule = cream ? archive.color.line : 'rgba(255,255,255,0.28)';
  const titleSize = size < 80 ? 7 : size < 140 ? 10 : 12;
  return (
    <View
      style={[
        styles.art,
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: bg,
          borderWidth: 1,
          borderColor: rule,
        },
      ]}
    >
      <View style={styles.copy} pointerEvents="none">
        <Text style={[styles.l1, { color: ink, fontSize: titleSize, letterSpacing: size < 80 ? 1 : 2 }]}>{line1}</Text>
        {line2 ? (
          <Text style={[styles.l2, { color: ink, fontSize: Math.max(8, titleSize - 1) }]}>{line2}</Text>
        ) : null}
        {line3 ? (
          <Text style={[styles.l3, { color: ink, fontSize: Math.max(9, titleSize) }]}>{line3}</Text>
        ) : null}
      </View>
    </View>
  );
}

/** Volume 2 has no official cover — a cream type card, not generated rings. */
export function Volume2Art({ size, radius = 0 }: { size: number; radius?: number }) {
  return (
    <WordmarkArt
      size={size}
      radius={radius}
      color={archive.color.paper}
      line1="SAID THE WHALE"
      line2="B-SIDES + RARITIES"
      line3="VOLUME TWO"
      dark={false}
    />
  );
}

const styles = StyleSheet.create({
  art: { overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  copy: { alignItems: 'center', paddingHorizontal: 12 },
  l1: { fontFamily: font.sans, fontWeight: '600', textAlign: 'center', textTransform: 'uppercase' },
  l2: {
    fontFamily: font.sans,
    fontWeight: '500',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 6,
    opacity: 0.85,
  },
  l3: { fontFamily: font.script, textAlign: 'center', marginTop: 8, opacity: 0.9 },
});
