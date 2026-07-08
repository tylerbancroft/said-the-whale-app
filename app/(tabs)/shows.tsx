import { View, Text, StyleSheet } from 'react-native';

import { Screen, AppHeader, ScreenTitle, Card, Button, DateChip } from '@/components/ui';
import { colors, spacing } from '@/theme/tokens';
import { shows } from '@/data/mock';

export default function Shows() {
  return (
    <Screen>
      <AppHeader />
      <ScreenTitle>Shows</ScreenTitle>

      <Card style={styles.card}>
        {shows.map((show, i) => (
          <View key={show.id} style={[styles.row, i < shows.length - 1 && styles.rowBorder]}>
            <DateChip month={show.month} day={show.day} />
            <View style={styles.meta}>
              <Text style={styles.city}>{show.city}</Text>
              <Text style={styles.venue}>{show.venue}</Text>
            </View>
            {show.soldOut ? (
              <Text style={styles.soldOut}>Sold out</Text>
            ) : (
              <Button label="Tickets" small />
            )}
          </View>
        ))}
      </Card>

      <Text style={styles.note}>
        📅 Placeholder dates — can sync automatically from Bandsintown or a sheet you control.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: spacing.md, paddingVertical: 0 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.line },
  meta: { flex: 1 },
  city: { color: colors.ink, fontWeight: '700', fontSize: 14.5 },
  venue: { color: colors.muted, fontSize: 12, marginTop: 2 },
  soldOut: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '700',
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: 11,
    overflow: 'hidden',
  },
  note: { color: colors.muted, fontSize: 11.5, marginTop: spacing.xl, lineHeight: 17 },
});
