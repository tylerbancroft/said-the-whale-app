import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ArchiveHeader } from '@/components/archive/ArchiveHeader';
import { PhotoBackdrop } from '@/components/archive/PhotoBackdrop';
import { PhotoTitle } from '@/components/archive/PhotoTitle';
import { POSTS } from '@/data/redesign';
import { archive, font } from '@/theme/archive';

/** Screen 7 — News list ("The Whale Gazette"). */
export default function NewsScreen() {
  const router = useRouter();
  return (
    <View style={styles.root}>
      <ArchiveHeader />
      <PhotoBackdrop>
        <PhotoTitle eyebrow="The" title="Whale Gazette" caption="notes from the band" />
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {POSTS.map((p, i) => {
            const imgInk = p.imgDark ? archive.color.photoText : archive.color.ink;
            const imgLine = p.imgDark ? 'rgba(255,255,255,0.4)' : 'rgba(70,55,43,0.4)';
            return (
              <Pressable key={i} onPress={() => router.push(`/article/${i}`)} style={styles.post}>
                {p.img && (
                  <View style={[styles.imgBlock, { backgroundColor: p.imgColor }]}>
                    <View style={[styles.imgLabelBox, { borderColor: imgLine }]}>
                      <Text style={[styles.imgLabel, { color: imgInk }]}>{p.imgLabel}</Text>
                    </View>
                  </View>
                )}
                <Text style={styles.date}>{p.date}</Text>
                <Text style={styles.title}>{p.title}</Text>
                <Text style={styles.preview}>{p.preview}</Text>
                <Text style={styles.read}>Read →</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </PhotoBackdrop>
    </View>
  );
}

const shadow = archive.photoShadow;
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: archive.color.cream },
  list: { paddingHorizontal: 22, paddingBottom: 28 },
  post: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)', paddingVertical: 20, alignItems: 'center' },
  imgBlock: { height: 110, alignSelf: 'stretch', backgroundColor: '#8FA8B4', borderRadius: 12, marginBottom: 16, alignItems: 'center', justifyContent: 'center' },
  imgLabelBox: { borderWidth: 1, paddingHorizontal: 14, paddingVertical: 6 },
  imgLabel: { fontFamily: font.sans, fontSize: 10, letterSpacing: 3, textTransform: 'uppercase' },
  date: { fontFamily: font.sans, fontSize: 10.5, letterSpacing: 3, textTransform: 'uppercase', color: archive.color.paleYellow, ...shadow, textShadowRadius: 8 },
  title: { fontFamily: font.sans, fontSize: 17, fontWeight: '600', letterSpacing: 0.5, marginTop: 6, lineHeight: 23, textAlign: 'center', color: archive.color.photoText, ...shadow },
  preview: { fontFamily: font.sans, fontSize: 13, lineHeight: 21, marginTop: 8, maxWidth: 300, textAlign: 'center', color: 'rgba(247,241,227,0.85)', ...shadow },
  read: { fontFamily: font.sans, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginTop: 10, color: 'rgba(247,241,227,0.7)', ...shadow, textShadowRadius: 8 },
});
