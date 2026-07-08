import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppHeader, ScreenTitle, Avatar } from '@/components/ui';
import { colors, spacing, radius } from '@/theme/tokens';
import { channels, messages } from '@/data/mock';

export default function Pod() {
  const [active, setActive] = useState(channels[0].id);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppHeader />
        <ScreenTitle>The Pod</ScreenTitle>

        {/* Channels */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.channels}
          style={styles.channelsWrap}
        >
          {channels.map((c) => {
            const on = c.id === active;
            return (
              <Pressable
                key={c.id}
                onPress={() => setActive(c.id)}
                style={[styles.chan, on && styles.chanActive]}
              >
                <Text style={[styles.chanText, on && styles.chanTextActive]}>＃ {c.name}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Messages */}
        <View style={styles.messages}>
          {messages.map((m) => (
            <View key={m.id} style={styles.msg}>
              <Avatar initials={m.initials} color={m.color} />
              <View style={styles.msgBody}>
                <Text style={styles.msgWho}>
                  {m.user}
                  {m.band ? <Text style={styles.msgBadge}> ◈ BAND</Text> : null}
                  <Text style={styles.msgWhen}> {m.when}</Text>
                </Text>
                <Text style={[styles.msgText, m.band && styles.msgTextBand]}>{m.text}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.note}>
          💬 A real chat for your fans, run by you — the Discord you own, gated to Pod members.
        </Text>
      </ScrollView>

      {/* Composer (visual placeholder) */}
      <View style={styles.composer}>
        <Text style={styles.composerPlaceholder}>Message ＃{channels.find((c) => c.id === active)?.name}…</Text>
        <View style={styles.send}>
          <Ionicons name="send" size={15} color={colors.accentInk} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ground },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: spacing.lg },

  channelsWrap: { marginTop: spacing.md, marginHorizontal: -spacing.xl },
  channels: { gap: spacing.sm, paddingHorizontal: spacing.xl },
  chan: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md + 1,
    paddingVertical: spacing.sm,
  },
  chanActive: { backgroundColor: colors.accent, borderColor: 'transparent' },
  chanText: { color: colors.muted, fontWeight: '700', fontSize: 12.5 },
  chanTextActive: { color: colors.accentInk },

  messages: { marginTop: spacing.lg },
  msg: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  msgBody: { flex: 1, minWidth: 0 },
  msgWho: { color: colors.ink, fontWeight: '700', fontSize: 13 },
  msgBadge: { color: colors.gold, fontWeight: '800', fontSize: 9, letterSpacing: 0.5 },
  msgWhen: { color: colors.faint, fontSize: 11, fontWeight: '500' },
  msgText: { color: colors.ink, fontSize: 13, marginTop: 3, lineHeight: 18 },
  msgTextBand: { color: colors.foam },

  note: { color: colors.muted, fontSize: 11.5, marginTop: spacing.xl, lineHeight: 17 },

  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.md,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  composerPlaceholder: { flex: 1, color: colors.faint, fontSize: 13 },
  send: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
