import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useArchivePlayer } from '@/context/ArchivePlayerContext';
import { artInk } from '@/data/redesign';
import { archive, font } from '@/theme/archive';

/** Screen 4 — persistent mini-player bar above the bottom nav. */
export function ArchiveMiniPlayer() {
  const router = useRouter();
  const p = useArchivePlayer();
  if (!p.album) return null;

  const album = p.album;
  const pct = p.duration ? Math.min(1, p.elapsed / p.duration) : 0;
  const { line } = artInk(album);

  return (
    <View style={styles.wrap}>
      <View style={[styles.progress, { width: `${pct * 100}%` }]} />
      <View style={styles.row}>
        <Pressable onPress={() => router.push('/player')} style={styles.left} hitSlop={4}>
          <View style={[styles.art, { backgroundColor: album.color }]}>
            <View style={[styles.artRing, { borderColor: line }]} />
          </View>
          <View style={styles.meta}>
            <Text style={styles.title} numberOfLines={1}>{p.title}</Text>
            <Text style={styles.album} numberOfLines={1}>{album.title}</Text>
          </View>
        </Pressable>
        <Pressable onPress={p.toggle} style={styles.playBtn} hitSlop={8}>
          <Text style={styles.playGlyph}>{p.playing ? '❚❚' : '▶'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderTopWidth: 1, borderTopColor: archive.color.line, backgroundColor: archive.color.paper },
  progress: { position: 'absolute', top: 0, left: 0, height: 2, backgroundColor: archive.color.red, zIndex: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 10 },
  left: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, minWidth: 0 },
  art: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  artRing: { width: 20, height: 20, borderRadius: 10, borderWidth: 1 },
  meta: { flex: 1, minWidth: 0 },
  title: { fontFamily: font.sans, fontSize: 13, fontWeight: '600', letterSpacing: 0.3, color: archive.color.ink },
  album: { fontFamily: font.sans, fontSize: 11, letterSpacing: 0.5, color: archive.color.warmGrey, marginTop: 1 },
  playBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: archive.color.ink, alignItems: 'center', justifyContent: 'center' },
  playGlyph: { fontSize: 12, color: archive.color.ink },
});
