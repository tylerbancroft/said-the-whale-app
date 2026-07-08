import { Tabs } from 'expo-router';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { MiniPlayer } from '@/components/MiniPlayer';
import { colors, spacing } from '@/theme/tokens';

type TabMeta = {
  name: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconOutline: keyof typeof Ionicons.glyphMap;
};

const TABS: TabMeta[] = [
  { name: 'index', label: 'Home', icon: 'home', iconOutline: 'home-outline' },
  { name: 'listen', label: 'Listen', icon: 'musical-notes', iconOutline: 'musical-notes-outline' },
  { name: 'pod', label: 'Pod', icon: 'chatbubbles', iconOutline: 'chatbubbles-outline' },
  { name: 'journal', label: 'Journal', icon: 'book', iconOutline: 'book-outline' },
  { name: 'shows', label: 'Shows', icon: 'location', iconOutline: 'location-outline' },
];

// Custom tab bar so the persistent MiniPlayer can dock directly above it.
function TabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.footer}>
      <MiniPlayer />
      <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
        {state.routes.map((route: any, index: number) => {
          const focused = state.index === index;
          const meta = TABS.find((t) => t.name === route.name) ?? TABS[0];
          const color = focused ? colors.accent : colors.muted;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable key={route.key} onPress={onPress} style={styles.tab} hitSlop={6}>
              <Ionicons name={focused ? meta.icon : meta.iconOutline} size={22} color={color} />
              <Text style={[styles.label, { color }]}>{meta.label}</Text>
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
      <Tabs.Screen name="listen" />
      <Tabs.Screen name="pod" />
      <Tabs.Screen name="journal" />
      <Tabs.Screen name="shows" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  footer: { backgroundColor: colors.ground },
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 4 },
  label: { fontSize: 10, fontWeight: '600' },
});
