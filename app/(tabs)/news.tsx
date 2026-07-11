import { View, Text, StyleSheet } from 'react-native';
import { ArchiveHeader } from '@/components/archive/ArchiveHeader';
import { PhotoBackdrop } from '@/components/archive/PhotoBackdrop';
import { PhotoTitle } from '@/components/archive/PhotoTitle';
import { archive, font } from '@/theme/archive';

// Screen 7 — News ("The Whale Gazette"). Editorial list + article page to come.
export default function NewsScreen() {
  return (
    <View style={styles.root}>
      <ArchiveHeader />
      <PhotoBackdrop>
        <PhotoTitle eyebrow="The" title="Whale Gazette" caption="dispatches from the band" />
        <View style={styles.center}>
          <Text style={styles.soon}>the press is warming up…</Text>
        </View>
      </PhotoBackdrop>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: archive.color.cream },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  soon: { fontFamily: font.script, fontSize: 15, color: 'rgba(247,241,227,0.9)', ...archive.photoShadow },
});
