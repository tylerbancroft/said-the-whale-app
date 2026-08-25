import { createElement, useMemo, useRef } from 'react';
import {
  Image,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { WorldTile } from '@/data/catalog';
import { archive, font } from '@/theme/archive';
import { VideoPlayBadge } from '@/components/archive/PlayControl';

/** Saveee masonry: thin gutters, quiet radius, staggered column packing. Not the Swiss/crosshair variant. */
const GUTTER = 8;
const RADIUS = 12;

function seedRatio(tile: WorldTile): number {
  let h = 0;
  for (let i = 0; i < tile.id.length; i += 1) h = (h * 33 + tile.id.charCodeAt(i)) >>> 0;
  return [0.72, 0.86, 0.98, 1.16, 1.32, 1.48][h % 6];
}

function splitColumns(tiles: WorldTile[], colW: number): [WorldTile[], WorldTile[]] {
  const left: WorldTile[] = [];
  const right: WorldTile[] = [];
  let lH = 0;
  let rH = 0;
  for (const tile of tiles) {
    const h = colW * seedRatio(tile) + GUTTER;
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

function posterUri(tile: WorldTile): string | undefined {
  return typeof tile.still === 'object' && tile.still && 'uri' in tile.still ? tile.still.uri : undefined;
}

function InAppVideo({
  uri,
  poster,
  onPlay,
}: {
  uri: string;
  poster?: string;
  onPlay?: () => void;
}) {
  if (Platform.OS !== 'web') {
    return poster ? (
      <Image source={{ uri: poster }} style={styles.lightImg} resizeMode="contain" />
    ) : null;
  }
  return createElement('video', {
    src: uri,
    poster,
    controls: true,
    autoPlay: true,
    playsInline: true,
    onPlay,
    style: { width: '100%', height: '100%', objectFit: 'contain', background: '#000' },
  });
}

/** Two-column staggered stills. Cover-crop in the grid; no captions. */
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
  const [left, right] = useMemo(() => splitColumns(tiles, colW), [tiles, colW]);

  if (!tiles.length) return null;

  const renderCol = (col: WorldTile[]) =>
    col.map((tile) => {
      const ratio = seedRatio(tile);
      const showPlay = tile.kind === 'video';
      return (
        <Pressable key={tile.id} onPress={() => onOpen(tile)} style={{ marginBottom: GUTTER }}>
          <View style={[styles.tile, { width: colW, height: colW * ratio }]}>
            {tile.still ? (
              <Image source={tile.still} style={StyleSheet.absoluteFill} resizeMode="cover" />
            ) : (
              <View style={[StyleSheet.absoluteFill, styles.blank]} />
            )}
            {showPlay ? (
              <View style={styles.playWrap} pointerEvents="none">
                <VideoPlayBadge size={28} />
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

export function MediaLightbox({
  tile,
  onClose,
  onVideoStart,
}: {
  tile: WorldTile;
  onClose: () => void;
  onVideoStart?: () => void;
}) {
  const canPlay = tile.kind === 'video' && Boolean(tile.videoUri);
  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 10 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderRelease: (_, g) => {
        if (g.dy > 70 || g.vy > 0.85) onClose();
      },
    }),
  ).current;

  return (
    <View style={styles.light} {...pan.panHandlers}>
      <Pressable onPress={onClose} style={styles.lightBack} hitSlop={10}>
        <Text style={styles.lightBackTxt}>←</Text>
      </Pressable>
      <View style={styles.lightStage}>
        {canPlay && tile.videoUri ? (
          <InAppVideo uri={tile.videoUri} poster={posterUri(tile)} onPlay={onVideoStart} />
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
  cols: { flexDirection: 'row', alignItems: 'flex-start' },
  tile: {
    backgroundColor: '#1a1410',
    overflow: 'hidden',
    borderRadius: RADIUS,
  },
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
