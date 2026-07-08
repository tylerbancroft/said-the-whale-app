# Said The Whale — Fan App 🐋

Your band's own clubhouse: native music streaming, a fan community (**the Pod**),
a members-only journal, and tour dates — in one app you own, instead of renting
Spotify + Patreon + Discord.

Built with **Expo / React Native** (one codebase → iPhone, Android, and web).

---

## 👋 Read this first (Tyler)

You're non-technical, so here's the honest state of things in plain English.

**What's real and working right now:**

- ✅ A genuine, running app with **5 screens**: Home, Listen, Pod (community), Journal, Shows.
- ✅ **One-time access code** unlock. A fan types a code once; the app remembers
  them forever and never asks again. (Try the code **`WHALE`**.)
- ✅ **Real native music playback** — your three songs (*I Love You*, *Lucky*,
  *2010*) stream **inside the app**, with a persistent Spotify-style player bar.
  No links out to other platforms.
- ✅ **Full-catalog browsing** — the Listen tab lists your albums, opens each to a
  track list, and streams any song. It's already wired to load your catalog from
  a file you host (see **`AUDIO_HOSTING.md`**); empty albums show a "your masters
  go here" state so it's obvious what to upload.
- ✅ It's **100% separate from Circles** and lives only in this repo.

**What's still a mock-up (looks real, not wired to a server yet):**

- ⏳ The **community chat** shows messages but isn't live yet (needs a server).
- ⏳ **Access codes** accept anything sensible for now (needs a server to check
  real codes against your Patreon list).
- ⏳ Tour dates, journal posts, and the album catalog are **placeholder content**.

Think of this as a beautiful, working **skeleton** — the shape and feel are all
here and real; the next phase is connecting it to a backend so the content is
live and yours to update. See **[Roadmap](#-roadmap)** below.

---

## ▶️ See it running (no Mac needed)

The fastest way to look at it is in a web browser:

```bash
npm install        # first time only
npx expo start --web
```

Then open the URL it prints (usually http://localhost:8081). You'll land on the
welcome screen — type **`WHALE`** to get in.

To run it on your actual iPhone, install the free **Expo Go** app from the App
Store, run `npx expo start`, and scan the QR code.

---

## 🗺 Roadmap — how this becomes the real thing

Rough order, easiest → hardest. The ⭐ items are the bigger lifts.

1. **Content you control (easy win).** A simple dashboard where you post tour
   dates, journal entries, and your catalog — so the app stops showing
   placeholders. No code, no App Store update needed to publish.
2. **Native streaming for your whole catalog ⭐.** The streaming *machinery is
   already built* — album browsing, track lists, and play-by-URL all work. What's
   left is hosting your audio + a `catalog.json` and setting one URL. Step-by-step
   in **`AUDIO_HOSTING.md`**. Because it's *your* music, there are **no licensing
   deals** to negotiate (the thing that makes a Spotify hard).
3. **Access codes, for real.** A small server that checks a code against your
   list of Patreon supporters and unlocks the app — you'd generate a batch of
   codes and hand them out. (Redeem once, remembered forever — already built on
   the app side.)
4. **The Pod (community) ⭐.** Real-time fan chat + posting, with light
   moderation tools. This is the Discord replacement and the biggest single
   piece.
5. **Push notifications.** Buzz fans' phones when you drop a song or announce a
   show.
6. **Ship to the App Store.** Expo's cloud build service (**EAS Build**)
   compiles the iPhone app on their Macs — you never need a Mac — and hands you
   the file that goes to TestFlight / App Store Connect (the part you already
   know). Command, for later: `eas build --platform ios`.

**A note on memberships:** we intentionally chose **not** to sell memberships
inside the app. Fans stay subscribed on Patreon and redeem an access code — so
nobody has to re-enter a credit card (which risks them cancelling), and Apple
doesn't take a 15–30% cut. The app just says "enter your code," never "go
subscribe elsewhere," which keeps it within Apple's rules.

---

## 🧱 How the project is organized

```
app/
  _layout.tsx          # Providers + the "locked → onboarding" gate
  onboarding.tsx       # One-time access-code screen
  (tabs)/
    _layout.tsx        # Bottom tab bar + docked mini-player
    index.tsx          # Home
    listen.tsx         # Listen (native player + your 3 real songs)
    pod.tsx            # Community (the Pod)
    journal.tsx        # Journal / blog
    shows.tsx          # Tour dates
components/
  ui.tsx               # Shared building blocks (buttons, cards, tags…)
  MiniPlayer.tsx       # The persistent player bar
context/
  AuthContext.tsx      # Access-code unlock + "remember me" (AsyncStorage)
  PlayerContext.tsx    # The audio engine (expo-audio) + now-playing state
data/
  mock.ts              # Placeholder albums, shows, posts, messages
  tracks.ts            # Your 3 real songs (bundled for the streaming demo)
theme/
  tokens.ts            # Colors, spacing, type — the "deep water" look
assets/audio/          # The bundled song files
```

**Where a developer plugs in the backend later:** `AuthContext.redeem()` (code
checking) and `PlayerContext.play()` (streaming) are the two seams — each has a
comment marking exactly where the real API call goes.

---

## 🎨 Design

A single "deep water" dark theme: deep-teal background, warm-sand text, a
west-coast-sunset coral accent, and seafoam highlights — a Said The Whale
palette rather than a generic Spotify clone. Editorial serif for headlines,
system sans for everything else.

---

_Placeholder content note: album titles are real Said The Whale records; tour
dates, journal posts, chat messages, and streaming links are stand-ins to show
layout, and get replaced by real data in the roadmap above._
