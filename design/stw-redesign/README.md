# Handoff: Said The Whale App Redesign

## Overview
A ground-up redesign of the Said The Whale fan app: a calm, Wes Anderson-inspired "boutique band archive" for browsing every album, listening in-app, chatting with other fans, checking tour dates, and reading band news. Four-tab bottom navigation: Albums, Chat, Tour, News.

## About the Design Files
The files in this bundle are **design references created in HTML** — interactive prototypes showing intended look and behavior, NOT production code to copy directly. The task is to **recreate these designs in the target codebase's existing environment** (React Native, Swift/SwiftUI, Flutter, React, etc.) using its established patterns and libraries. If no app codebase exists yet, choose the most appropriate mobile framework and implement the designs there.

The main design file is `Said The Whale App.dc.html` (a self-running HTML prototype — open in a browser to explore every screen). `Design System.dc.html` is a one-page visual reference of colors, type, and components. The `uploads/` folder holds the band-photo archive used as rotating page backgrounds.

## Fidelity
**High-fidelity.** Colors, typography, spacing, and interactions are final intent. Recreate pixel-perfectly, substituting licensed fonts as noted below.

## Design Language
- Warm cream + ink Wes Anderson palette; symmetrical, centered compositions; generous whitespace.
- Every main tab has a full-bleed **band photo background** (random from the archive) under a warm dark scrim, with an "Apple glass" (blurred translucent) treatment for content that needs contrast.
- Detail pages (Album detail, News article, Player) are flat cream "museum card" pages — no photo.
- One faded-red accent action per screen, pill-shaped. Square corners on cream surfaces; rounded corners (12–18px) only on photo pages and artwork.

## Design Tokens
Colors:
- Cream (bg): #F3ECDD · Paper: #FBF6EA · Ink: #46372B · Body text: #55473A / #6E5F50
- Hairline border: #DCCFB6 (cream pages) / rgba(255,255,255,0.2) (photo pages)
- Faded red (primary action): #C4614E (hover #A94F3E)
- Dusty blue: #8FA8B4 · Deep blue: #53707E · Mustard: #D9A03F · Muted teal: #7C9C8F
- Pale yellow: #EFDCA8 · Warm grey: #A79A87 · Soft brown: #B98B6E
- Photo-page text: #F7F1E3 (full) / rgba(247,241,227,0.6–0.9) (secondary), always with text-shadow 0 1px 8–14px rgba(0,0,0,0.45–0.65)
- Photo scrim: linear-gradient(180deg, rgba(35,26,18,0.66), rgba(35,26,18,0.34) ~30%, rgba(35,26,18,0.5) 100%)
- Glass: background rgba(35,26,18,0.42), backdrop-blur 16px, border 1px rgba(255,255,255,0.22)

Typography:
- Primary: **Futura** (prototype falls back to Google font "Jost"). Wordmark: 15px/600/5px letterspacing/uppercase. Page titles: 22–24px/500/1px. Eyebrows: 11px/4px letterspacing/uppercase. Body: 13–14px, line-height 1.55–1.75. Track/list meta: 10.5–12px.
- Accent: **Tilda** (licensed; prototype uses Google font "Courgette" as stand-in) — script captions like "a gentle place for fans", "fetching the archive…".

Spacing: page padding 22–28px; section gaps 14–28px; album grid gap 26px vertical / 40px horizontal with 26px side padding.
Radii: 999px pills (buttons, chips, inputs), 12–18px cards/art on photo pages, 50% circles. Cream-page cards square.
Shadows: artwork 0 8–12px 22–28px rgba(0,0,0,0.35); glass 0 4px 16px rgba(0,0,0,0.18); cream pages nearly shadow-free.

## Screens
1. **Albums (home)** — photo bg + scrim. Centered eyebrow "THE COMPLETE" + "Record Archive" title + short cream rule. 2-column grid of 8 album tiles (~75% former size, evenly spread): flat-color art block (14px radius, concentric record rings + album initials), cream title + year below with text-shadow. Photo refresh button (see Components). Loading state: cream page, spinning dashed ring, script caption "fetching the archive…", 4 pulsing placeholder tiles.
2. **Album detail** — cream museum-card page. "← ARCHIVE" back link + script "record no. NN". Centered 210px art with shadow, title, "YEAR · N TRACKS", red rule, 2-line description, red pill "▶ Play Album". Bordered track list: numbered rows, dotted-baseline layout (number / title / duration), current track highlighted (#F3E5D2 bg, red number, 600 weight). Tapping a row plays it.
3. **Player (full-screen overlay)** — cream. "↓ CLOSE" / "NOW PLAYING" header. 220px art, track title, "ALBUM · YEAR", scrubber (2px line, red progress + 10px red dot, tap to seek), elapsed/total times, controls row (prev ⏮ / 64px red circular play-pause / next ⏭), "Up Next" queue list (tap to jump). Playback simulated at 1s ticks; auto-advances at track end.
4. **Mini player** — persistent bar above bottom nav whenever a track is loaded (hidden on full player): 2px red progress line on top, 38px art thumb, title + album (ellipsized), circular outline play/pause. Tapping it opens the full player.
5. **Chat ("The Tide Pool")** — photo bg + scrim + refresh. Group-chat feed: 32px colored avatar circle with initials outside a **glass bubble** (rgba(35,26,18,0.42), blur 16px, radius 16px with 4px top-left corner) containing name + time + message. Reactions: up to 5 distinct emoji chips per message, each "emoji count" in a glass pill (own reaction = red-tinted rgba(196,97,78,0.6) + #E8A08F border); tap toggles. "+☺" dashed pill opens an 8-emoji picker (❤️ 🐋 🌊 🔥 😂 🥹 👏 🎸) in a dark glass pill. Glass composer bar: rounded input "write something kind…" + 42px deep-blue circular send (↑), Enter sends. Empty state: glass circle "◠", "All quiet in the pool", script caption.
6. **Tour ("On the Road / Tour Dates")** — photo bg + scrim + refresh. Minimal rows divided by rgba-white hairlines: 52px rounded colored date block (MMM / DD), city (cream 600) + venue (cream 70%), glass outline "TICKETS" pill (hover: cream fill, ink text). Script footer "see you out there ✳". Empty state: glass circle with mustard dot, "No shows on the horizon", script caption.
7. **News ("The Whale Gazette")** — photo bg + scrim + refresh. Editorial list with hairline dividers, centered: optional color image placeholder block (110px, 12px radius), pale-yellow date eyebrow, cream headline, preview, "READ →". 
8. **News article** — cream reading page: "← GAZETTE", red date eyebrow, headline, red rule, optional 150px image block, left-aligned body (14px/1.75, max-width 330px), script sign-off "— with love, the whales".

## Components
- **Bottom nav**: 4 tabs (Albums ◉, Chat ◠, Tour ◈, News ☰), 10px/2.5px-letterspaced uppercase labels, active = faded red + 4px dot, inactive warm grey. Never a fill or pill.
- **Photo refresh button** (all 4 photo pages, top-right, 42px circular glass): cream camera silhouette (rounded rect + top hump) with a bold ink ⟳ centered on the body. Tap = next photo in archive.
- **Photo rotation**: photos cycle from `uploads/` (13 photos); a new photo loads on first mount (random) and each time the user navigates to Albums from another tab; all photo pages share the current photo index.
- **Buttons**: primary red pill; outline pill (deep blue on cream, glass cream-outline on photo); text back-links (12px, 2px letterspacing, uppercase, deep blue).
- **Album art placeholder**: flat brand-color square, 1px inset frame (8–10px), two concentric circle rings, 2-letter initials. Replace with real album artwork in production.

## State Management
- tab ('albums'|'chat'|'tour'|'news'), view ('tab'|'album'|'player'|'article'), albumId, articleId
- Player: curAlbum, curTrack, playing, elapsed (1s interval), queue derived from current album
- Chat: messages[{name, time, text, reactions[{emoji, count, mine}]}], draft, pickerFor
- photoIdx (shared across photo pages), loading (albums, ~1.4s on first load)
- Empty states togglable via an emptyStates flag (demo).

## Data Notes
Album titles/years are the real discography (Howe Sounds/Taking Abalonia 2007 → Nothing Special 2023). **Track lists, durations, tour dates, news posts, and chat messages are placeholder content** — wire to real data.

## Assets
- `uploads/*.jpg` — 13 band photos provided by the band (photo background archive).
- Fonts: license Futura and Tilda for production; Jost + Courgette are web stand-ins only.

## Files
- `Said The Whale App.dc.html` — full interactive prototype (all screens; open in browser)
- `Design System.dc.html` — design-system reference sheet
- `uploads/` — photo archive

## Suggested GitHub issue
Title: "Rebuild app UI to match 'Boutique Archive' redesign (Wes Anderson direction)"
Body: link/attach this handoff bundle, state fidelity (hifi), list the 8 screens above as a checklist, and require: photo-background system with scrim + glass, shared photo rotation + refresh control, 4-tab nav, simulated→real audio player integration, group chat with emoji reactions (max 5 distinct per message).
