import { grad, Gradient } from '@/theme/tokens';

/**
 * Placeholder content so every screen feels real.
 * Album titles are genuine Said The Whale records; tracks, shows, posts,
 * and messages are stand-ins to show layout. All of this will be replaced
 * by data from the backend (see README → Roadmap).
 */

export type Track = {
  id: string;
  title: string;
  album: string;
  durationSec: number;
  gradient: Gradient;
  membersOnly?: boolean;
};

export type Album = {
  id: string;
  title: string;
  year: number;
  songCount: number;
  gradient: Gradient;
  membersOnly?: boolean;
  subtitle?: string;
};

export type Show = {
  id: string;
  month: string;
  day: string;
  city: string;
  venue: string;
  soldOut?: boolean;
};

export type Post = {
  id: string;
  kind: 'video' | 'text';
  when: string;
  title: string;
  excerpt: string;
  membersOnly?: boolean;
  gradient?: Gradient;
};

export type Channel = { id: string; name: string };

export type Message = {
  id: string;
  user: string;
  initials: string;
  color: string;
  when: string;
  text: string;
  band?: boolean;
};

export const albums: Album[] = [
  { id: 'dandelion', title: 'Dandelion', year: 2021, songCount: 10, gradient: grad.sunset },
  { id: 'cascadia', title: 'Cascadia', year: 2019, songCount: 11, gradient: grad.cascadia },
  { id: 'eyes', title: 'As Long As Your Eyes Are Wide', year: 2017, songCount: 13, gradient: grad.eyes },
  { id: 'hawaii', title: 'hawaiii', year: 2013, songCount: 12, gradient: grad.hawaii },
];

export const vault: Album = {
  id: 'vault',
  title: 'Pod Vault',
  year: 2025,
  songCount: 24,
  gradient: grad.vault,
  membersOnly: true,
  subtitle: 'Demos & unreleased',
};

export const featuredTrack: Track = {
  id: 'winter-coats',
  title: 'Winter Coats (demo)',
  album: 'Pod Vault',
  durationSec: 214,
  gradient: grad.sunset,
  membersOnly: true,
};

export const shows: Show[] = [
  { id: 's1', month: 'Aug', day: '14', city: 'Vancouver, BC', venue: 'Commodore Ballroom' },
  { id: 's2', month: 'Aug', day: '16', city: 'Victoria, BC', venue: 'Capital Ballroom' },
  { id: 's3', month: 'Aug', day: '22', city: 'Seattle, WA', venue: 'The Crocodile', soldOut: true },
  { id: 's4', month: 'Sep', day: '05', city: 'Calgary, AB', venue: 'The Palace Theatre' },
  { id: 's5', month: 'Sep', day: '09', city: 'Toronto, ON', venue: 'Danforth Music Hall' },
];

export const posts: Post[] = [
  {
    id: 'p1',
    kind: 'video',
    when: '2 days ago',
    title: 'Studio session: tracking “Winter Coats”',
    excerpt: 'Twelve minutes of us figuring out the bridge, arguing about the drum sound, and eventually getting it.',
    gradient: grad.hero,
  },
  {
    id: 'p2',
    kind: 'video',
    when: 'Last week',
    title: 'Tour journal, entry 4: the long drive to Calgary',
    excerpt: 'Photos, a voice memo, and some writing from the road — for the Pod only.',
    membersOnly: true,
    gradient: grad.eyes,
  },
  {
    id: 'p3',
    kind: 'text',
    when: 'Earlier',
    title: 'Why we’re building this app',
    excerpt: 'A note on leaving the algorithm behind and making a home for the people who actually show up.',
  },
];

export const channels: Channel[] = [
  { id: 'general', name: 'general' },
  { id: 'new-music', name: 'new-music' },
  { id: 'tour-talk', name: 'tour-talk' },
  { id: 'demos', name: 'demos' },
  { id: 'off-topic', name: 'off-topic' },
];

export const messages: Message[] = [
  { id: 'm1', user: 'jenna_l', initials: 'JL', color: '#2E9B8A', when: '28m', text: 'the winter coats demo made me cry on the bus lmao 😭' },
  { id: 'm2', user: 'mkelly', initials: 'MK', color: '#5B6BD6', when: '21m', text: 'anyone going to the commodore show? trying to find people to go with' },
  { id: 'm3', user: 'Tyler', initials: 'TB', color: '#E05A38', when: '12m', text: '@mkelly there’s a Pod meetup thread pinned in #tour-talk — come say hi before the set 🐋', band: true },
  { id: 'm4', user: 'sam.r', initials: 'SR', color: '#F0B429', when: '4m', text: 'this app is basically the group chat i always wanted with this band' },
];
