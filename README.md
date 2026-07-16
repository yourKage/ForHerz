# A Letter for You 💌

A premium, cinematic interactive romantic letter experience — locked with a
little passcode, opened with a garden that blooms out of an envelope, and told
through scratch-off photos of her and two handwritten letters.

## The experience (flow)

1. **Lock screen** — a torn-paper card on a soft faded pressed-flower wallpaper.
   "Welcome, You / a little secret…", a padlock, four dots and a number pad.
   Enter the 4-digit code (shakes on a wrong code, the lock springs open on the
   right one).
2. **The flower portal** — a little letter sits in the centre. Tap it and dozens
   of watercolour flower heads (cosmos, daisy, lily, hydrangea, sunflower,
   dahlia, peony) **spiral outward and fill the whole screen**, then **fall away
   like gravity**, revealing the next page — no reload.
3. **The vintage envelope** — a kraft watercolour envelope with a painted
   bluebell sprig and a purple wax seal on crumpled newspaper paper.
   *Tap to open* → the flap lifts and the letter rises.
4. **The journey (scroll)** — a short, tender opening letter, then a long
   scrollable gallery of **scratch-to-reveal** photos of her (each in a vintage
   maroon frame with its own caption and note), then the **big final letter**
   with a floating music player and a voice note, and finally a gentle **outro**.

Soft procedural piano fades in for the journey; petals drift, sparkles shimmer,
nothing is ever perfectly still.

## The passcode 🔑

The default code is **`1121`**. Change it (and every line of text) in
[`lib/content.ts`](lib/content.ts) → `lockCode`.

## Your photos

Her photos live in `public/pics` (`img1…img73`). The gallery, captions and notes
are generated in [`lib/gallery.ts`](lib/gallery.ts) — edit the `CAPTIONS` /
`NOTES` pools, or set a specific caption per image in the list.

## Tech

- **Next.js 15** (App Router) + **React 19** + **TypeScript** + **Tailwind CSS**
- **Framer Motion** for all animation (spring physics, spiral bursts, gravity
  fall, scroll reveals)
- **Web Audio API** — fully **procedural** piano, wind, birds, paper, wax and
  chimes (no audio asset files required)
- **Original SVG artwork** — `components/art/FlowerHead.tsx` renders eight
  watercolour flower species parametrically, matched to a warm autumn bouquet
- Scratch cards use a `<canvas>` (destination-out erasing) that only initialises
  when scrolled into view, so 70+ photos stay smooth

## Run it

```bash
npm install
npm run dev      # http://localhost:3000  (use npm.cmd on Windows PowerShell)
npm run build    # production build
npm start        # serve the production build
```

## Accessibility & performance

- Full `prefers-reduced-motion` support (spirals/scratch collapse to gentle
  fades and tap-to-reveal)
- Keyboard-focusable controls with visible focus rings and ARIA labels
- Transform/opacity-only animations for 60fps; particle & flower counts scale
  down on mobile
- Audio is unlocked by the first keypad tap and can be muted any time
