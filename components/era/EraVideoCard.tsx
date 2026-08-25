import { Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { EraVideo } from '@/data/catalog';
import { archive, font } from '@/theme/archive';

function isHostedMp4(uri?: string): boolean {
  return Boolean(uri && /\.(mp4|m4v|webm|mov)(\?|$)/i.test(uri));
}

/** Cream-fallback video tiles. Hosted mp4 only — never YouTube. */
export function EraVideoCard({ video }: { video: EraVideo }) {
  const playable = isHostedMp4(video.uri);
  const thumb = video.posterSource ? (video.posterSource as number) : undefined;

  return (
    <Pressable
      onPress={() => {}}
      disabled={!playable}
      style={({ pressed }) => [styles.card, pressed && playable && { opacity: 0.92 }]}
    >
      <View style={[styles.thumbWrap, !thumb && styles.quiet]}>
        {thumb ? <Image source={thumb} style={StyleSheet.absoluteFill} resizeMode="cover" /> : null}
        {playable ? (
          <View style={styles.play}><Text style={styles.playGlyph}>▶</Text></View>
        ) : null}
      </View>
      <Text style={styles.title} numberOfLines={2}>{video.title}</Text>
      {video.caption ? <Text style={styles.caption}>{video.caption}</Text> : null}
    </Pressable>
  );
}

export function EraVideos({ videos }: { videos?: EraVideo[] }) {
  const { width } = useWindowDimensions();
  const hosted = (videos ?? []).filter((v) => isHostedMp4(v.uri) || v.posterSource);
  if (!hosted.length) return null;
  const pageW = Math.min(width, 390);
  const twoCol = hosted.length > 1;
  const gap = 10;
  const cellW = twoCol ? (pageW - 48 - gap) / 2 : pageW - 48;

  return (
    <View style={[styles.wrap, { width: pageW }]}>
      <View style={[styles.grid, { gap }]}>
        {hosted.map((v) => (
          <View key={v.id} style={{ width: cellW }}>
            <EraVideoCard video={v} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 24, marginTop: 4, marginBottom: 20, alignSelf: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  card: { backgroundColor: archive.color.paper, borderWidth: 1, borderColor: archive.color.line, padding: 8, paddingBottom: 12 },
  thumbWrap: { aspectRatio: 16 / 9, backgroundColor: '#1a1410', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  play: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(196,97,78,0.92)', alignItems: 'center', justifyContent: 'center' },
  playGlyph: { color: archive.color.paper, fontSize: 14, marginLeft: 2 },
  title: { fontFamily: font.sans, fontSize: 12, fontWeight: '600', color: archive.color.ink, marginTop: 10, letterSpacing: 0.2 },
  caption: { fontFamily: font.sans, fontSize: 12, lineHeight: 18, color: archive.color.bodySoft, marginTop: 4 },
  quiet: { backgroundColor: '#EDE3CE' },
});
