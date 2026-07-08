import { ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, serif, Gradient } from '@/theme/tokens';

/* ------------------------------------------------------------------ Screen */

export function Screen({
  children,
  contentStyle,
}: {
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, contentStyle]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </View>
  );
}

/* ------------------------------------------------------------------ Header */

export function AppHeader({ member = true }: { member?: boolean }) {
  return (
    <View style={styles.header}>
      <View style={styles.wordmark}>
        <Text style={styles.whale}>🐋</Text>
        <Text style={styles.wordmarkText}>SAID THE WHALE</Text>
      </View>
      {member ? (
        <View style={styles.memberChip}>
          <Text style={styles.memberChipText}>◈ POD MEMBER</Text>
        </View>
      ) : null}
    </View>
  );
}

/* ------------------------------------------------------------- ScreenTitle */

export function ScreenTitle({ children }: { children: ReactNode }) {
  return <Text style={styles.screenTitle}>{children}</Text>;
}

/* ----------------------------------------------------------- SectionLabel */

export function SectionLabel({
  children,
  actionLabel,
  onAction,
}: {
  children: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionLabelRow}>
      <Text style={styles.sectionLabel}>{children}</Text>
      {actionLabel ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.sectionAction}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

/* -------------------------------------------------------------------- Card */

export function Card({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

/* --------------------------------------------------------------------- Tag */

export function Tag({ label, tone = 'foam' }: { label: string; tone?: 'foam' | 'gold' }) {
  const isGold = tone === 'gold';
  return (
    <View style={[styles.tag, { backgroundColor: isGold ? colors.goldSoft : colors.foamSoft }]}>
      <Text style={[styles.tagText, { color: isGold ? colors.gold : colors.foam }]}>{label}</Text>
    </View>
  );
}

/* --------------------------------------------------------------------- Art */

export function Art({
  gradient,
  size,
  round = radius.md,
  children,
  style,
}: {
  gradient: Gradient;
  size?: number;
  round?: number;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <LinearGradient
      colors={gradient}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[
        { borderRadius: round, justifyContent: 'flex-end' },
        size ? { width: size, height: size } : null,
        style,
      ]}
    >
      {children}
    </LinearGradient>
  );
}

/* ------------------------------------------------------------------ Button */

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  small,
  style,
}: {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'ghost' | 'light';
  icon?: keyof typeof Ionicons.glyphMap;
  small?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const bg =
    variant === 'primary' ? colors.accent : variant === 'light' ? colors.white : 'rgba(255,255,255,0.14)';
  const fg = variant === 'primary' ? colors.accentInk : variant === 'light' ? '#C23B52' : colors.white;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        small && styles.buttonSmall,
        { backgroundColor: bg, opacity: pressed ? 0.85 : 1 },
        style,
      ]}
    >
      {icon ? <Ionicons name={icon} size={small ? 14 : 16} color={fg} /> : null}
      <Text style={[styles.buttonText, small && { fontSize: 12.5 }, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

/* ------------------------------------------------------------------ Avatar */

export function Avatar({
  initials,
  color,
  size = 36,
}: {
  initials: string;
  color: string;
  size?: number;
}) {
  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
      ]}
    >
      <Text style={[styles.avatarText, { fontSize: size * 0.36 }]}>{initials}</Text>
    </View>
  );
}

/* --------------------------------------------------------------- DateChip */

export function DateChip({ month, day }: { month: string; day: string }) {
  return (
    <View style={styles.dateChip}>
      <Text style={styles.dateChipMonth}>{month.toUpperCase()}</Text>
      <Text style={styles.dateChipDay}>{day}</Text>
    </View>
  );
}

/* ------------------------------------------------------------------ styles */

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ground },
  scrollContent: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: 140 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.md,
  },
  wordmark: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  whale: { fontSize: 18 },
  wordmarkText: { color: colors.ink, fontWeight: '800', fontSize: 14, letterSpacing: 1 },
  memberChip: {
    borderWidth: 1,
    borderColor: 'rgba(240,180,41,0.35)',
    backgroundColor: 'rgba(240,180,41,0.14)',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  memberChipText: { color: colors.gold, fontWeight: '800', fontSize: 10, letterSpacing: 0.5 },

  screenTitle: { color: colors.ink, fontFamily: serif, fontSize: 26, marginTop: spacing.xs, marginBottom: spacing.xs },

  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  sectionLabel: { color: colors.muted, fontWeight: '700', fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase' },
  sectionAction: { color: colors.foam, fontWeight: '700', fontSize: 12 },

  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.xl,
    padding: spacing.lg,
  },

  tag: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start' },
  tagText: { fontWeight: '800', fontSize: 10, letterSpacing: 0.6, textTransform: 'uppercase' },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingHorizontal: spacing.lg,
    paddingVertical: 11,
    borderRadius: radius.md,
  },
  buttonSmall: { paddingHorizontal: spacing.md, paddingVertical: 9, borderRadius: radius.sm + 3 },
  buttonText: { fontWeight: '700', fontSize: 13.5 },

  avatar: { alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.white, fontWeight: '800' },

  dateChip: {
    width: 52,
    borderRadius: radius.md,
    backgroundColor: colors.foamSoft,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  dateChipMonth: { color: colors.foam, fontWeight: '800', fontSize: 10.5, letterSpacing: 0.8 },
  dateChipDay: { color: colors.ink, fontWeight: '800', fontSize: 20, marginTop: 2 },
});
