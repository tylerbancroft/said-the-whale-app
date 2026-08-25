import { createElement, useMemo, useRef, useState } from 'react';
import {
  Image,
  Linking,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { WorldTile } from '@/data/catalog';
import { archive, font } from '@/theme/archive';
import { VideoPlayBadge } from '@/components/archive/PlayControl';

const GUTTER = 4;

function seedRatio(tile: WorldTile): number {
  if (tile.kind === 'video') return 9 / 16;
  if (tile.wide) return 2 / 3;
  let h = 0;
  for (let i = 0; i < tile.id.length; i += 1) h = (h * 33 + tile.id.charCodeAt(i)) >>> 0;
  return [0.78, 0.92, 1.05, 1.22, 1.38][h % 5];
}

function splitColumns(tiles: WorldTile[], ratios: Record<string, number>, colW: number): [WorldTile[], WorldTile[]] {
  const left: WorldTile[] = [];
  const right: WorldTile[] = [];
  let lH = 0;
  let rH = 0;
  for (const tile of tiles) {
    const h = colW * (ratios[tile.id] ?? seedRatio(tile)) + GUTTER;
    if (lH <= rH) {
      left.push(tile);
      lH += h;
    } else {
      right.push(tile);
      rH += h;
    }
  }
  return [left, right];
}

function playable(tile: WorldTile): boolean {
  return Boolean(tile.youtubeId || tile.videoUri);
}

/** Two-column staggered stills — Saveee-quiet. No captions on tiles. */
export function SaveeeGallery({
  tiles,
  onOpen,
}: {
  tiles: WorldTile[];
  onOpen: (tile: WorldTile) => void;
}) {
  const { width } = useWindowDimensions();
  const pageW = Math.min(width, 390);
  const colW = (pageW - GUTTER * 3) / 2;
  const [ratios, setRatios] = useState<Record<string, number>>({});
  const [left, right] = useMemo(() => splitColumns(tiles, ratios, colW), [tiles, ratios, colW]);

  if (!tiles.length) return null;

  const renderCol = (col: WorldTile[]) =>
    col.map((tile) => {
      const ratio = ratios[tile.id] ?? seedRatio(tile);
      const showPlay = tile.kind === 'video';
      return (
        <Pressable key={tile.id} onPress={() => onOpen(tile)} style={{ marginBottom: GUTTER }}>
          <View style={[styles.tile, { width: colW, height: colW * ratio }]}>
            {tile.still ? (
              <Image
                source={tile.still}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
                onLoad={(e) => {
                  const src = e.nativeEvent.source as { width?: number; height?: number } | undefined;
                  if (src?.width && src?.height) {
                    setRatios((prev) =>
                      prev[tile.id] ? prev : { ...prev, [tile.id]: src.height / src.width },
                    );
                  }
                }}
              />
            ) : (
              <View style={[StyleSheet.absoluteFill, styles.blank]} />
            )}
            {showPlay ? (
              <View style={styles.playWrap} pointerEvents="none">
                <VideoPlayBadge size={30} />
              </View>
            ) : null}
          </View>
        </Pressable>
      );
    });

  return (
    <View style={[styles.wrap, { width: pageW }]}>
      <View style={[styles.cols, { gap: GUTTER, paddingHorizontal: GUTTER }]}>
        <View style={{ width: colW }}>{renderCol(left)}</View>
        <View style={{ width: colW }}>{renderCol(right)}</View>
      </View>
    </View>
  );
}

export function MediaLightbox({ tile, onClose }: { tile: WorldTile; onClose: () => void }) {
  const canPlay = tile.kind === 'video' && playable(tile);
  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 10 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderRelease: (_, g) => {
        if (g.dy > 70 || g.vy > 0.85) onClose();
      },
    }),
  ).current;

  const openYoutube = async () => {
    if (!tile.youtubeId) return;
    const url = `https://www.youtube.com/watch?v=${tile.youtubeId}`;
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch {
      Linking.openURL(url);
    }
  };

  return (
    <View style={styles.light} {...pan.panHandlers}>
      <Pressable onPress={onClose} style={styles.lightBack} hitSlop={10}>
        <Text style={styles.lightBackTxt}>←</Text>
      </Pressable>
      <View style={styles.lightStage}>
        {canPlay && tile.youtubeId && Platform.OS === 'web' ? (
          createElement('iframe', {
            src: `https://www.youtube.com/embed/${tile.youtubeId}?autoplay=1`,
            allow: 'autoplay; fullscreen',
            style: { width: '100%', height: '100%', border: 0, background: '#000' },
            title: 'Video',
          })
        ) : canPlay && tile.videoUri && Platform.OS === 'web' ? (
          createElement('video', {
            src: tile.videoUri,
            controls: true,
            autoPlay: true,
            playsInline: true,
            style: { width: '100%', height: '100%', objectFit: 'contain', background: '#000' },
          })
        ) : canPlay && tile.youtubeId ? (
          <Pressable onPress={openYoutube} style={styles.lightStill}>
            {tile.still ? <Image source={tile.still} style={StyleSheet.absoluteFill} resizeMode="contain" /> : null}
            <VideoPlayBadge size={56} />
          </Pressable>
        ) : canPlay && tile.videoUri ? (
          <Pressable
            onPress={() => Linking.openURL(tile.videoUri!)}
            style={styles.lightStill}
          >
            {tile.still ? <Image source={tile.still} style={StyleSheet.absoluteFill} resizeMode="contain" /> : null}
            <VideoPlayBadge size={56} />
          </Pressable>
        ) : tile.still ? (
          <Image source={tile.still} style={styles.lightImg} resizeMode="contain" />
        ) : null}
      </View>
      {tile.credit ? <Text style={styles.credit}>{tile.credit}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'center', marginTop: 8, marginBottom: 18 },
  cols: { flexDirection: 'row' },
  tile: { backgroundColor: '#1a1410', overflow: 'hidden' },
  blank: { backgroundColor: '#2a221c' },
  playWrap: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  light: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20,14,10,0.96)',
    zIndex: 40,
    justifyContent: 'center',
  },
  lightBack: { position: 'absolute', top: 16, left: 16, zIndex: 2, padding: 8 },
  lightBackTxt: {
    fontFamily: font.sans,
    fontSize: 18,
    color: archive.color.photoText,
  },
  lightStage: { flex: 1, marginTop: 48, marginBottom: 36, marginHorizontal: 8 },
  lightImg: { width: '100%', height: '100%' },
  lightStill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  credit: {
    position: 'absolute',
    bottom: 14,
    left: 16,
    right: 16,
    textAlign: 'center',
    fontFamily: font.sans,
    fontSize: 10,
    letterSpacing: 1.4,
    color: 'rgba(247,241,227,0.7)',
  },
});
