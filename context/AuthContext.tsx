import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

/**
 * Access-code gate.
 *
 * Fans redeem a one-time code (issued to existing Patreon supporters). Once
 * redeemed we persist a flag on the device, so they never enter it again —
 * exactly the "unlock once, remembered forever" behavior we want.
 *
 * For now validation is local/mock. When the backend exists, `redeem()` is the
 * single place to swap in a real API call that checks the code and returns a
 * session token (see README → Roadmap → Access codes).
 */

const STORAGE_KEY = 'stw.access.v1';

// Demo codes that unlock the app today. Real codes will be validated server-side.
const DEMO_CODES = ['WHALE', 'PODWHALE', 'STWPOD', 'HONEYLUNGS'];

type RedeemResult = { ok: boolean; error?: string };

type AuthValue = {
  ready: boolean; // finished reading storage on launch
  unlocked: boolean;
  redeem: (code: string) => Promise<RedeemResult>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) setUnlocked(true);
      } catch {
        // ignore read errors — treat as locked
      } finally {
        setReady(true);
      }
    })();
  }, []);

  async function redeem(code: string): Promise<RedeemResult> {
    const normalized = code.trim().toUpperCase();
    if (normalized.length < 4) {
      return { ok: false, error: 'Enter the code from your welcome email.' };
    }

    // Simulate a server round-trip so the UX matches the real thing later.
    await new Promise((resolve) => setTimeout(resolve, 650));

    // Demo rule: known codes, or any 6+ character alphanumeric code, unlock.
    const valid = DEMO_CODES.includes(normalized) || /^[A-Z0-9]{6,}$/.test(normalized);
    if (!valid) {
      return { ok: false, error: 'That code didn’t work. Double-check for typos.' };
    }

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ code: normalized, at: Date.now() }));
    } catch {
      // Non-fatal: still unlock for this run.
    }
    setUnlocked(true);
    return { ok: true };
  }

  async function signOut() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setUnlocked(false);
  }

  return <AuthContext.Provider value={{ ready, unlocked, redeem, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
