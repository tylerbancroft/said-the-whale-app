import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

import { ArchiveHeader } from '@/components/archive/ArchiveHeader';
import { PhotoBackdrop } from '@/components/archive/PhotoBackdrop';
import { PhotoTitle } from '@/components/archive/PhotoTitle';
import { MESSAGES, PICK_EMOJIS, ChatMessage, avatarColor, avatarInitials } from '@/data/redesign';
import { archive, font } from '@/theme/archive';

const MAX_DISTINCT = 5;

/** Screen 5 — Chat ("The Tide Pool"): glass-bubble feed with emoji reactions. */
export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => MESSAGES.map((m) => ({ ...m, reactions: m.reactions.map((r) => ({ ...r })) })));
  const [draft, setDraft] = useState('');
  const [pickerFor, setPickerFor] = useState<number | null>(null);

  const toggle = (mi: number, emoji: string) => {
    setMessages((prev) => prev.map((m, i) => {
      if (i !== mi) return m;
      const reactions = m.reactions.map((r) => ({ ...r }));
      const idx = reactions.findIndex((r) => r.e === emoji);
      if (idx === -1) return m;
      const r = reactions[idx];
      r.mine = !r.mine;
      r.c += r.mine ? 1 : -1;
      return { ...m, reactions: reactions.filter((x) => x.c > 0) };
    }));
  };

  const pick = (mi: number, emoji: string) => {
    setMessages((prev) => prev.map((m, i) => {
      if (i !== mi) return m;
      const reactions = m.reactions.map((r) => ({ ...r }));
      const existing = reactions.find((r) => r.e === emoji);
      if (existing) {
        existing.mine = !existing.mine;
        existing.c += existing.mine ? 1 : -1;
        return { ...m, reactions: reactions.filter((x) => x.c > 0) };
      }
      if (reactions.length >= MAX_DISTINCT) return m; // cap distinct reactions
      reactions.push({ e: emoji, c: 1, mine: true });
      return { ...m, reactions };
    }));
    setPickerFor(null);
  };

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { name: 'You', time: 'now', text, reactions: [] }]);
    setDraft('');
  };

  return (
    <View style={styles.root}>
      <ArchiveHeader />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <PhotoBackdrop>
          <PhotoTitle eyebrow="The" title="Tide Pool" caption="a gentle place for fans" />

          <ScrollView contentContainerStyle={styles.feed} showsVerticalScrollIndicator={false}>
            {messages.map((m, mi) => (
              <View key={mi} style={styles.msgRow}>
                <View style={[styles.avatar, { backgroundColor: avatarColor(m.name) }]}>
                  <Text style={styles.avatarText}>{avatarInitials(m.name)}</Text>
                </View>
                <View style={styles.bubbleWrap}>
                  <BlurView intensity={24} tint="dark" style={StyleSheet.absoluteFill} />
                  <View style={[StyleSheet.absoluteFill, { backgroundColor: archive.color.glassBg }]} />
                  <View style={styles.bubbleInner}>
                    <View style={styles.bubbleHead}>
                      <Text style={styles.name}>{m.name}</Text>
                      <Text style={styles.time}>{m.time}</Text>
                    </View>
                    <Text style={styles.text}>{m.text}</Text>

                    <View style={styles.reactions}>
                      {m.reactions.map((r) => (
                        <Pressable
                          key={r.e}
                          onPress={() => toggle(mi, r.e)}
                          style={[styles.chip, r.mine ? styles.chipMine : styles.chipPlain]}
                        >
                          <Text style={styles.chipEmoji}>{r.e}</Text>
                          <Text style={[styles.chipCount, r.mine && { color: archive.color.paper }]}>{r.c}</Text>
                        </Pressable>
                      ))}
                      {m.reactions.length < MAX_DISTINCT && (
                        <Pressable onPress={() => setPickerFor(pickerFor === mi ? null : mi)} style={styles.addChip}>
                          <Text style={styles.addChipText}>+ ☺</Text>
                        </Pressable>
                      )}
                    </View>

                    {pickerFor === mi && (
                      <View style={styles.picker}>
                        {PICK_EMOJIS.map((e) => (
                          <Pressable key={e} onPress={() => pick(mi, e)} hitSlop={4} style={styles.pickBtn}>
                            <Text style={styles.pickEmoji}>{e}</Text>
                          </Pressable>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.composer}>
            <BlurView intensity={30} tint="light" style={StyleSheet.absoluteFill} />
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(243,236,221,0.45)' }]} />
            <View style={styles.composerRow}>
              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder="write something kind…"
                placeholderTextColor="rgba(70,55,43,0.5)"
                style={styles.input}
                onSubmitEditing={send}
                returnKeyType="send"
              />
              <Pressable onPress={send} style={styles.send} hitSlop={6}><Text style={styles.sendGlyph}>↑</Text></Pressable>
            </View>
          </View>
        </PhotoBackdrop>
      </KeyboardAvoidingView>
    </View>
  );
}

const shadow = archive.photoShadow;
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: archive.color.cream },
  feed: { paddingHorizontal: 20, paddingTop: 6, paddingBottom: 16, gap: 14 },

  msgRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  avatar: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: archive.color.paper, fontSize: 11, fontWeight: '600', letterSpacing: 1, fontFamily: font.sans },

  bubbleWrap: { flex: 1, minWidth: 0, borderRadius: 16, borderTopLeftRadius: 4, borderWidth: 1, borderColor: archive.color.glassBorder, overflow: 'hidden' },
  bubbleInner: { padding: 12 },
  bubbleHead: { flexDirection: 'row', alignItems: 'baseline', gap: 10 },
  name: { fontFamily: font.sans, fontSize: 12.5, fontWeight: '600', letterSpacing: 0.5, color: archive.color.photoText, ...shadow, textShadowRadius: 8 },
  time: { fontFamily: font.sans, fontSize: 10.5, color: archive.color.photoTextFaint, letterSpacing: 1, ...shadow, textShadowRadius: 8 },
  text: { fontFamily: font.sans, fontSize: 13.5, lineHeight: 21, color: 'rgba(247,241,227,0.95)', marginTop: 5, ...shadow },

  reactions: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 8, alignItems: 'center' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 999, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 3 },
  chipPlain: { backgroundColor: 'rgba(35,26,18,0.35)', borderColor: 'rgba(255,255,255,0.3)' },
  chipMine: { backgroundColor: 'rgba(196,97,78,0.6)', borderColor: '#E8A08F' },
  chipEmoji: { fontSize: 12 },
  chipCount: { fontSize: 11, color: archive.color.photoText, fontFamily: font.sans },
  addChip: { borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)', borderStyle: 'dashed', paddingHorizontal: 10, paddingVertical: 3 },
  addChipText: { fontSize: 12, color: 'rgba(247,241,227,0.7)', fontFamily: font.sans },

  picker: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)', backgroundColor: 'rgba(35,26,18,0.5)' },
  pickBtn: { paddingHorizontal: 4, paddingVertical: 2 },
  pickEmoji: { fontSize: 17 },

  composer: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.35)', overflow: 'hidden' },
  composerRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingVertical: 12 },
  input: { flex: 1, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)', backgroundColor: 'rgba(251,246,234,0.75)', borderRadius: 999, paddingHorizontal: 18, paddingVertical: 11, fontFamily: font.sans, fontSize: 13, color: archive.color.ink },
  send: { width: 42, height: 42, borderRadius: 21, backgroundColor: archive.color.deepBlue, alignItems: 'center', justifyContent: 'center' },
  sendGlyph: { color: archive.color.paper, fontSize: 16 },
});
