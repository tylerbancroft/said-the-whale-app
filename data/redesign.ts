/**
 * Content for the "Boutique Archive" redesign, transcribed from the design
 * prototype (design/stw-redesign/Said The Whale App.dc.html).
 *
 * Album titles/years/descriptions are the real discography. Track lists, tour
 * dates, news posts and chat messages are the designer's placeholder content —
 * wire to real data before shipping (see issue #1).
 */
import { archive } from '@/theme/archive';

export type ArchiveAlbum = {
  id: number;
  title: string;
  short: string;
  year: string;
  color: string;
  dark: boolean; // dark artwork → light rings/initials
  desc: string;
  tracks: string[];
};

export const ALBUMS: ArchiveAlbum[] = [
  { id: 0, title: 'Howe Sounds / Taking Abalonia', short: 'Howe Sounds', year: '2007', color: '#82A16E', dark: false,
    desc: 'Where it all began — a double debut of salt-air folk songs written between the mountains and the sea.',
    tracks: ['This City’s a Mess', 'The Real Old Singing Cowboy', 'Curse of the Currents', 'False Creek Change', 'Fixin’ to Leave', 'Goodnight Moon'] },
  { id: 1, title: 'Islands Disappear', short: 'Islands Disappear', year: '2009', color: '#B8A88A', dark: false,
    desc: 'A love letter to the west coast — ferries, emerald lakes, and the slow ache of leaving home.',
    tracks: ['Camilo (The Magician)', 'Emerald Lake, AB', 'Black Day in December', 'The Light Is You', 'A Cold Night Close to the End', 'Islands Disappear'] },
  { id: 2, title: 'Little Mountain', short: 'Little Mountain', year: '2012', color: '#A4B2B7', dark: false,
    desc: 'Named for the neighbourhood that raised it. Bigger rooms, brighter choruses, the same beating heart.',
    tracks: ['Loveless', 'Heavy Ceiling', 'Big Sky, MT', 'Jesse, AR', 'We Are 1980', 'O Alexandra'] },
  { id: 3, title: 'hawaiii', short: 'hawaiii', year: '2013', color: '#96B5AB', dark: false,
    desc: 'Three i’s, one summer. Sun-bleached pop songs with sand still in their shoes.',
    tracks: ['I Love You', 'Mother', 'Resolutions', 'Safe to Say', 'Wake Up', 'Ambition'] },
  { id: 4, title: 'As Long as Your Eyes Are Wide', short: 'As Long as Your Eyes…', year: '2017', color: '#DFE3DE', dark: false,
    desc: 'A record about staying open — grief and wonder held carefully in the same two hands.',
    tracks: ['Step Into the Darkness', 'I Will Follow You', 'Confidence', 'Nothing Lasts', 'Emily Rose', 'Lucky'] },
  { id: 5, title: 'Cascadia', short: 'Cascadia', year: '2019', color: '#656B62', dark: true,
    desc: 'An atlas of the Pacific Northwest — rain on cedar, ferry horns, and songs for the long grey winter.',
    tracks: ['UnAmerican', 'Old Fashioned', 'Gambier Island Green', 'Record Shop', 'Wake Up', 'Level Best'] },
  { id: 6, title: 'Dandelion', short: 'Dandelion', year: '2021', color: '#D9C48A', dark: false,
    desc: 'Written apart, stitched together. Small bright songs that grew up through the cracks of a strange year.',
    tracks: ['Everything She Touches', 'Honey Lungs', 'Show Me Everything', 'Wildflowers', 'Little Wolf', 'Dandelion'] },
  { id: 7, title: 'Nothing Special', short: 'Nothing Special', year: '2023', color: '#B98B6E', dark: true,
    desc: 'The newest chapter — plain-spoken, warm, and quietly certain that ordinary days are the whole point.',
    tracks: ['Nothing Special', 'Small Town', 'More Than This', 'Front Porch Light', 'Slow News Day', 'Sea Glass'] },
  { id: 8, title: 'B-Sides & Rarities', short: 'B-Sides & Rarities', year: '—', color: '#303C5C', dark: true,
    desc: 'Loose ends and lost gems — demos, covers, and songs that slipped between the records.',
    tracks: ['Untitled Demo', 'Old Friend (Live)', 'Wildflowers (Alt)', 'Home (Demo)', 'Sea Glass (B-Side)'] },
];

// Placeholder track durations (index-matched, cycled) — replace with real metadata.
export const TRACK_LENGTHS = ['3:12', '4:05', '2:58', '3:41', '4:22', '3:34', '3:07', '4:48'];

/** Two-letter monogram for album artwork. */
export function initialsOf(a: ArchiveAlbum): string {
  const words = a.short.replace(/[^A-Za-z ]/g, '').trim().split(/\s+/);
  const raw = words.length >= 2 ? words[0][0] + words[1][0] : a.short.slice(0, 2);
  return raw.toUpperCase();
}

/** Ring/initials colors drawn on the flat-color album art. */
export function artInk(a: ArchiveAlbum) {
  return {
    line: a.dark ? 'rgba(255,255,255,0.32)' : 'rgba(70,55,43,0.38)',
    ink: a.dark ? 'rgba(251,246,234,0.94)' : archive.color.ink,
  };
}

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
