# 🎧 Getting your music into the app (the one real-world step)

The app is built to **stream your full catalog from a file you control** called
`catalog.json`. Once that file (and your audio) is hosted somewhere, the app
shows your real catalog — and you can add songs any time by editing the file, with
**no App Store update**.

Right now the app ships with a small **bundled fallback** (three real songs +
empty album shells) so it works before any of this is set up. Here's how to make
it real when you're ready. None of this needs to happen for the app to run — it's
the "fill it with your music" step.

## 1. Put your audio somewhere public-ish

Upload your song files (`.mp3` or `.m4a`) to any web storage that serves files
over `https://`. Good, cheap options:

- **Cloudflare R2** or **Backblaze B2** (very cheap, no egress fees on R2)
- **Amazon S3**
- Even a plain web host / CDN

You'll get a URL for each song, like
`https://media.saidthewhale.com/islands-disappear/i-love-you.mp3`.

## 2. Write a `catalog.json`

Make one file describing your catalog and host it at the same place. Format:

```json
{
  "albums": [
    {
      "id": "islands-disappear",
      "title": "Islands Disappear",
      "year": 2009,
      "gradient": ["#5B6BD6", "#2A2350"],
      "tracks": [
        { "id": "i-love-you", "title": "I Love You", "uri": "https://media.saidthewhale.com/islands/i-love-you.mp3" },
        { "id": "lucky",      "title": "Lucky",      "uri": "https://media.saidthewhale.com/islands/lucky.mp3" }
      ]
    }
  ]
}
```

- `uri` is the streaming URL from step 1.
- `gradient` is the two colors of the album's art tile (any hex pair).
- Add `"membersOnly": true` to a track to mark it Pod-only.

## 3. Point the app at it (one line)

In `services/catalog.ts`, set:

```ts
export const CATALOG_URL = 'https://media.saidthewhale.com/catalog.json';
```

That's it. The app fetches your catalog on launch and streams everything. If the
URL is ever unreachable, it quietly falls back to the bundled copy so the app
never breaks.

---

**A developer can do steps 1–3 in an afternoon** — or point me at the repo in a
future session and I'll wire it to whichever storage you pick.
