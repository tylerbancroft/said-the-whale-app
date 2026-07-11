import 'react-native-reanimated';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import { PlayerProvider } from '@/context/PlayerContext';
import { PhotoProvider } from '@/context/PhotoContext';
import { colors } from '@/theme/tokens';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PlayerProvider>
          <PhotoProvider>
            <StatusBar style="dark" />
            <RootNav />
          </PhotoProvider>
        </PlayerProvider>
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
    const inTabs = segments[0] === '(tabs)';
    const onOnboarding = segments[0] === 'onboarding';

    if (!unlocked && inTabs) {
      router.replace('/onboarding');
    } else if (unlocked && onOnboarding) {
      router.replace('/');
    }
  }, [ready, unlocked, segments, router]);

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.ground },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="onboarding" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.ground },
});
