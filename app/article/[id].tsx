import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { POSTS } from '@/data/redesign';
import { archive, font } from '@/theme/archive';

/** Screen 8 — News article: a cream reading page. */
export default function Article() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const post = POSTS[Number(id)];

  if (!post) {
    return (
      <View style={[styles.root, { alignItems: 'center', justifyContent: 'center' }]}>
        <Pressable onPress={() => router.back()}><Text style={styles.back}>← Gazette</Text></Pressable>
      </View>
    );
  }

  const imgInk = post.imgDark ? archive.color.photoText : archive.color.ink;
  const imgLine = post.imgDark ? 'rgba(255,255,255,0.4)' : 'rgba(70,55,43,0.4)';

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}><Text style={styles.back}>← Gazette</Text></Pressable>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.article}>
          <Text style={styles.date}>{post.date}</Text>
          <Text style={styles.title}>{post.title}</Text>
          <View style={styles.rule} />
          {post.img && (
            <View style={[styles.imgBlock, { backgroundColor: post.imgColor }]}>
              <View style={[styles.imgLabelBox, { borderColor: imgLine }]}>
                <Text style={[styles.imgLabel, { color: imgInk }]}>{post.imgLabel}</Text>
              </View>
            </View>
          )}
          <View style={styles.body}>
            {post.body.map((para, i) => (
              <Text key={i} style={styles.para}>{para}</Text>
            ))}
          </View>
          <Text style={styles.signoff}>— with love, the whales</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: archive.color.cream },
  header: { paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: archive.color.line },
  back: { fontFamily: font.sans, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: archive.color.deepBlue },
  article: { paddingHorizontal: 28, paddingTop: 30, paddingBottom: 40, alignItems: 'center' },
  date: { fontFamily: font.sans, fontSize: 10.5, letterSpacing: 3, textTransform: 'uppercase', color: archive.color.red },
  title: { fontFamily: font.sans, fontSize: 24, fontWeight: '600', letterSpacing: 0.5, lineHeight: 31, marginTop: 10, textAlign: 'center', color: archive.color.ink },
  rule: { width: 36, height: 1, backgroundColor: archive.color.red, marginVertical: 16 },
  imgBlock: { height: 150, alignSelf: 'stretch', marginBottom: 22, alignItems: 'center', justifyContent: 'center' },
  imgLabelBox: { borderWidth: 1, paddingHorizontal: 14, paddingVertical: 6 },
  imgLabel: { fontFamily: font.sans, fontSize: 10, letterSpacing: 3, textTransform: 'uppercase' },
  body: { alignSelf: 'stretch', maxWidth: 330, marginHorizontal: 'auto' },
  para: { fontFamily: font.sans, fontSize: 14, lineHeight: 24.5, color: archive.color.body, marginBottom: 16 },
  signoff: { fontFamily: font.script, fontSize: 14, color: archive.color.warmGrey, marginTop: 10 },
});
