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
import { useRouter } from 'expo-router';

import { useAuth } from '@/context/AuthContext';
import { archive, font } from '@/theme/archive';

/**
 * One-time welcome in the boutique-archive look. Access code WHALE.
 * Memberships stay off-app — this screen never sells a subscription.
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
    <KeyboardAvoidingView
      style={styles.fill}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.wordmark}>Said the Whale</Text>
        <Text style={styles.tag}>est. Vancouver, B.C. — 2007</Text>
        <View style={styles.rule} />

        <Text style={styles.title}>The Record Archive</Text>
        <Text style={styles.subtitle}>
          A quiet room for the records, the photographs, and the people who already know the songs.
          Enter the access code once. We’ll remember you.
        </Text>

        <TextInput
          value={code}
          onChangeText={(t) => {
            setCode(t);
            if (error) setError(null);
          }}
          placeholder="Access code"
          placeholderTextColor={archive.color.warmGrey}
          autoCapitalize="characters"
          autoCorrect={false}
          style={styles.input}
          onSubmitEditing={onRedeem}
          returnKeyType="go"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          onPress={onRedeem}
          disabled={loading}
          style={({ pressed }) => [styles.button, { opacity: pressed || loading ? 0.85 : 1 }]}
        >
          {loading ? (
            <ActivityIndicator color={archive.color.paper} />
          ) : (
            <Text style={styles.buttonText}>Enter the archive</Text>
          )}
        </Pressable>

        <Text style={styles.hint}>
          The code is <Text style={styles.hintCode}>WHALE</Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: archive.color.cream },
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 28, maxWidth: 480, width: '100%', alignSelf: 'center' },
  wordmark: {
    fontFamily: font.sans,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 5,
    textTransform: 'uppercase',
    color: archive.color.ink,
    textAlign: 'center',
  },
  tag: { fontFamily: font.script, fontSize: 14, color: archive.color.warmGrey, textAlign: 'center', marginTop: 4 },
  rule: { width: 36, height: 1, backgroundColor: archive.color.red, alignSelf: 'center', marginVertical: 22 },
  title: { fontFamily: font.sans, fontSize: 26, fontWeight: '500', letterSpacing: 0.5, color: archive.color.ink, textAlign: 'center', marginBottom: 12 },
  subtitle: { fontFamily: font.sans, fontSize: 14.5, lineHeight: 23, color: archive.color.bodySoft, textAlign: 'center', marginBottom: 28 },
  input: {
    backgroundColor: archive.color.paper,
    borderWidth: 1,
    borderColor: archive.color.line,
    paddingHorizontal: 18,
    paddingVertical: 16,
    color: archive.color.ink,
    fontSize: 17,
    letterSpacing: 3,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: font.sans,
  },
  error: { color: archive.color.red, fontSize: 13, marginTop: 10, textAlign: 'center', fontFamily: font.sans },
  button: {
    backgroundColor: archive.color.red,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 18,
  },
  buttonText: { color: archive.color.paper, fontWeight: '600', fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', fontFamily: font.sans },
  hint: { color: archive.color.warmGrey, fontSize: 13, textAlign: 'center', marginTop: 22, fontFamily: font.sans },
  hintCode: { color: archive.color.ink, fontWeight: '700', letterSpacing: 2 },
});
