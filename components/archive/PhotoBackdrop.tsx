import { ReactNode } from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PHOTOS } from '@/assets/photos';
import { usePhoto } from '@/context/PhotoContext';
import { archive } from '@/theme/archive';
import { RefreshPhotoButton } from './RefreshPhotoButton';

/**
 * Full-bleed band photo + warm scrim behind a photo page's content, with the
 * shared refresh control. Content is laid over the top.
 */
export function PhotoBackdrop({
  children,
  showRefresh = true,
}: {
  children: ReactNode;
  showRefresh?: boolean;
}) {
  const { index, refresh } = usePhoto();
  return (
    <View style={styles.root}>
      <ImageBackground source={PHOTOS[index]} style={StyleSheet.absoluteFill} resizeMode="cover" />
      <LinearGradient
        colors={archive.scrim as unknown as [string, string, ...string[]]}
        locations={archive.scrimLocations as unknown as [number, number, ...number[]]}
        style={StyleSheet.absoluteFill}
      />
      {showRefresh && <RefreshPhotoButton onPress={refresh} />}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1 },
});
