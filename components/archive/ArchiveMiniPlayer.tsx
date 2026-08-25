import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useArchivePlayer } from '@/context/ArchivePlayerContext';
import { artInk } from '@/data/catalog';
import { archive, font } from '@/theme/archive';
import { PlayCircle } from '@/components/archive/PlayControl';

/** Screen 4 — persistent mini-player bar above the bottom nav. */
export function ArchiveMiniPlayer() {
  const router = useRouter();
  const p = useArchivePlayer();
  if (!p.album) return null;

  const album = p.album;
  const pct = p.duration ? Math.min(1, p.elapsed / p.duration) : 0;
  const { line } = artInk(album);
  const cover = album.coverSource ?? (album.coverUri ? { uri: album.coverUri } : undefined);

  return (
    <View style={styles.wrap}>
      <View style={[styles.progress, { width: `${pct * 100}%` }]} />
      <View style={styles.row}>
        <Pressable onPress={() => router.push('/player')} style={styles.left} hitSlop={4}>
          {cover ? (
            <Image source={cover} style={styles.artImg} />
          ) : (
            <View style={[styles.art, { backgroundColor: album.color }]}>
              <View style={[styles.artRing, { borderColor: line }]} />
            </View>
          )}
          <View style={styles.meta}>
            <Text style={styles.title} numberOfLines={1}>{p.title}</Text>
            <Text style={styles.album} numberOfLines={1}>{album.title}</Text>
          </View>
        </Pressable>
        <PlayCircle playing={p.playing} onPress={p.toggle} size={50} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderTopWidth: 1, borderTopColor: archive.color.line, backgroundColor: archive.color.paper },
  progress: { position: 'absolute', top: 0, left: 0, height: 3, backgroundColor: archive.color.red, zIndex: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 14, paddingRight: 12, paddingVertical: 10 },
  left: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, minWidth: 0 },
  art: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  artImg: { width: 44, height: 44 },
  artRing: { width: 22, height: 22, borderRadius: 11, borderWidth: 1 },
  meta: { flex: 1, minWidth: 0 },
  title: { fontFamily: font.sans, fontSize: 14, fontWeight: '600', letterSpacing: 0.3, color: archive.color.ink },
  album: { fontFamily: font.sans, fontSize: 11, letterSpacing: 0.5, color: archive.color.warmGrey, marginTop: 2 },
});
