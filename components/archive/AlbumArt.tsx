import { View, Text, StyleSheet } from 'react-native';
import { ArchiveAlbum, initialsOf, artInk } from '@/data/redesign';
import { font } from '@/theme/archive';

/**
 * Flat brand-color album artwork placeholder: inset frame + two concentric
 * "record" rings + 2-letter monogram. Replace with real artwork in production.
 */
export function AlbumArt({
  album,
  size,
  radius = 14,
}: {
  album: ArchiveAlbum;
  size: number;
  radius?: number;
}) {
  const { line, ink } = artInk(album);
  const inset = size < 180 ? 8 : 10;
  return (
    <View style={[styles.art, { width: size, height: size, borderRadius: radius, backgroundColor: album.color }]}>
      <View style={[styles.frame, { top: inset, left: inset, right: inset, bottom: inset, borderColor: line }]} />
      <View style={[styles.ringOuter, { borderColor: line }]}>
        <View style={[styles.ringInner, { borderColor: line }]}>
          <Text style={{ color: ink, fontFamily: font.sans, fontWeight: '500', fontSize: Math.round(size * 0.16) }}>
            {initialsOf(album)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  art: { overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  frame: { position: 'absolute', borderWidth: 1 },
  ringOuter: { width: '58%', aspectRatio: 1, borderRadius: 9999, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  ringInner: { width: '62%', aspectRatio: 1, borderRadius: 9999, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
});
