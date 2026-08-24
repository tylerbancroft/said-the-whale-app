import { View, Text, StyleSheet } from 'react-native';
import { archive, font } from '@/theme/archive';

/**
 * In-app sleeve for records with no official cover (Volume 2) or no CAA art
 * (Let's Have Sound, Remixed). Never a blank placeholder.
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
  const ink = dark ? 'rgba(251,246,234,0.94)' : archive.color.ink;
  const line = dark ? 'rgba(255,255,255,0.32)' : 'rgba(70,55,43,0.38)';
  const titleSize = size < 80 ? 7 : size < 140 ? 10 : 13;
  return (
    <View style={[styles.art, { width: size, height: size, borderRadius: radius, backgroundColor: color }]}>
      <View style={[styles.frame, { borderColor: line, top: size * 0.06, left: size * 0.06, right: size * 0.06, bottom: size * 0.06 }]} />
      <View style={[styles.ring, { width: size * 0.72, height: size * 0.72, borderColor: line }]}>
        <View style={[styles.ring, { width: size * 0.48, height: size * 0.48, borderColor: line }]}>
          <View style={[styles.hole, { width: size * 0.08, height: size * 0.08, backgroundColor: ink, opacity: 0.35 }]} />
        </View>
      </View>
      <View style={styles.copy} pointerEvents="none">
        <Text style={[styles.l1, { color: ink, fontSize: titleSize, letterSpacing: size < 80 ? 1 : 2 }]}>{line1}</Text>
        {line2 ? <Text style={[styles.l2, { color: ink, fontSize: titleSize - 1 }]}>{line2}</Text> : null}
        {line3 ? <Text style={[styles.l3, { color: ink, fontSize: Math.max(8, titleSize - 2) }]}>{line3}</Text> : null}
      </View>
    </View>
  );
}

export function Volume2Art({ size, radius = 14 }: { size: number; radius?: number }) {
  return (
    <WordmarkArt
      size={size}
      radius={radius}
      color="#46372B"
      line1="SAID THE WHALE"
      line2="B-SIDES + RARITIES"
      line3="VOLUME TWO"
      dark
    />
  );
}

const styles = StyleSheet.create({
  art: { overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  frame: { position: 'absolute', borderWidth: 1 },
  ring: { position: 'absolute', borderRadius: 9999, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  hole: { borderRadius: 9999 },
  copy: { alignItems: 'center', paddingHorizontal: 8, zIndex: 2 },
  l1: { fontFamily: font.sans, fontWeight: '600', textAlign: 'center', textTransform: 'uppercase' },
  l2: { fontFamily: font.sans, fontWeight: '500', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4, opacity: 0.9 },
  l3: { fontFamily: font.script, textAlign: 'center', marginTop: 6, opacity: 0.85 },
});
