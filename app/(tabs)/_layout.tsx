import { Tabs } from 'expo-router';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ArchiveMiniPlayer } from '@/components/archive/ArchiveMiniPlayer';
import { archive, font } from '@/theme/archive';

type TabMeta = { name: string; label: string; glyph: string };

const TABS: TabMeta[] = [
  { name: 'index', label: 'Albums', glyph: '◉' },
  { name: 'chat', label: 'Chat', glyph: '◠' },
  { name: 'tour', label: 'Tour', glyph: '◈' },
  { name: 'news', label: 'News', glyph: '☰' },
];

function TabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.footer}>
      <ArchiveMiniPlayer />
      <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {state.routes.map((route: any, index: number) => {
        const meta = TABS.find((t) => t.name === route.name);
        if (!meta) return null;
        const focused = state.index === index;
        const color = focused ? archive.color.red : archive.color.warmGrey;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
        };

        return (
          <Pressable key={route.key} onPress={onPress} style={styles.tab} hitSlop={6}>
            <Text style={[styles.glyph, { color }]}>{meta.glyph}</Text>
            <Text style={[styles.label, { color }]}>{meta.label}</Text>
            <View style={[styles.dot, { backgroundColor: focused ? archive.color.red : 'transparent' }]} />
          </Pressable>
        );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="chat" />
      <Tabs.Screen name="tour" />
      <Tabs.Screen name="news" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  footer: { backgroundColor: archive.color.cream },
  bar: {
    flexDirection: 'row',
    backgroundColor: archive.color.cream,
    borderTopWidth: 1,
    borderTopColor: archive.color.line,
    paddingTop: 10,
    paddingHorizontal: 8,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 2 },
  glyph: { fontSize: 16, lineHeight: 18 },
  label: { fontFamily: font.sans, fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase' },
  dot: { width: 4, height: 4, borderRadius: 2, marginTop: 1 },
});
