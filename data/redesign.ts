/**
 * Content for Chat, Tour, and News — still the prototype placeholders
 * (see issue #1). Album / era-world data lives in data/catalog.ts.
 */

export type Show = { month: string; day: string; city: string; venue: string; color: string; dark: boolean };
export const SHOWS: Show[] = [
  { month: 'Aug', day: '14', city: 'Vancouver, BC', venue: 'The Orpheum Theatre', color: '#8FA8B4', dark: false },
  { month: 'Aug', day: '16', city: 'Victoria, BC', venue: 'Royal Theatre', color: '#7C9C8F', dark: false },
  { month: 'Aug', day: '21', city: 'Seattle, WA', venue: 'The Neptune', color: '#D9A03F', dark: true },
  { month: 'Sep', day: '02', city: 'Calgary, AB', venue: 'Bella Concert Hall', color: '#C4614E', dark: true },
  { month: 'Sep', day: '05', city: 'Toronto, ON', venue: 'Danforth Music Hall', color: '#53707E', dark: true },
];

export type Post = {
  date: string; title: string; preview: string;
  img: boolean; imgColor?: string; imgLabel?: string; imgDark?: boolean; body: string[];
};
export const POSTS: Post[] = [
  { date: 'July 8, 2026', title: 'A New Record Is Taking Shape', preview: 'We’ve spent the spring in a cabin studio on Gambier Island, and we have news: the songs are nearly done.',
    img: true, imgColor: '#8FA8B4', imgLabel: 'studio photo', imgDark: false,
    body: ['We’ve spent the spring in a cabin studio on Gambier Island, sleeping badly and recording well. There is something about writing within earshot of the ferry horn that keeps a song honest.', 'Eleven songs are tracked. Two are fighting us. One arrived fully formed at four in the morning and we still don’t quite trust it.', 'We can’t tell you the name yet, but we can tell you it’s the warmest thing we’ve ever made. More soon — pinky promise.'] },
  { date: 'June 19, 2026', title: 'The Archive Project: Every Show Poster, Restored', preview: 'We found a box of tour posters in Ben’s parents’ garage. Naturally, we scanned all 214 of them.',
    img: true, imgColor: '#EFDCA8', imgLabel: 'poster wall', imgDark: true,
    body: ['In April, Ben’s parents politely asked us to remove nineteen years of band detritus from their garage. Inside one water-stained box: two hundred and fourteen show posters, dating back to a 2007 basement show in Kitsilano.', 'We’ve had every one professionally scanned and restored. They’ll live in the app soon, arranged by year, alongside the setlists we could reconstruct from memory and old forum posts.', 'If you have a poster we missed, write to us. We will trade you a very sincere thank-you note.'] },
  { date: 'May 30, 2026', title: 'Summer Tour: The Coastal Run', preview: 'Five rooms we love, up and down the coast. Tickets are live now in the Tour section.',
    img: false, body: ['This summer we’re keeping it close to home: five rooms we love, up and down the coast, each one chosen because it sounds beautiful and feels like somebody’s living room.', 'Tickets are live now in the Tour section of the app. Bring your parents. Bring your kids. Bring that friend who claims they don’t like folk music.'] },
  { date: 'May 2, 2026', title: 'hawaiii Turns Thirteen', preview: 'Our sun-bleached middle child is a teenager now. Some reflections on the summer that made it.',
    img: false, body: ['Thirteen years ago we put out a record with three i’s in its name, and to this day nobody can agree on how to pronounce it. We consider this a triumph.', 'hawaiii was written in a heat wave, recorded in a hurry, and mixed with the windows open. Listening back now, you can practically hear the sunburn.', 'Happy birthday, you strange bright thing.'] },
];

export type ChatReaction = { e: string; c: number; mine: boolean };
export type ChatMessage = { name: string; time: string; text: string; reactions: ChatReaction[] };
export const MESSAGES: ChatMessage[] = [
  { name: 'Marguerite F.', time: '9:12 am', text: 'Drove the Sea-to-Sky highway this morning with Islands Disappear on. Some records just belong to a place.', reactions: [{ e: '❤️', c: 12, mine: false }, { e: '🌊', c: 4, mine: false }] },
  { name: 'Desmond K.', time: '9:40 am', text: 'Twenty years a fan and Emerald Lake, AB still gets me every single time.', reactions: [{ e: '🥲', c: 8, mine: false }, { e: '❤️', c: 5, mine: false }, { e: '🐋', c: 2, mine: false }] },
  { name: 'June & Oliver', time: '10:05 am', text: 'Our daughter’s first concert was the Cascadia tour. She still has the poster above her bed.', reactions: [{ e: '❤️', c: 21, mine: false }, { e: '🥹', c: 7, mine: false }] },
  { name: 'Theodore B.', time: '10:31 am', text: 'Humble request: Nothing Special on vinyl, pressed in dusty blue. I would frame the sleeve.', reactions: [{ e: '🔥', c: 9, mine: false }, { e: '👏', c: 6, mine: false }, { e: '💿', c: 3, mine: false }] },
];

export const PICK_EMOJIS = ['❤️', '🐋', '🌊', '🔥', '😂', '🥹', '👏', '🎸'];

// Deterministic avatar tint per chat name.
const AV_COLORS = ['#8FA8B4', '#7C9C8F', '#C4614E', '#D9A03F', '#53707E', '#B98B6E'];
export function avatarColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AV_COLORS[h % AV_COLORS.length];
}
export function avatarInitials(name: string): string {
  const words = name.replace(/[^A-Za-z& ]/g, '').trim().split(/\s+/);
  return (words.length >= 2 ? words[0][0] + words[1][0] : name.slice(0, 2)).toUpperCase();
}
