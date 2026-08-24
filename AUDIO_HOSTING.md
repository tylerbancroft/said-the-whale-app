# 🎧 Getting your music into the app (the one real-world step)

The app is built to **stream your full catalog from a file you control** called
`catalog.json`. Once that file (and your audio) is hosted somewhere, the app
shows your real catalog — and you can add songs any time by editing the file, with
**no App Store update**.

Right now the app ships with a **bundled fallback** (three real songs — *I Love You*,
*Lucky*, *2010* — plus complete era worlds for every studio album and EP) so it
works before any of this is set up. Stream URLs are marked `TODO STREAM` with the
Dropbox path of each MP3. Here's how to make playback real when you're ready.

## 1. Put your audio somewhere public-ish

Upload your song files (`.mp3` or `.m4a` — **stream MP3, not WAV**) to any web
storage that serves files over `https://`. Good, cheap options:

- **Cloudflare R2** or **Backblaze B2** (very cheap, no egress fees on R2)
- **Amazon S3**
- Even a plain web host / CDN

You'll get a URL for each song, like
`https://media.saidthewhale.com/islands-disappear/camilo.mp3`.

Dropbox layout the catalog already knows:

```
/Said The Whale - Discography/Studio Albums
  01 Howe Sounds … 09 Volume 2
/Said The Whale - Discography/EPs
```

Dandelion filenames have **no numbers** — keep the Exclaim/Bandcamp order.
B-Sides filenames are `{Title}_Said The Whale_{ISRC}.mp3`.

## 2. Write a `catalog.json`

Host one file. The app **overlays** it on the bundled era worlds (covers, photos,
essays, track titles stay in the app). You only need to fill in URLs:

```json
{
  "albums": [
    {
      "id": "cascadia",
      "tracks": [
        { "id": "unamerican", "uri": "https://media.saidthewhale.com/cascadia/unamerican.mp3" }
      ],
      "gallery": [
        { "id": "cascadia-heins", "uri": "https://media.saidthewhale.com/cascadia/heins-01.jpg" }
      ],
      "videos": [
        { "id": "unamerican", "uri": "https://media.saidthewhale.com/cascadia/unamerican.mp4" }
      ]
    }
  ]
}
```

Album `id` values: `howe-sounds`, `islands-disappear`, `little-mountain`,
`hawaiii`, `alayeaw`, `cascadia`, `dandelion`, `b-sides`, `b-sides-vol-2`,
and EPs `lets-have-sound`, `the-magician`, `bear-bones`, `new-brighton`,
`i-love-you-ep`, `west-coast-christmas`, `remixed`.

Track `id` values match `data/catalog.ts`. Optional fields: `lyrics`, `duration`
(`"3:14"`), `coverUri`.

## 3. Point the app at it (one line)

In `services/catalog.ts`, set:

```ts
export const CATALOG_URL = 'https://pub-5a1138113129492e9d6f4bd6de978215.r2.dev/catalog.json';
```

That's it. The app fetches your catalog on launch and streams everything. If the
URL is ever unreachable, it quietly falls back to the bundled copy so the app
never breaks.

## How a song URL is played

`catalog.json` sets `tracks[].uri` to an `https://` MP3 (or M4A). The player
hands that string to expo-audio like this:

```ts
player.replace({ uri: track.uri });
player.play();
```

If `uri` is missing, it plays the three bundled files via `player.replace(track.source)`.
Tracks with neither stay grey until you host them.

---

**A developer can do steps 1–3 in an afternoon** — or point me at the repo in a
future session and I'll wire it to whichever storage you pick.
