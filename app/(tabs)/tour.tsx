import { View, Text, StyleSheet } from 'react-native';
import { ArchiveHeader } from '@/components/archive/ArchiveHeader';
import { PhotoBackdrop } from '@/components/archive/PhotoBackdrop';
import { PhotoTitle } from '@/components/archive/PhotoTitle';
import { archive, font } from '@/theme/archive';

// Screen 6 — Tour ("On the Road"). Date-block rows + ticket pills to come.
export default function TourScreen() {
  return (
    <View style={styles.root}>
      <ArchiveHeader />
      <PhotoBackdrop>
        <PhotoTitle eyebrow="On the Road" title="Tour Dates" />
        <View style={styles.center}>
          <Text style={styles.soon}>see you out there ✳</Text>
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
