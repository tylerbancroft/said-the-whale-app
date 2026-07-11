import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { archive, font } from '@/theme/archive';

/** Persistent cream masthead at the top of every screen. */
export function ArchiveHeader() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
      <Text style={styles.wordmark}>Said the Whale</Text>
      <Text style={styles.tag}>est. Vancouver, B.C. — 2007</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: archive.color.cream,
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: archive.color.line,
    alignItems: 'center',
    zIndex: 5,
  },
  wordmark: {
    fontFamily: font.sans,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 5,
    textTransform: 'uppercase',
    color: archive.color.ink,
  },
  tag: { fontFamily: font.script, fontSize: 13, color: archive.color.warmGrey, marginTop: 2 },
});
