# A Romantic Letter 💌

A premium, cinematic, interactive romantic letter — locked with a passcode,
opened by a garden that blooms out of an envelope, and told through scratch-off
photos, two handwritten letters, a voice note, a music player, an "our story"
timeline, "open when…" envelopes, a reasons deck, a memory map and a final
question.

All the personal words in this repo are **placeholder sample text**, and there
are **no photos, voice notes, music, or secrets committed**. It's a blank
template — drop in your own words and media, then deploy.

---

## 1. Install & run locally

You need **[Node.js](https://nodejs.org) 18.18+** (20+ recommended) and git.

```bash
git clone <your-repo-url>
cd romantic-letter

npm install        # install dependencies
npm run dev        # dev server at http://localhost:3000
```

> **Windows PowerShell:** if `npm` misbehaves, use `npm.cmd` (e.g. `npm.cmd install`).

Other commands:

```bash
npm run build      # production build
npm start          # serve the production build
```

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS ·
Framer Motion. Ambient sound is procedural (Web Audio API), so it works even
with no audio files.

---

## 2. Make it yours

Everything human-facing lives in a few files. Edit these:

| What | File |
|------|------|
| Passcode, all letters, notes, reasons, countdown, final question | [`lib/content.ts`](lib/content.ts) |
| "Our Story" timeline chapters | [`lib/story.ts`](lib/story.ts) |
| Photo gallery captions & order | [`lib/gallery.ts`](lib/gallery.ts) |

### The passcode 🔑

Default is **`1121`**. Change `lockCode` in `lib/content.ts` to a date or number
that means something (e.g. `"21102025"`).

### Your photos 🖼️

Drop images into **`public/pics/`** named `img1.jpg`, `img2.jpg`, … Then point
each gallery entry's `src` at them in `lib/gallery.ts` (and the memory-map pins in
`lib/content.ts`). `.jpg` and `.png` both work.

### Your music 🎵

Drop MP3s into **`public/music/`** (see [`public/music/README.txt`](public/music/README.txt))
and update `music` / `playlist` in `lib/content.ts` with the filenames, titles
and artists.

### Your voice note 🎙️

Record a short clip, save it as **`public/voice/note.mp3`**. Update the `voice`
block in `lib/content.ts` if you rename it.

> These media folders are **gitignored** — your photos, voice note and music
> stay on your machine and are **never pushed**. That's intentional. Anyone who
> clones the repo gets the empty template, not your private moments.

---

## 3. Deploy on Vercel ▲

Vercel hosts Next.js for free.

**Note:** because photos/music/voice are gitignored, they won't be in your git
repo — so a plain Git-based Vercel deploy would ship **without** your media. Pick
one:

### Option A — deploy from your machine (keeps your media, recommended)

Your local media files get uploaded directly, so nothing personal has to live in
GitHub.

```bash
npm i -g vercel        # install the Vercel CLI once
vercel login
vercel                 # first run: answer the prompts to link a project
vercel --prod          # deploy to production, uploads your local /public too
```

### Option B — deploy from GitHub (no media, or add media privately)

1. Push this repo to GitHub (see below).
2. On [vercel.com](https://vercel.com) → **Add New → Project** → import the repo.
3. Framework preset auto-detects **Next.js**. No build settings to change.
4. Click **Deploy**.

Since photos aren't in the repo, either use Option A instead, **or** make the
GitHub repo **private** and remove the `/public/pics`, `/public/voice`,
`/public/music/*.mp3` lines from `.gitignore` so your media commits too.

### Environment variables

This project needs **none** to run. If you add any (e.g. an email service for the
reply box), set them in **Vercel → Project → Settings → Environment Variables**.
Never commit a `.env` file — `.env*` is gitignored here on purpose.

---

## 4. Push to GitHub

```bash
git add -A
git commit -m "Make it mine"
git push
```

Your real letters are backed up locally in `personal-content-backup/` (gitignored)
if you scrubbed them — copy those files back over `lib/` to restore your own
words at any time.

---

## The experience (flow)

1. **Lock screen** — torn-paper card on a pressed-flower wallpaper. Enter the code.
2. **Flower portal** — tap the letter; watercolour flowers spiral out, fill the
   screen, then fall away like gravity.
3. **Vintage envelope** — tap to open; the flap lifts and the letter rises.
4. **The journey** — opening note → scratch-to-reveal photo gallery → the big
   final letter with music player and voice note → "our story" timeline →
   "open when…" envelopes → reasons deck → memory map → final question → outro.

Petals drift, sparkles shimmer, nothing is ever perfectly still.

## Accessibility & performance

- Full `prefers-reduced-motion` support (spirals/scratch collapse to gentle fades).
- Keyboard-focusable controls, visible focus rings, ARIA labels.
- Transform/opacity-only animations for 60fps; particle counts scale down on mobile.
- Audio unlocks on the first keypad tap and can be muted any time.
