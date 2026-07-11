import { View, Text, StyleSheet } from 'react-native';
import { archive, font } from '@/theme/archive';

/** Centered eyebrow + title (+ script caption) header used on photo pages. */
export function PhotoTitle({ eyebrow, title, caption }: { eyebrow: string; title: string; caption?: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
    </View>
  );
}

const shadow = archive.photoShadow;
const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingHorizontal: 20, paddingTop: 22, paddingBottom: 14 },
  eyebrow: { fontFamily: font.sans, fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: 'rgba(247,241,227,0.85)', ...shadow },
  title: { fontFamily: font.sans, fontSize: 22, fontWeight: '500', letterSpacing: 1, color: archive.color.photoText, ...shadow },
  caption: { fontFamily: font.script, fontSize: 13, marginTop: 3, color: 'rgba(247,241,227,0.9)', ...shadow },
});
