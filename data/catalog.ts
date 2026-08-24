/**
 * The music catalog — studio albums as era worlds, compilations on the main
 * journey, EPs in the appendix.
 *
 * Remote `catalog.json` (see services/catalog.ts) can overlay stream URLs,
 * cover URIs, gallery URIs, video MP4s, and lyrics without an app update.
 * Until those URLs exist, tracks carry clearly marked TODO stream paths
 * (Dropbox layout from the discography) and the player falls back to the
 * three bundled recordings.
 */
import { covers } from '@/assets/covers';
import { nativeTracks } from '@/data/tracks';
import { archive } from '@/theme/archive';

const ALBUMS_ROOT = '/Said The Whale - Discography/Studio Albums';
const EPS_ROOT = '/Said The Whale - Discography/EPs';

const sourceOf = (id: string): number | undefined =>
  nativeTracks.find((t) => t.id === id)?.source;

export type CatalogTrack = {
  id: string;
  title: string;
  /** Bundled asset (require) — offline fallback for three songs. */
  source?: number;
  /** Remote stream URL. Empty until catalog.json / hosting is wired. */
  uri?: string;
  duration?: string;
  membersOnly?: boolean;
  extra?: boolean;
  lyrics?: string;
  /**
   * TODO STREAM — Dropbox path of the MP3 to host. Never a live URL.
   * The player ignores this field; it exists so audio hosting is unambiguous.
   */
  streamTodo?: string;
  /** Magician EP etc. — listed in the world, not playable. */
  unplayable?: string;
};

export type EraGalleryItem = {
  id: string;
  kind: 'photo' | 'poster' | 'scan' | 'cover' | 'illustration';
  source?: number;
  uri?: string;
  caption?: string;
  credit?: string;
  featured?: boolean;
};

export type EraVideo = {
  id: string;
  title: string;
  youtubeId?: string;
  /** TODO: host the Dropbox MP4 and put the https URL here. */
  uri?: string;
  streamTodo?: string;
  caption?: string;
  /** Still used as a quiet poster when there is no YouTube / hosted URL. */
  posterSource?: number;
};

export type EraWorld = {
  density: 'gold' | 'rich' | 'thin';
  hero: 'photo' | 'cover' | 'designed';
  tagline: string;
  essay: string;
  credit?: string;
  accent: string;
};

export type CatalogAlbum = {
  id: string;
  title: string;
  short: string;
  /** Display year; compilations without a wiki date may be a label instead. */
  year: string;
  /** ISO date when verified (Wikipedia). */
  released?: string;
  releasedLabel: string;
  collection: 'studio' | 'ep';
  recordNo?: string;
  color: string;
  dark: boolean;
  desc: string;
  era: EraWorld;
  coverSource?: number;
  coverUri?: string;
  artMode?: 'cover' | 'volume2' | 'wordmark';
  wordmark?: string;
  tracks: CatalogTrack[];
  gallery: EraGalleryItem[];
  videos?: EraVideo[];
  audioNote?: string;
};

export type Catalog = { albums: CatalogAlbum[] };

function numbered(folder: string, n: number, title: string): string {
  return `TODO STREAM: ${ALBUMS_ROOT}/${folder}/${String(n).padStart(2, '0')} ${title}.mp3`;
}

function unnumbered(folder: string, title: string): string {
  return `TODO STREAM: ${ALBUMS_ROOT}/${folder}/${title}.mp3`;
}

function epPath(folder: string, title: string): string {
  return `TODO STREAM: ${EPS_ROOT}/${folder}/${title}.mp3`;
}

function t(
  id: string,
  title: string,
  extra: Partial<CatalogTrack> = {},
): CatalogTrack {
  return { id, title, ...extra };
}

const photos = {
  vh0260: require('../assets/photos/cascadia/VH_STW_JUNE2018_0260.jpg'),
  vh0188: require('../assets/photos/cascadia/VH_STW_JUNE2018_0188.jpg'),
  vh0239: require('../assets/photos/cascadia/VH_STW_JUNE2018_0239.jpg'),
  vh0240: require('../assets/photos/cascadia/VH_STW_JUNE2018_0240.jpg'),
  vh0266: require('../assets/photos/cascadia/VH_STW_JUNE2018_0266.jpg'),
  vh0274: require('../assets/photos/cascadia/VH_STW_JUNE2018_0274.jpg'),
  vh0291: require('../assets/photos/cascadia/VH_STW_JUNE2018_0291.jpg'),
  vh0301: require('../assets/photos/cascadia/VH_STW_JUNE2018_0301.jpg'),
  vh0019: require('../assets/photos/cascadia/VH_STW_JUNE2018_0019.jpg'),
  vh0028: require('../assets/photos/cascadia/VH_STW_JUNE2018_0028.jpg'),
  vh0082: require('../assets/photos/cascadia/VH_STW_JUNE2018_0082.jpg'),
  vh0146: require('../assets/photos/cascadia/VH_STW_JUNE2018_0146.jpg'),
  vh0150: require('../assets/photos/cascadia/VH_STW_JUNE2018_0150.jpg'),
  vhFilm0008: require('../assets/photos/cascadia/VH_STW_FILM_JUNE2018_0008.jpg'),
  vhFilm0026: require('../assets/photos/cascadia/VH_STW_FILM_JUNE2018_0026.jpg'),
  vhFilm0048: require('../assets/photos/cascadia/VH_STW_FILM_JUNE2018_0048.jpg'),
  alayeawTrio: require('../assets/photos/IMG_7223-CROP.jpg'),
} as const;

const HEINS_2018 = 'Vanessa Heins, 2018';

function heinsStill(id: string, source: number): EraGalleryItem {
  return { id, kind: 'photo', source, credit: HEINS_2018 };
}

const F = {
  howe: '01 Howe Sounds',
  islands: '02 Islands Disappear',
  little: '03 Little Mountain',
  hawaiii: '04 hawaiii',
  alayeaw: '05 ALAYEAW',
  cascadia: '06 Cascadia',
  dandelion: '07 Dandelion',
  bsides: '08 B-Sides',
  vol2: '09 Volume 2',
} as const;

export const bundledCatalog: Catalog = {
  albums: [
    {
      id: 'howe-sounds',
      title: 'Howe Sounds / Taking Abalonia',
      short: 'Howe Sounds',
      year: '2008',
      released: '2008-06-03',
      releasedLabel: '3 June 2008',
      collection: 'studio',
      recordNo: '01',
      color: '#7C9C8F',
      dark: false,
      desc: 'Taking Abalonia folded into a double debut — salt-air folk songs written between the mountains and the sea.',
      era: {
        density: 'thin',
        hero: 'cover',
        tagline: '',
        essay: '',
        accent: archive.color.teal,
      },
      coverSource: covers.howeSounds,
      tracks: [
        t('this-citys-a-mess', "This City's A Mess", { duration: '3:00', streamTodo: numbered(F.howe, 1, "This City's A Mess") }),
        t('howe-sounds', 'Howe Sounds', { duration: '3:06', streamTodo: numbered(F.howe, 2, 'Howe Sounds') }),
        t('curse-of-the-currents', 'Curse Of The Currents', { duration: '5:12', streamTodo: numbered(F.howe, 3, 'Curse Of The Currents') }),
        t('the-light-is-you', 'The Light Is You', { duration: '1:38', streamTodo: numbered(F.howe, 4, 'The Light Is You') }),
        t('my-government-heart', 'My Government Heart', { duration: '3:59', streamTodo: numbered(F.howe, 5, 'My Government Heart') }),
        t('last-tree-standing', 'Last Tree Standing', { duration: '3:04', streamTodo: numbered(F.howe, 6, 'Last Tree Standing') }),
        t('the-real-of-it', 'The Real Of It', { duration: '1:40', streamTodo: numbered(F.howe, 7, 'The Real Of It') }),
        t('this-winter-i-retire', 'This Winter I Retire', { duration: '3:58', streamTodo: numbered(F.howe, 8, 'This Winter I Retire') }),
        t('live-off-the-lamb', 'Live Off The Lamb', { duration: '2:20', streamTodo: numbered(F.howe, 9, 'Live Off The Lamb') }),
        t('banks-of-the-english-bay', 'The Banks Of The English Bay', { duration: '1:59', streamTodo: numbered(F.howe, 10, 'The Banks Of The English Bay') }),
        t('better-for-you', 'Better For You', { duration: '1:55', streamTodo: numbered(F.howe, 11, 'Better For You') }),
        t('lady-hourglass', "Lady Hourglass, Your Heads on Fire", { duration: '2:26', streamTodo: numbered(F.howe, 12, "Lady Hourglass, Your Heads on Fire") }),
        t('fish-and-stars-ii', 'Fish And Stars II', { duration: '1:01', streamTodo: numbered(F.howe, 13, 'Fish And Stars II') }),
        t('plans-for-the-future', 'Plans For The Future', { duration: '3:52', streamTodo: numbered(F.howe, 14, 'Plans For The Future') }),
        t('taking-abalonia', 'Taking Abalonia', { duration: '3:53', streamTodo: numbered(F.howe, 15, 'Taking Abalonia') }),
      ],
      gallery: [],
    },
    {
      id: 'islands-disappear',
      title: 'Islands Disappear',
      short: 'Islands Disappear',
      year: '2009',
      released: '2009-10-13',
      releasedLabel: '13 October 2009',
      collection: 'studio',
      recordNo: '02',
      color: '#8FA8B4',
      dark: false,
      desc: 'A love letter to the west coast — ferries, emerald lakes, and the slow ache of leaving home.',
      era: {
        density: 'rich',
        hero: 'cover',
        tagline: '',
        essay: '',
        accent: archive.color.dustyBlue,
      },
      coverSource: covers.islandsDisappear,
      tracks: [
        t('dear-elkhorn', 'Dear Elkhorn', { duration: '1:29', streamTodo: numbered(F.islands, 1, 'Dear Elkhorn') }),
        t('out-on-the-shield', 'Out on the Shield', { duration: '2:56', streamTodo: numbered(F.islands, 2, 'Out on the Shield') }),
        t('bc-orienteering', 'B.C. Orienteering', { duration: '4:21', streamTodo: numbered(F.islands, 3, 'B.C. Orienteering') }),
        t('camilo', 'Camilo (The Magician)', { duration: '2:53', streamTodo: numbered(F.islands, 4, 'Camilo (The Magician)') }),
        t('emerald-lake-ab', 'Emerald Lake, AB', { duration: '2:36', streamTodo: numbered(F.islands, 5, 'Emerald Lake, AB') }),
        t('islands-disappear', 'Islands Disappear', { duration: '2:19', streamTodo: numbered(F.islands, 6, 'Islands Disappear') }),
        t('black-day-in-december', 'Black Day in December', { duration: '2:53', streamTodo: numbered(F.islands, 7, 'Black Day in December') }),
        t('gentleman', 'Gentleman', { duration: '2:19', streamTodo: numbered(F.islands, 8, 'Gentleman') }),
        t('false-creek-change', 'False Creek Change', { duration: '2:08', streamTodo: numbered(F.islands, 9, 'False Creek Change') }),
        t('a-cold-night', 'A Cold Night Close to the End', { duration: '3:02', streamTodo: numbered(F.islands, 10, 'A Cold Night Close to the End') }),
        t('gift-of-a-black-heart', 'The Gift of a Black Heart', { duration: '3:19', streamTodo: numbered(F.islands, 11, 'The Gift of a Black Heart') }),
        t('goodnight-moon', 'Goodnight Moon', { duration: '3:14', streamTodo: numbered(F.islands, 12, 'Goodnight Moon') }),
        t('holly-ontario', 'Holly, Ontario', { duration: '3:11', streamTodo: numbered(F.islands, 13, 'Holly, Ontario') }),
      ],
      gallery: [],
      videos: [
        {
          id: 'goodnight-moon-clip',
          title: 'Goodnight Moon',
          youtubeId: 'RfNn-hvHkWA',
          caption: 'Goodnight Moon.',
          streamTodo: 'TODO VIDEO: Islands Disappear VIP / Goodnight Moon clip (MP4)',
        },
      ],
    },
    {
      id: 'little-mountain',
      title: 'Little Mountain',
      short: 'Little Mountain',
      year: '2012',
      released: '2012-03-06',
      releasedLabel: '6 March 2012',
      collection: 'studio',
      recordNo: '03',
      color: '#C4614E',
      dark: true,
      desc: 'Named for the neighbourhood that raised it. Bigger rooms, brighter choruses, the same beating heart.',
      era: {
        density: 'thin',
        hero: 'cover',
        tagline: '',
        essay: '',
        accent: archive.color.red,
      },
      coverSource: covers.littleMountain,
      tracks: [
        t('we-are-1980', 'We Are 1980', { streamTodo: numbered(F.little, 1, 'We Are 1980') }),
        t('big-sky-mt', 'Big Sky, MT', { streamTodo: numbered(F.little, 2, 'Big Sky, MT') }),
        t('loveless', 'Loveless', { streamTodo: numbered(F.little, 3, 'Loveless') }),
        t('the-reason', 'The Reason', { streamTodo: numbered(F.little, 4, 'The Reason') }),
        t('o-alexandra', 'O Alexandra', { streamTodo: numbered(F.little, 5, 'O Alexandra') }),
        t('big-wave-goodbye', 'Big Wave Goodbye', { streamTodo: numbered(F.little, 6, 'Big Wave Goodbye') }),
        t('jesse-ar', 'Jesse, AR', { streamTodo: numbered(F.little, 7, 'Jesse, AR') }),
        t('lover-friend', 'Lover / Friend', { streamTodo: numbered(F.little, 8, 'Lover _ Friend') }),
        t('guilty-hypocrites', 'Guilty Hypocrites', { streamTodo: numbered(F.little, 9, 'Guilty Hypocrites') }),
        t('2010', '2010', { source: sourceOf('2010'), streamTodo: numbered(F.little, 10, '2010') }),
        t('heavy-ceiling', 'Heavy Ceiling', { streamTodo: numbered(F.little, 11, 'Heavy Ceiling') }),
        t('hurricane-ada', 'Hurricane Ada', { streamTodo: numbered(F.little, 12, 'Hurricane Ada') }),
        t('safe-harbour', 'Safe Harbour', { streamTodo: numbered(F.little, 13, 'Safe Harbour') }),
        t('lucky', 'Lucky', { source: sourceOf('lucky'), streamTodo: numbered(F.little, 14, 'Lucky') }),
        t('seasons', 'Seasons', { streamTodo: numbered(F.little, 15, 'Seasons') }),
        t('a-lesson-in-crime', 'A Lesson in Crime (Bonus Track)', { extra: true, streamTodo: numbered(F.little, 16, 'A Lesson in Crime (Bonus Track)') }),
      ],
      gallery: [],
    },
    {
      id: 'hawaiii',
      title: 'hawaiii',
      short: 'hawaiii',
      year: '2013',
      released: '2013-09-17',
      releasedLabel: '17 September 2013',
      collection: 'studio',
      recordNo: '04',
      color: '#D9A03F',
      dark: true,
      desc: 'Three i’s, one summer. Sun-bleached pop songs with sand still in their shoes.',
      era: {
        density: 'rich',
        hero: 'cover',
        tagline: '',
        essay: '',
        accent: archive.color.mustard,
      },
      coverSource: covers.hawaiii,
      tracks: [
        t('more-than-this', 'More Than This', { streamTodo: numbered(F.hawaiii, 1, 'More Than This') }),
        t('mother', 'Mother', { streamTodo: numbered(F.hawaiii, 2, 'Mother') }),
        t('narrows', 'Narrows', { streamTodo: numbered(F.hawaiii, 3, 'Narrows') }),
        t('i-love-you', 'I Love You', { source: sourceOf('i-love-you'), streamTodo: numbered(F.hawaiii, 4, 'I Love You') }),
        t('safe-to-say', 'Safe To Say', { streamTodo: numbered(F.hawaiii, 5, 'Safe To Say') }),
        t('resolutions', 'Resolutions', { streamTodo: numbered(F.hawaiii, 6, 'Resolutions') }),
        t('willow', 'Willow', { streamTodo: numbered(F.hawaiii, 7, 'Willow') }),
        t('on-the-ropes', 'On The Ropes', { streamTodo: numbered(F.hawaiii, 8, 'On The Ropes') }),
        t('i-could-smoke', 'I Could Smoke', { streamTodo: numbered(F.hawaiii, 9, 'I Could Smoke') }),
        t('oh-k-okay', 'Oh K, Okay', { streamTodo: numbered(F.hawaiii, 10, 'Oh K, Okay') }),
        t('helpless-son', 'Helpless Son', { streamTodo: numbered(F.hawaiii, 11, 'Helpless Son') }),
        t('weight-of-the-season', 'The Weight Of The Season', { streamTodo: numbered(F.hawaiii, 12, 'The Weight Of The Season') }),
      ],
      gallery: [],
    },
    {
      id: 'alayeaw',
      title: 'As Long As Your Eyes Are Wide',
      short: 'As Long As Your Eyes…',
      year: '2017',
      released: '2017-03-31',
      releasedLabel: '31 March 2017',
      collection: 'studio',
      recordNo: '05',
      color: '#A79A87',
      dark: false,
      desc: 'A record about staying open — grief and wonder held in the same two hands.',
      era: {
        density: 'thin',
        hero: 'cover',
        tagline: '',
        essay: '',
        accent: archive.color.warmGrey,
      },
      coverSource: covers.alayeaw,
      tracks: [
        t('step-into-the-darkness', 'Step Into The Darkness', { streamTodo: numbered(F.alayeaw, 1, 'Step Into The Darkness') }),
        t('more-than-ever', 'More Than Ever', { streamTodo: numbered(F.alayeaw, 2, 'More Than Ever') }),
        t('heaven', 'Heaven', { streamTodo: numbered(F.alayeaw, 3, 'Heaven') }),
        t('i-will-follow-you', 'I Will Follow You', { streamTodo: numbered(F.alayeaw, 4, 'I Will Follow You') }),
        t('realize-real-eyes', 'Realize Real Eyes', { streamTodo: numbered(F.alayeaw, 5, 'Realize Real Eyes') }),
        t('confidence', 'Confidence', { streamTodo: numbered(F.alayeaw, 6, 'Confidence') }),
        t('miscarriage', 'Miscarriage', { streamTodo: numbered(F.alayeaw, 7, 'Miscarriage') }),
        t('beautiful-morning', 'Beautiful Morning', { streamTodo: numbered(F.alayeaw, 8, 'Beautiful Morning') }),
        t('emily-rose', 'Emily Rose', { streamTodo: numbered(F.alayeaw, 9, 'Emily Rose') }),
        t('lilac-and-willow', 'Lilac and Willow', { streamTodo: numbered(F.alayeaw, 10, 'Lilac and Willow') }),
        t('confidence-acoustic', 'Confidence Acoustic', { extra: true, streamTodo: unnumbered(F.alayeaw, 'Confidence Acoustic') }),
        t('congratulations', 'Congratulations', { extra: true, streamTodo: unnumbered(F.alayeaw, 'Congratulations') }),
        t('fucks-to-give', 'Fucks To Give', { extra: true, streamTodo: unnumbered(F.alayeaw, 'Fucks To Give') }),
        t('lilac-acoustic', 'Lilac and Willow Acoustic', { extra: true, streamTodo: unnumbered(F.alayeaw, 'Lilac and Willow Acoustic') }),
        t('more-than-ever-acoustic', 'More Than Ever Acoustic', { extra: true, streamTodo: unnumbered(F.alayeaw, 'More Than Ever Acoustic') }),
        t('nothing-makes-me-happy', 'Nothing Makes Me Happy', { extra: true, streamTodo: unnumbered(F.alayeaw, 'Nothing Makes Me Happy') }),
        t('out-of-my-skin', 'Out Of My Skin', { extra: true, streamTodo: unnumbered(F.alayeaw, 'Out Of My Skin') }),
        t('realize-acoustic', 'Realize Real Eyes Acoustic', { extra: true, streamTodo: unnumbered(F.alayeaw, 'Realize Real Eyes Acoustic') }),
        t('realize-real-life', 'Realize Real Life', { extra: true, streamTodo: unnumbered(F.alayeaw, 'Realize Real Life') }),
        t('the-new-maybe', 'The New Maybe', { extra: true, streamTodo: unnumbered(F.alayeaw, 'The New Maybe') }),
      ],
      gallery: [
        {
          id: 'alayeaw-trio',
          kind: 'photo',
          source: photos.alayeawTrio,
          credit: '2017',
        },
      ],
    },
    {
      id: 'cascadia',
      title: 'Cascadia',
      short: 'Cascadia',
      year: '2019',
      released: '2019-02-08',
      releasedLabel: '8 February 2019',
      collection: 'studio',
      recordNo: '06',
      color: '#53707E',
      dark: true,
      desc: 'An atlas of the Pacific Northwest — rain on cedar, ferry horns, and songs for the long grey winter.',
      era: {
        density: 'gold',
        hero: 'cover',
        tagline: '',
        essay: '',
        credit: 'Vanessa Heins, 2018',
        accent: archive.color.deepBlue,
      },
      coverSource: covers.cascadia,
      tracks: [
        t('wake-up', 'Wake Up', { duration: '3:35', streamTodo: numbered(F.cascadia, 1, 'Wake Up') }),
        t('unamerican', 'UnAmerican', { duration: '3:01', streamTodo: numbered(F.cascadia, 2, 'UnAmerican') }),
        t('love-dont-ask', "Love Don't Ask", { duration: '3:14', streamTodo: numbered(F.cascadia, 3, "Love Don't Ask") }),
        t('cascadia', 'Cascadia', { duration: '3:40', streamTodo: numbered(F.cascadia, 4, 'Cascadia') }),
        t('shame', 'Shame', { duration: '3:24', streamTodo: numbered(F.cascadia, 5, 'Shame') }),
        t('old-soul-young-heart', 'Old Soul, Young Heart', { duration: '2:34', streamTodo: numbered(F.cascadia, 6, 'Old Soul, Young Heart') }),
        t('record-shop', 'Record Shop', { duration: '3:16', streamTodo: numbered(F.cascadia, 7, 'Record Shop') }),
        t('moonlight', 'Moonlight', { duration: '3:05', streamTodo: numbered(F.cascadia, 8, 'Moonlight') }),
        t('broken-man', 'Broken Man', { duration: '2:43', streamTodo: numbered(F.cascadia, 9, 'Broken Man') }),
        t('love-always', 'Love Always', { duration: '2:48', streamTodo: numbered(F.cascadia, 10, 'Love Always') }),
        t('level-best', 'Level Best', { duration: '3:36', streamTodo: numbered(F.cascadia, 11, 'Level Best') }),
        t('gambier-island-green', 'Gambier Island Green', { duration: '3:30', streamTodo: numbered(F.cascadia, 12, 'Gambier Island Green') }),
      ],
      gallery: [
        heinsStill('cascadia-0260', photos.vh0260),
        heinsStill('cascadia-0188', photos.vh0188),
        heinsStill('cascadia-film-0008', photos.vhFilm0008),
        heinsStill('cascadia-0019', photos.vh0019),
        heinsStill('cascadia-0146', photos.vh0146),
        heinsStill('cascadia-0082', photos.vh0082),
        heinsStill('cascadia-0301', photos.vh0301),
        heinsStill('cascadia-0240', photos.vh0240),
        heinsStill('cascadia-film-0026', photos.vhFilm0026),
        heinsStill('cascadia-0239', photos.vh0239),
        heinsStill('cascadia-0028', photos.vh0028),
        heinsStill('cascadia-0150', photos.vh0150),
        heinsStill('cascadia-0266', photos.vh0266),
        heinsStill('cascadia-0274', photos.vh0274),
        heinsStill('cascadia-0291', photos.vh0291),
        heinsStill('cascadia-film-0048', photos.vhFilm0048),
      ],
      videos: [
        {
          id: 'unamerican',
          title: 'UnAmerican',
          youtubeId: 'vYY0eZHvSGo',
          streamTodo: 'TODO VIDEO: /STW Photo & Video - Sterling & Zac/ UnAmerican',
        },
        {
          id: 'unamerican-popos',
          title: "UnAmerican — live at Popo's house",
          youtubeId: 'VxBYnRD62QM',
          streamTodo: 'TODO VIDEO: /STW Photo & Video - Sterling & Zac/Live Sessions/UnAmerican_1',
        },
        {
          id: 'unamerican-save-on-meats',
          title: 'UnAmerican — Save On Meats',
          youtubeId: 'A3MzGN-5I50',
          streamTodo: 'TODO VIDEO: /STW Photo & Video - Sterling & Zac/Save on Meats/Save on Meats_UnAmerican STW Live Clip .mp4',
        },
        {
          id: 'wake-up-malkin',
          title: 'Wake Up — Malkin Bowl',
          youtubeId: '2gjl_ved7VE',
          streamTodo: 'TODO VIDEO: /STW Photo & Video - Sterling & Zac/ Malkin Bowl / Stanley Park live sesh',
        },
        {
          id: 'record-shop-vignette',
          title: 'Record Shop',
          posterSource: photos.vh0146,
          streamTodo: 'TODO VIDEO: /STW Photo & Video - Sterling & Zac/Vignettes/Record Shop Vignette 002',
        },
        {
          id: 'love-always-vignette',
          title: 'Love Always',
          posterSource: photos.vh0188,
          streamTodo: 'TODO VIDEO: /STW Photo & Video - Sterling & Zac/Vignettes/Love Always - Beach - New Vignette',
        },
      ],
    },
    {
      id: 'dandelion',
      title: 'Dandelion',
      short: 'Dandelion',
      year: '2021',
      released: '2021-10-22',
      releasedLabel: '22 October 2021',
      collection: 'studio',
      recordNo: '07',
      color: '#EFDCA8',
      dark: true,
      desc: 'Written apart, stitched together. Small bright songs that grew up through the cracks of a strange year.',
      era: {
        density: 'rich',
        hero: 'cover',
        tagline: '',
        essay: '',
        accent: archive.color.paleYellow,
      },
      coverSource: covers.dandelion,
      tracks: [
        t('the-ocean', 'The Ocean', { streamTodo: unnumbered(F.dandelion, 'The Ocean') }),
        t('honey-lungs', 'Honey Lungs', { streamTodo: unnumbered(F.dandelion, 'Honey Lungs') }),
        t('everything-she-touches', 'Everything She Touches is Gold to Me', { streamTodo: unnumbered(F.dandelion, 'Everything She Touches is Gold to Me') }),
        t('sweetheart', 'Sweetheart', { streamTodo: unnumbered(F.dandelion, 'Sweetheart') }),
        t('show-me-everything', 'Show Me Everything', { streamTodo: unnumbered(F.dandelion, 'Show Me Everything') }),
        t('february-15th', 'February 15th', { streamTodo: unnumbered(F.dandelion, 'February 15th') }),
        t('99-to-the-moon', '99 to the Moon', { streamTodo: unnumbered(F.dandelion, '99 to the Moon') }),
        t('anything-for-you', 'Anything For You', { streamTodo: unnumbered(F.dandelion, 'Anything For You') }),
        t('dandelion', 'Dandelion', { streamTodo: unnumbered(F.dandelion, 'Dandelion') }),
        t('honey-lungs-remix', 'Honey Lungs (Illuminati Hotties Remix)', { extra: true, streamTodo: unnumbered(F.dandelion, 'Honey Lungs (Illuminati Hotties Remix)') }),
        t('return-to-me', 'Return to me', { extra: true, streamTodo: unnumbered(F.dandelion, 'Return to me') }),
        t('return-to-me-clean', 'Return to me (CLEAN)', { extra: true, streamTodo: unnumbered(F.dandelion, 'Return to me (CLEAN)') }),
      ],
      gallery: [],
      videos: [
        {
          id: 'honey-lungs',
          title: 'Honey Lungs (Official Video)',
          youtubeId: 'UnV6YMIIRCM',
          caption: 'Kindness as a way to approach difficult subjects.',
          streamTodo: 'TODO VIDEO: Dandelion / Honey Lungs MP4',
        },
        {
          id: '99-to-the-moon',
          title: '99 to the Moon',
          youtubeId: '-PzATU-_45U',
          caption: 'A decade of home movies — 1999 to the moon, or the 99 B-Line past city limits.',
          streamTodo: 'TODO VIDEO: Dandelion / 99 to the Moon MP4',
        },
      ],
    },
    {
      id: 'b-sides',
      title: 'B-Sides and Rarities',
      short: 'B-Sides & Rarities',
      year: '2022',
      released: '2022-11-25',
      releasedLabel: '25 November 2022',
      collection: 'studio',
      recordNo: '08',
      color: '#3D4F6F',
      dark: true,
      desc: 'Twenty-two outtakes, demos, and remixes — the rest of the songs.',
      era: {
        density: 'thin',
        hero: 'cover',
        tagline: '',
        essay: '',
        accent: '#3D4F6F',
      },
      coverSource: covers.bSides,
      tracks: [
        t('girls-night-out', 'Girls Night Out', { duration: '2:12', streamTodo: unnumbered(F.bsides, 'Girls Night Out_Said The Whale_{ISRC}') }),
        t('when-u-love-somebody', 'When U Love Somebody', { duration: '2:43', streamTodo: unnumbered(F.bsides, 'When U Love Somebody_Said The Whale_{ISRC}') }),
        t('its-only-a-song', "It's Only A Song", { duration: '2:57', streamTodo: unnumbered(F.bsides, "It's Only A Song_Said The Whale_{ISRC}") }),
        t('gentlemen-remix', 'Gentlemen Remix (feat. Shad)', { duration: '2:11', streamTodo: unnumbered(F.bsides, 'Gentlemen Remix (feat. Shad)_Said The Whale_{ISRC}') }),
        t('black-day-demo', 'Black Day in December (Catherine North Demo)', { duration: '2:49', streamTodo: unnumbered(F.bsides, 'Black Day in December (Catherine North Demo)_Said The Whale_{ISRC}') }),
        t('islands-acoustic', 'Islands Disappear (Acoustic Home Recording)', { duration: '2:13', streamTodo: unnumbered(F.bsides, 'Islands Disappear (Acoustic Home Recording)_Said The Whale_{ISRC}') }),
        t('pretty-city-demo', 'Pretty City (Original Demo)', { duration: '0:57', streamTodo: unnumbered(F.bsides, 'Pretty City (Original Demo)_Said The Whale_{ISRC}') }),
        t('isabella', 'Isabella', { duration: '1:50', streamTodo: unnumbered(F.bsides, 'Isabella_Said The Whale_{ISRC}') }),
        t('o-alexandra-demo', 'O Alexandra (Original Demo)', { duration: '1:21', streamTodo: unnumbered(F.bsides, 'O Alexandra (Original Demo)_Said The Whale_{ISRC}') }),
        t('deep-blue', 'Deep Blue', { duration: '0:24', streamTodo: unnumbered(F.bsides, 'Deep Blue_Said The Whale_{ISRC}') }),
        t('colin-please', 'Colin, Please', { duration: '3:01', streamTodo: unnumbered(F.bsides, 'Colin, Please_Said The Whale_{ISRC}') }),
        t('brother-cousin-kin', 'Brother, Cousin, Kin', { duration: '3:56', streamTodo: unnumbered(F.bsides, 'Brother, Cousin, Kin_Said The Whale_{ISRC}') }),
        t('big-sky-demo', 'Big Sky, MT (Original Demo)', { duration: '0:58', streamTodo: unnumbered(F.bsides, 'Big Sky, MT (Original Demo)_Said The Whale_{ISRC}') }),
        t('pretty-songs', 'Pretty Songs', { duration: '2:14', streamTodo: unnumbered(F.bsides, 'Pretty Songs_Said The Whale_{ISRC}') }),
        t('crow-time-serenade', 'Crow Time Serenade', { duration: '2:47', streamTodo: unnumbered(F.bsides, 'Crow Time Serenade_Said The Whale_{ISRC}') }),
        t('safe-to-say-live', 'Safe To Say (Live in Studio)', { duration: '3:19', streamTodo: unnumbered(F.bsides, 'Safe To Say (Live in Studio)_Said The Whale_{ISRC}') }),
        t('on-the-ropes-remix', 'On the Ropes (Remix)', { duration: '3:51', streamTodo: unnumbered(F.bsides, 'On the Ropes (Remix)_Said The Whale_{ISRC}') }),
        t('resolutions-remix', 'Resolutions (Remix)', { duration: '3:33', streamTodo: unnumbered(F.bsides, 'Resolutions (Remix)_Said The Whale_{ISRC}') }),
        t('lucky-stint', 'Lucky (STINT Remix)', { duration: '4:46', streamTodo: unnumbered(F.bsides, 'Lucky (STINT Remix)_Said The Whale_{ISRC}') }),
        t('i-love-you-demo', 'I Love You (Original Demo)', { duration: '2:42', streamTodo: unnumbered(F.bsides, 'I Love You (Original Demo)_Said The Whale_{ISRC}') }),
        t('part-of-your-team', 'Part of Your Team', { duration: '2:05', streamTodo: unnumbered(F.bsides, 'Part of Your Team_Said The Whale_{ISRC}') }),
        t('seasons-spencer', "Seasons (Spencer's Home Recording)", { duration: '1:50', streamTodo: unnumbered(F.bsides, "Seasons (Spencer's Home Recording)_Said The Whale_{ISRC}") }),
      ],
      gallery: [],
    },
    {
      id: 'b-sides-vol-2',
      title: 'B-Sides + Rarities, Volume 2',
      short: 'Volume 2',
      year: 'Vol. 2',
      releasedLabel: 'Follow-up compilation',
      collection: 'studio',
      recordNo: '09',
      color: '#46372B',
      dark: true,
      desc: 'Twelve more from the vault.',
      era: {
        density: 'thin',
        hero: 'designed',
        tagline: '',
        essay: '',
        accent: archive.color.ink,
      },
      artMode: 'volume2',
      wordmark: 'VOLUME TWO',
      tracks: [
        t('father', 'Father', { streamTodo: numbered(F.vol2, 1, 'Father') }),
        t('fourth-of-july', 'Fourth of July', { streamTodo: numbered(F.vol2, 2, 'Fourth of July') }),
        t('barbara-ann-vol2', 'Barbara-Ann', { streamTodo: numbered(F.vol2, 3, 'Barbara-Ann') }),
        t('sandy-bay-fishing-song', 'Sandy Bay Fishing Song', { streamTodo: numbered(F.vol2, 4, 'Sandy Bay Fishing Song') }),
        t('hollywood-forever', 'Hollywood Forever Cemetery Sings (Live in Studio)', { streamTodo: numbered(F.vol2, 5, 'Hollywood Forever Cemetery Sings (Live in Studio)') }),
        t('her-hair', 'Her Hair', { streamTodo: numbered(F.vol2, 6, 'Her Hair') }),
        t('isabella-studio-demo', 'Isabella (Studio Demo)', { streamTodo: numbered(F.vol2, 7, 'Isabella (Studio Demo)') }),
        t('go-speed-racer-go', 'Go Speed Racer Go', { streamTodo: numbered(F.vol2, 8, 'Go Speed Racer Go') }),
        t('safe-to-say-remix', 'Safe To Say (Remix)', { streamTodo: numbered(F.vol2, 9, 'Safe To Say (Remix)') }),
        t('o-alexanda', 'O Alexanda (More Beautiful than Abalone)', { streamTodo: numbered(F.vol2, 10, 'O Alexanda (More Beautiful than Abalone)') }),
        t('resolutions-live', 'Resolutions (Live in Studio)', { streamTodo: numbered(F.vol2, 11, 'Resolutions (Live in Studio)') }),
        t('little-bird', 'Little Bird', { streamTodo: numbered(F.vol2, 12, 'Little Bird') }),
      ],
      gallery: [],
    },
    {
      id: 'lets-have-sound',
      title: "Let's Have Sound",
      short: "Let's Have Sound",
      year: '2007',
      released: '2007-03-01',
      releasedLabel: 'March 2007',
      collection: 'ep',
      color: '#7C9C8F',
      dark: false,
      desc: 'The first EP — before Howe Sounds gathered the songs into a debut.',
      era: {
        density: 'thin',
        hero: 'designed',
        tagline: '',
        essay: '',
        accent: archive.color.teal,
      },
      artMode: 'wordmark',
      wordmark: "LET'S HAVE SOUND",
      tracks: [
        t('lhs-better-for-you', 'Better for You', { duration: '1:55', streamTodo: epPath("Let's Have Sound", 'Better for You') }),
        t('lhs-fish-and-stars-ii', 'Fish and Stars II', { duration: '1:00', streamTodo: epPath("Let's Have Sound", 'Fish and Stars II') }),
        t('lhs-last-tree-standing', 'Last Tree Standing', { duration: '3:04', streamTodo: epPath("Let's Have Sound", 'Last Tree Standing') }),
        t('lhs-not-a-thought', 'Not a Thought', { streamTodo: epPath("Let's Have Sound", 'Not a Thought') }),
        t('lhs-love-is-art', 'Love Is Art', { streamTodo: epPath("Let's Have Sound", 'Love Is Art') }),
        t('lhs-sleep-through-fire', 'Sleep Through Fire', { streamTodo: epPath("Let's Have Sound", 'Sleep Through Fire') }),
        t('lhs-this-citys-a-mess', "This City's a Mess", { duration: '2:59', streamTodo: epPath("Let's Have Sound", "This City's a Mess") }),
      ],
      gallery: [],
    },
    {
      id: 'the-magician',
      title: 'The Magician',
      short: 'The Magician',
      year: '2009',
      released: '2009-07-01',
      releasedLabel: 'July 2009',
      collection: 'ep',
      color: '#8FA8B4',
      dark: false,
      desc: 'Artwork, but no official audio in this collection.',
      era: {
        density: 'thin',
        hero: 'cover',
        tagline: '',
        essay: '',
        accent: archive.color.dustyBlue,
      },
      coverSource: covers.theMagician,
      tracks: [
        t('magician-camilo', 'Camilo (The Magician)', { unplayable: 'On Islands Disappear. No Magician-EP master in this catalog.' }),
        t('magician-love-is-art', 'Love is Art / Sleep Through Fire', { unplayable: 'No official audio for this EP in the discography drop.' }),
      ],
      gallery: [],
    },
    {
      id: 'bear-bones',
      title: 'Bear Bones',
      short: 'Bear Bones',
      year: '2010',
      released: '2010-02-01',
      releasedLabel: 'February 2010',
      collection: 'ep',
      color: '#B98B6E',
      dark: true,
      desc: 'Five short songs between Islands and Little Mountain.',
      era: {
        density: 'thin',
        hero: 'cover',
        tagline: '',
        essay: '',
        accent: archive.color.softBrown,
      },
      coverSource: covers.bearBones,
      tracks: [
        t('pretty-city', 'Pretty City', { duration: '0:59', streamTodo: epPath('Bear Bones', 'Pretty City') }),
        t('a-song-for-me', 'A Song for Me', { duration: '2:20', streamTodo: epPath('Bear Bones', 'A Song for Me') }),
        t('strong-swimmers', 'Strong Swimmers', { duration: '2:43', streamTodo: epPath('Bear Bones', 'Strong Swimmers') }),
        t('the-fish-and-the-stars', 'The Fish and the Stars', { duration: '2:02', streamTodo: epPath('Bear Bones', 'The Fish and the Stars') }),
        t('bb-emerald-lake', 'Emerald Lake, AB', { duration: '3:09', streamTodo: epPath('Bear Bones', 'Emerald Lake, AB') }),
      ],
      gallery: [],
    },
    {
      id: 'new-brighton',
      title: 'New Brighton',
      short: 'New Brighton',
      year: '2011',
      released: '2011-11-08',
      releasedLabel: '8 November 2011',
      collection: 'ep',
      color: '#53707E',
      dark: true,
      desc: 'Four songs on the way to Little Mountain.',
      era: {
        density: 'thin',
        hero: 'cover',
        tagline: '',
        essay: '',
        accent: archive.color.deepBlue,
      },
      coverSource: covers.newBrighton,
      tracks: [
        t('nb-new-brighton', 'New Brighton', { duration: '3:14', streamTodo: epPath('New Brighton', 'New Brighton') }),
        t('nb-sandy-bay', 'Sandy Bay Fishing Song', { duration: '4:05', streamTodo: epPath('New Brighton', 'Sandy Bay Fishing Song') }),
        t('nb-lines', 'Lines', { duration: '3:56', streamTodo: epPath('New Brighton', 'Lines') }),
        t('nb-little-bird', 'Little Bird', { duration: '3:33', streamTodo: epPath('New Brighton', 'Little Bird') }),
      ],
      gallery: [],
    },
    {
      id: 'i-love-you-ep',
      title: 'I Love You',
      short: 'I Love You EP',
      year: '2013',
      released: '2013-06-06',
      releasedLabel: '6 June 2013',
      collection: 'ep',
      color: '#D9A03F',
      dark: true,
      desc: 'I Love You, Mother, and Barbara-Ann — a small 2013 collection.',
      era: {
        density: 'thin',
        hero: 'cover',
        tagline: '',
        essay: '',
        accent: archive.color.mustard,
      },
      coverSource: covers.iLoveYouEp,
      tracks: [
        t('ily-ep-i-love-you', 'I Love You', { duration: '2:48', source: sourceOf('i-love-you'), streamTodo: epPath('I Love You', 'I Love You') }),
        t('ily-ep-barbara-ann', 'Barbara-Ann', { duration: '3:10', streamTodo: `TODO STREAM: ${EPS_ROOT}/I Love You/Barbara-Ann.m4a` }),
        t('ily-ep-mother', 'Mother', { duration: '3:11', streamTodo: epPath('I Love You', 'Mother') }),
      ],
      gallery: [],
    },
    {
      id: 'west-coast-christmas',
      title: 'West Coast Christmas',
      short: 'West Coast Christmas',
      year: '2007–2011',
      releasedLabel: '2007–2011 collection',
      collection: 'ep',
      color: '#C4614E',
      dark: true,
      desc: 'Every December EP, gathered in chronological order.',
      era: {
        density: 'thin',
        hero: 'cover',
        tagline: '',
        essay: '',
        accent: archive.color.red,
      },
      coverSource: covers.westCoastChristmas,
      tracks: [
        t('wcc-bones-of-winter', 'The Bones of Winter (2007)', { duration: '1:54', streamTodo: epPath('West Coast Christmas collection', 'The Bones of Winter') }),
        t('wcc-christmas-under-the-clouds', 'Christmas Under The Clouds (2007)', { duration: '5:40', streamTodo: epPath('West Coast Christmas collection', 'Christmas Under The Clouds') }),
        t('wcc-puddleglum', 'Puddleglum (2008)', { duration: '4:12', streamTodo: epPath('West Coast Christmas collection', 'Puddleglum') }),
        t('wcc-wanting-like-veruca', 'Wanting Like Veruca (2009)', { duration: '4:06', streamTodo: epPath('West Coast Christmas collection', 'Wanting Like Veruca') }),
        t('wcc-weight-of-the-season', 'Weight of the Season (2009)', { duration: '2:36', streamTodo: epPath('West Coast Christmas collection', 'Weight of the Season') }),
        t('wcc-brightest-on-my-street', 'Brightest On My Street (2010)', { duration: '1:51', streamTodo: epPath('West Coast Christmas collection', 'Brightest On My Street') }),
        t('wcc-24-days', '24 Days of Xmas (2010)', { duration: '1:02', streamTodo: epPath('West Coast Christmas collection', '24 Days of Xmas') }),
        t('wcc-joy-and-love', 'Joy and Love (2011)', { duration: '2:21', streamTodo: epPath('West Coast Christmas collection', 'Joy and Love') }),
        t('wcc-smoke-signals', 'Smoke Signals (2011)', { duration: '2:50', streamTodo: epPath('West Coast Christmas collection', 'Smoke Signals') }),
        t('wcc-hope-and-peace', 'Hope and Peace (2011)', { duration: '2:32', streamTodo: epPath('West Coast Christmas collection', 'Hope and Peace') }),
        t('wcc-summertime-in-australia', 'Summertime in Australia', { duration: '1:22', streamTodo: epPath('West Coast Christmas collection', 'Summertime in Australia') }),
      ],
      gallery: [],
    },
    {
      id: 'remixed',
      title: 'Remixed',
      short: 'Remixed',
      year: '2014',
      released: '2014-04-22',
      releasedLabel: '22 April 2014',
      collection: 'ep',
      color: '#D9A03F',
      dark: true,
      desc: 'Four hawaiii-era remixes.',
      era: {
        density: 'thin',
        hero: 'designed',
        tagline: '',
        essay: '',
        accent: archive.color.mustard,
      },
      artMode: 'wordmark',
      wordmark: 'REMIXED',
      tracks: [
        t('rmx-on-the-ropes', 'On the Ropes', { duration: '3:55', streamTodo: epPath('Remixed', 'On the Ropes') }),
        t('rmx-resolutions', 'Resolutions', { duration: '3:34', streamTodo: epPath('Remixed', 'Resolutions') }),
        t('rmx-safe-to-say', 'Safe to Say', { duration: '3:33', streamTodo: epPath('Remixed', 'Safe to Say') }),
        t('rmx-i-love-you', 'I Love You', { duration: '4:11', source: sourceOf('i-love-you'), streamTodo: epPath('Remixed', 'I Love You') }),
      ],
      gallery: [],
    },
  ],
};

export function studioAlbums(catalog: Catalog): CatalogAlbum[] {
  return catalog.albums.filter((a) => a.collection === 'studio');
}

export function appendixAlbums(catalog: Catalog): CatalogAlbum[] {
  return catalog.albums.filter((a) => a.collection === 'ep');
}

export function findAlbum(catalog: Catalog, id: string): CatalogAlbum | undefined {
  return catalog.albums.find((a) => a.id === id);
}

export function playableTracks(catalog: Catalog): { album: CatalogAlbum; track: CatalogTrack }[] {
  const out: { album: CatalogAlbum; track: CatalogTrack }[] = [];
  for (const album of catalog.albums) {
    for (const track of album.tracks) {
      if (track.unplayable) continue;
      if (track.source != null || track.uri) out.push({ album, track });
    }
  }
  return out;
}

export function trackHasAudio(track: CatalogTrack): boolean {
  return !track.unplayable && (track.source != null || Boolean(track.uri));
}

export function initialsOf(album: CatalogAlbum): string {
  const words = album.short.replace(/[^A-Za-z0-9 ]/g, '').trim().split(/\s+/);
  const raw = words.length >= 2 ? words[0][0] + words[1][0] : album.short.replace(/[^A-Za-z]/g, '').slice(0, 2);
  return (raw || 'ST').toUpperCase();
}

export function artInk(album: CatalogAlbum) {
  return {
    line: album.dark ? 'rgba(255,255,255,0.32)' : 'rgba(70,55,43,0.38)',
    ink: album.dark ? 'rgba(251,246,234,0.94)' : archive.color.ink,
  };
}

/** Overlay remote catalog.json fields onto the bundled era worlds. */
export function mergeCatalog(remote: Catalog, bundled: Catalog = bundledCatalog): Catalog {
  const byId = new Map(bundled.albums.map((a) => [a.id, a]));
  const albums = bundled.albums.map((base) => {
    const over = remote.albums.find((a) => a.id === base.id);
    if (!over) return base;
    return {
      ...base,
      ...over,
      era: { ...base.era, ...(over.era ?? {}) },
      coverSource: base.coverSource,
      gallery: over.gallery?.length ? over.gallery.map((g, i) => ({ ...base.gallery[i], ...g, source: base.gallery[i]?.source ?? g.source })) : base.gallery,
      videos: over.videos ?? base.videos,
      tracks: base.tracks.map((bt) => {
        const rt = over.tracks.find((t) => t.id === bt.id);
        if (!rt) return bt;
        return { ...bt, ...rt, source: bt.source ?? rt.source };
      }),
    };
  });
  for (const extra of remote.albums) {
    if (!byId.has(extra.id)) albums.push(extra);
  }
  return { albums };
}
