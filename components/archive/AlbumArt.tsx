import { Image, StyleSheet, Text, View } from 'react-native';
import { CatalogAlbum, artInk, initialsOf } from '@/data/catalog';
import { Volume2Art, WordmarkArt } from '@/components/era/WordmarkArt';
import { font } from '@/theme/archive';

/**
 * Real sleeve when we have one; Volume 2 / wordmark worlds otherwise;
 * last resort: boutique-archive record rings (never a blank).
 */
export function AlbumArt({
  album,
  size,
  radius = 14,
}: {
  album: CatalogAlbum;
  size: number;
  radius?: number;
}) {
  if (album.artMode === 'volume2') {
    return <Volume2Art size={size} radius={radius} />;
  }
  if (album.artMode === 'wordmark') {
    return (
      <WordmarkArt
        size={size}
        radius={radius}
        color={album.color}
        line1="SAID THE WHALE"
        line2={album.wordmark ?? album.short}
        dark={album.dark}
      />
    );
  }

  const cover = album.coverSource ?? (album.coverUri ? { uri: album.coverUri } : undefined);
  if (cover) {
    return (
      <View style={[styles.shadow, { width: size, height: size, borderRadius: radius }]}>
        <Image source={cover} style={{ width: size, height: size, borderRadius: radius }} resizeMode="cover" />
      </View>
    );
  }

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
  shadow: {
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  art: { overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  frame: { position: 'absolute', borderWidth: 1 },
  ringOuter: { width: '58%', aspectRatio: 1, borderRadius: 9999, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  ringInner: { width: '62%', aspectRatio: 1, borderRadius: 9999, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
});
