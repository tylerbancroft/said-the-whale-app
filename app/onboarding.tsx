import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import { useAuth } from '@/context/AuthContext';
import { colors, spacing, radius, serif, grad } from '@/theme/tokens';

/**
 * One-time welcome. Fan enters the code from their Patreon welcome email;
 * we remember it forever, so this screen is seen exactly once.
 */
export default function Onboarding() {
  const { redeem } = useAuth();
  const router = useRouter();

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onRedeem() {
    if (loading) return;
    setError(null);
    setLoading(true);
    const result = await redeem(code);
    setLoading(false);
    if (result.ok) {
      router.replace('/');
    } else {
      setError(result.error ?? 'Something went wrong.');
    }
  }

  return (
    <LinearGradient colors={grad.night} style={styles.fill}>
      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.whale}>🐋</Text>
            <Text style={styles.eyebrow}>SAID THE WHALE</Text>
          </View>

          <Text style={styles.title}>Welcome to the Pod</Text>
          <Text style={styles.subtitle}>
            Enter the access code from your welcome email to unlock the music, the community, and
            everything else. You’ll only do this once.
          </Text>

          <View style={styles.field}>
            <TextInput
              value={code}
              onChangeText={(t) => {
                setCode(t);
                if (error) setError(null);
              }}
              placeholder="Your access code"
              placeholderTextColor={colors.faint}
              autoCapitalize="characters"
              autoCorrect={false}
              style={styles.input}
              onSubmitEditing={onRedeem}
              returnKeyType="go"
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            onPress={onRedeem}
            disabled={loading}
            style={({ pressed }) => [styles.button, { opacity: pressed || loading ? 0.85 : 1 }]}
          >
            {loading ? (
              <ActivityIndicator color={colors.accentInk} />
            ) : (
              <Text style={styles.buttonText}>Unlock</Text>
            )}
          </Pressable>

          <Text style={styles.hint}>
            Supporting us on Patreon? Your code is in the welcome email. (Demo: try{' '}
            <Text style={styles.hintCode}>WHALE</Text>)
          </Text>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: spacing.xl, maxWidth: 480, width: '100%', alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xxl },
  whale: { fontSize: 26 },
  eyebrow: { color: colors.foam, fontWeight: '800', fontSize: 13, letterSpacing: 2 },
  title: { color: colors.ink, fontFamily: serif, fontSize: 34, marginBottom: spacing.md },
  subtitle: { color: colors.muted, fontSize: 15, lineHeight: 22, marginBottom: spacing.xxl },
  field: { marginBottom: spacing.md },
  input: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: 16,
    color: colors.ink,
    fontSize: 17,
    letterSpacing: 2,
    fontWeight: '600',
  },
  error: { color: '#FF8A73', fontSize: 13, marginBottom: spacing.sm, marginLeft: spacing.xs },
  button: {
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  buttonText: { color: colors.accentInk, fontWeight: '800', fontSize: 16 },
  hint: { color: colors.faint, fontSize: 12.5, textAlign: 'center', marginTop: spacing.xl, lineHeight: 18 },
  hintCode: { color: colors.gold, fontWeight: '800' },
});
