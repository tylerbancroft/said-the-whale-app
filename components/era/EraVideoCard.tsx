import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { EraVideo } from '@/data/catalog';
import { archive, font } from '@/theme/archive';

export function EraVideoCard({ video }: { video: EraVideo }) {
  const thumb = video.youtubeId
    ? { uri: `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg` }
    : undefined;

  const open = async () => {
    if (video.youtubeId) {
      const url = `https://www.youtube.com/watch?v=${video.youtubeId}`;
      try {
        await WebBrowser.openBrowserAsync(url);
      } catch {
        Linking.openURL(url);
      }
    }
  };

  return (
    <Pressable onPress={open} disabled={!video.youtubeId} style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }]}>
      {thumb ? (
        <View style={styles.thumbWrap}>
          <Image source={thumb} style={StyleSheet.absoluteFill} resizeMode="cover" />
          <View style={styles.play}><Text style={styles.playGlyph}>▶</Text></View>
        </View>
      ) : (
        <View style={[styles.thumbWrap, styles.todo]}>
          <Text style={styles.todoLabel}>Video</Text>
        </View>
      )}
      <Text style={styles.title}>{video.title}</Text>
      <Text style={styles.caption}>{video.caption}</Text>
      {video.streamTodo ? <Text style={styles.todoPath}>{video.streamTodo}</Text> : null}
    </Pressable>
  );
}

export function EraVideos({ videos }: { videos?: EraVideo[] }) {
  if (!videos?.length) return null;
  return (
    <View style={styles.wrap}>
      <Text style={styles.eyebrow}>Moving pictures</Text>
      {videos.map((v) => (
        <EraVideoCard key={v.id} video={v} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 20, gap: 16, marginTop: 8, marginBottom: 16 },
  eyebrow: {
    fontFamily: font.sans,
    fontSize: 11,
    letterSpacing: 4,
    textTransform: 'uppercase',
    color: archive.color.warmGrey,
    textAlign: 'center',
    marginBottom: 4,
  },
  card: { backgroundColor: archive.color.paper, borderWidth: 1, borderColor: archive.color.line, padding: 10, paddingBottom: 16 },
  thumbWrap: { aspectRatio: 16 / 9, backgroundColor: '#1a1410', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  play: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(196,97,78,0.92)', alignItems: 'center', justifyContent: 'center' },
  playGlyph: { color: archive.color.paper, fontSize: 18, marginLeft: 3 },
  title: { fontFamily: font.sans, fontSize: 15, fontWeight: '600', color: archive.color.ink, marginTop: 12, letterSpacing: 0.3 },
  caption: { fontFamily: font.sans, fontSize: 13, lineHeight: 19, color: archive.color.bodySoft, marginTop: 6 },
  todo: { backgroundColor: '#EDE3CE' },
  todoLabel: { fontFamily: font.script, color: archive.color.warmGrey, fontSize: 16 },
  todoPath: { fontFamily: font.sans, fontSize: 10, color: archive.color.warmGrey, marginTop: 8 },
});
