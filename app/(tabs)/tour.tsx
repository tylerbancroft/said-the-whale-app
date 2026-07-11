import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { ArchiveHeader } from '@/components/archive/ArchiveHeader';
import { PhotoBackdrop } from '@/components/archive/PhotoBackdrop';
import { PhotoTitle } from '@/components/archive/PhotoTitle';
import { SHOWS } from '@/data/redesign';
import { archive, font } from '@/theme/archive';

/** Screen 6 — Tour ("On the Road / Tour Dates"). */
export default function TourScreen() {
  return (
    <View style={styles.root}>
      <ArchiveHeader />
      <PhotoBackdrop>
        <PhotoTitle eyebrow="On the Road" title="Tour Dates" />
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {SHOWS.map((s, i) => {
            const dateInk = s.dark ? archive.color.photoText : archive.color.ink;
            return (
              <View key={i} style={styles.row}>
                <View style={[styles.dateBlock, { backgroundColor: s.color }]}>
                  <Text style={[styles.month, { color: dateInk }]}>{s.month}</Text>
                  <Text style={[styles.day, { color: dateInk }]}>{s.day}</Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.city}>{s.city}</Text>
                  <Text style={styles.venue}>{s.venue}</Text>
                </View>
                <Pressable style={styles.tickets} onPress={() => Linking.openURL('https://saidthewhale.com/shows').catch(() => {})}>
                  <Text style={styles.ticketsText}>Tickets</Text>
                </Pressable>
              </View>
            );
          })}
          <Text style={styles.footer}>see you out there ✳</Text>
        </ScrollView>
      </PhotoBackdrop>
    </View>
  );
}

const shadow = archive.photoShadow;
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: archive.color.cream },
  list: { paddingHorizontal: 22, paddingBottom: 28 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.18)' },
  dateBlock: { width: 52, height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center', gap: 1 },
  month: { fontFamily: font.sans, fontSize: 9.5, letterSpacing: 2, textTransform: 'uppercase' },
  day: { fontFamily: font.sans, fontSize: 19, fontWeight: '600' },
  info: { flex: 1, minWidth: 0 },
  city: { fontFamily: font.sans, fontSize: 14, fontWeight: '600', letterSpacing: 0.5, color: archive.color.photoText, ...shadow, textShadowRadius: 8 },
  venue: { fontFamily: font.sans, fontSize: 12, letterSpacing: 0.5, color: 'rgba(247,241,227,0.7)', marginTop: 3, ...shadow, textShadowRadius: 8 },
  tickets: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.55)', backgroundColor: 'rgba(35,26,18,0.25)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999 },
  ticketsText: { fontFamily: font.sans, fontSize: 10.5, fontWeight: '600', letterSpacing: 2, textTransform: 'uppercase', color: archive.color.photoText },
  footer: { textAlign: 'center', marginTop: 18, fontFamily: font.script, fontSize: 14, color: 'rgba(247,241,227,0.85)', ...shadow, textShadowRadius: 8 },
});
