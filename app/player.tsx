import { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, GestureResponderEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { AlbumArt } from '@/components/archive/AlbumArt';
import { useArchivePlayer, lengthForTrack, fmt } from '@/context/ArchivePlayerContext';
import { archive, font } from '@/theme/archive';

/** Screen 3 — full-screen player overlay (cream). */
export default function Player() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const p = useArchivePlayer();
  const barWidth = useRef(0);

  if (!p.album) {
    return (
      <View style={[styles.root, { alignItems: 'center', justifyContent: 'center' }]}>
        <Pressable onPress={() => router.back()}><Text style={styles.close}>↓ Close</Text></Pressable>
      </View>
    );
  }

  const album = p.album;
  const pct = p.duration ? Math.min(1, p.elapsed / p.duration) : 0;

  const onSeek = (e: GestureResponderEvent) => {
    if (!barWidth.current) return;
    p.seekFraction(e.nativeEvent.locationX / barWidth.current);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.headerSide}>
          <Text style={styles.close}>↓ Close</Text>
        </Pressable>
        <Text style={styles.nowPlaying}>Now Playing</Text>
        <View style={styles.headerSide} />
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <AlbumArt album={album} size={220} radius={0} />

        <Text style={styles.title}>{p.title}</Text>
        <Text style={styles.album}>{album.title} · {album.year}</Text>

        <View style={styles.scrubWrap}>
          <Pressable onPress={onSeek} onLayout={(e) => (barWidth.current = e.nativeEvent.layout.width)} style={styles.scrubHit}>
            <View style={styles.track}>
              <View style={[styles.trackFill, { width: `${pct * 100}%` }]} />
              <View style={[styles.dot, { left: `${pct * 100}%` }]} />
            </View>
          </Pressable>
          <View style={styles.times}>
            <Text style={styles.time}>{fmt(p.elapsed)}</Text>
            <Text style={styles.time}>{fmt(p.duration)}</Text>
          </View>
        </View>

        <View style={styles.controls}>
          <Pressable onPress={p.prev} hitSlop={10} style={styles.ctrlBtn}><Text style={styles.ctrlGlyph}>⏮</Text></Pressable>
          <Pressable onPress={p.toggle} style={styles.playBtn}>
            <Text style={styles.playGlyph}>{p.playing ? '❚❚' : '▶'}</Text>
          </Pressable>
          <Pressable onPress={p.next} hitSlop={10} style={styles.ctrlBtn}><Text style={styles.ctrlGlyph}>⏭</Text></Pressable>
        </View>

        <View style={styles.queueWrap}>
          <Text style={styles.queueEyebrow}>Up Next</Text>
          <View style={styles.queue}>
            {album.tracks.map((t, i) => (
              <Pressable
                key={i}
                onPress={() => p.playTrack(album, i)}
                style={({ pressed }) => [styles.qRow, pressed && { backgroundColor: archive.color.cream }]}
              >
                <Text style={styles.qNum}>{i + 1}</Text>
                <Text style={[styles.qTitle, i === p.trackIndex && { color: archive.color.red, fontWeight: '600' }]}>{t}</Text>
                <Text style={styles.qLen}>{lengthForTrack(i)}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: archive.color.cream },
  header: { paddingHorizontal: 20, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: archive.color.line },
  headerSide: { width: 60 },
  close: { fontFamily: font.sans, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: archive.color.deepBlue },
  nowPlaying: { fontFamily: font.sans, fontSize: 10.5, letterSpacing: 3, textTransform: 'uppercase', color: archive.color.warmGrey },

  body: { alignItems: 'center', paddingHorizontal: 30, paddingVertical: 30 },
  title: { fontFamily: font.sans, fontSize: 20, fontWeight: '600', letterSpacing: 0.5, marginTop: 26, textAlign: 'center', color: archive.color.ink },
  album: { fontFamily: font.sans, fontSize: 11.5, letterSpacing: 3, textTransform: 'uppercase', color: archive.color.warmGrey, marginTop: 6 },

  scrubWrap: { width: '100%', maxWidth: 300, marginTop: 28 },
  scrubHit: { height: 22, justifyContent: 'center' },
  track: { height: 2, backgroundColor: archive.color.line },
  trackFill: { position: 'absolute', left: 0, top: 0, height: 2, backgroundColor: archive.color.red },
  dot: { position: 'absolute', top: -4, width: 10, height: 10, marginLeft: -5, borderRadius: 5, backgroundColor: archive.color.red },
  times: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  time: { fontFamily: font.sans, fontSize: 10.5, letterSpacing: 1, color: archive.color.warmGrey },

  controls: { flexDirection: 'row', alignItems: 'center', gap: 28, marginTop: 22 },
  ctrlBtn: { padding: 8 },
  ctrlGlyph: { fontSize: 18, color: archive.color.ink },
  playBtn: { width: 64, height: 64, borderRadius: 32, backgroundColor: archive.color.red, alignItems: 'center', justifyContent: 'center' },
  playGlyph: { fontSize: 18, color: archive.color.paper },

  queueWrap: { width: '100%', marginTop: 34 },
  queueEyebrow: { fontFamily: font.sans, fontSize: 10.5, letterSpacing: 4, textTransform: 'uppercase', color: archive.color.warmGrey, textAlign: 'center', marginBottom: 10 },
  queue: { borderWidth: 1, borderColor: archive.color.line, backgroundColor: archive.color.paper },
  qRow: { flexDirection: 'row', alignItems: 'center', gap: 14, borderBottomWidth: 1, borderBottomColor: archive.color.rowBorder, paddingVertical: 12, paddingHorizontal: 16 },
  qNum: { width: 20, fontSize: 11, textAlign: 'right', color: archive.color.warmGrey, fontFamily: font.sans },
  qTitle: { flex: 1, fontSize: 13, letterSpacing: 0.3, color: archive.color.ink, fontFamily: font.sans },
  qLen: { fontSize: 11, color: archive.color.warmGrey, fontFamily: font.sans },
});
