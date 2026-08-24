import 'react-native-reanimated';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ArchivePlayerProvider } from '@/context/ArchivePlayerContext';
import { CatalogProvider } from '@/context/CatalogContext';
import { PhotoProvider } from '@/context/PhotoContext';
import { archive } from '@/theme/archive';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CatalogProvider>
          <ArchivePlayerProvider>
            <PhotoProvider>
              <StatusBar style="dark" />
              <RootNav />
            </PhotoProvider>
          </ArchivePlayerProvider>
        </CatalogProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

/**
 * Gate: until the fan has redeemed a code, every route bounces to /onboarding.
 * Once unlocked (and remembered on-device), they land in the tabs and never
 * see onboarding again.
 */
function RootNav() {
  const { ready, unlocked } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    const onOnboarding = segments[0] === 'onboarding';
    const inApp =
      segments[0] === '(tabs)' ||
      segments[0] === 'player' ||
      segments[0] === 'album' ||
      segments[0] === 'article';

    if (!unlocked && inApp) {
      router.replace('/onboarding');
    } else if (unlocked && onOnboarding) {
      router.replace('/');
    }
  }, [ready, unlocked, segments, router]);

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={archive.color.red} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: archive.color.cream },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="album/[id]" />
      <Stack.Screen name="player" options={{ animation: 'fade' }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: archive.color.cream },
});
