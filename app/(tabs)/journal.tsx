import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { Screen, AppHeader, ScreenTitle, Tag } from '@/components/ui';
import { colors, spacing, radius, serif } from '@/theme/tokens';
import { posts, Post } from '@/data/mock';

export default function Journal() {
  return (
    <Screen>
      <AppHeader />
      <ScreenTitle>Journal</ScreenTitle>

      <View style={styles.list}>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </View>

      <Text style={styles.note}>
        ✍️ Post videos or writing anytime — no App Store update needed, fans just see it.
      </Text>
    </Screen>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <View style={styles.card}>
      {post.gradient ? (
        <LinearGradient
          colors={post.gradient}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={styles.thumb}
        >
          <View style={styles.thumbTop}>
            {post.membersOnly ? <Tag label="Members" tone="gold" /> : <Tag label="Video" />}
          </View>
          <View style={styles.playCircle}>
            <Ionicons name={post.membersOnly ? 'lock-closed' : 'play'} size={18} color={colors.white} />
          </View>
        </LinearGradient>
      ) : null}

      <View style={styles.body}>
        <Text style={styles.when}>{post.when}</Text>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.excerpt}>{post.excerpt}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  list: { marginTop: spacing.md, gap: spacing.lg },
  card: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  thumb: { height: 168, alignItems: 'center', justifyContent: 'center' },
  thumbTop: { position: 'absolute', top: spacing.md, left: spacing.md },
  playCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { padding: spacing.lg },
  when: { color: colors.foam, fontSize: 10.5, letterSpacing: 1, fontWeight: '800', textTransform: 'uppercase' },
  title: { color: colors.ink, fontFamily: serif, fontSize: 19, marginTop: spacing.sm, marginBottom: spacing.xs, lineHeight: 23 },
  excerpt: { color: colors.muted, fontSize: 13, lineHeight: 19 },

  note: { color: colors.muted, fontSize: 11.5, marginTop: spacing.xl, lineHeight: 17 },
});
