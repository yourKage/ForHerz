// All human-facing content lives here so the experience is easy to personalise.
// Everything below is placeholder sample text — replace it with your own words.

export const experienceContent = {
  // ---------- Lock screen ----------
  // The passcode. Change this to something meaningful (a date, etc.).
  lockCode: "1121",
  lockWelcome: "Welcome, You",
  lockHint: "a little secret…",
  lockError: "not quite — try again",

  // ---------- Portal (flower spiral) ----------
  portalPrompt: "tap the letter",

  // ---------- Vintage envelope ----------
  envelopePrompt: "Tap to open",

  // ---------- Gift header (From / For) ----------
  giftFrom: "Me",
  giftTo: "You",

  // ---------- The little opening note (warm & unhurried) ----------
  smallLetterGreeting: "Hi there,",
  smallLetterBody: [
    "This is placeholder text. Write the little opening note here — something warm and unhurried that sets the tone.",
    "Keep it short. A sentence or two about why you built this and what you hope they feel scrolling through it.",
    "Replace every line in this file (lib/content.ts) with your own words.",
  ],

  // ---------- Gallery section intro ----------
  galleryIntro: "moments",
  gallerySubtitle: "scratch each photo to reveal it",

  // ---------- The big final letter (the heart of the gift) ----------
  bigLetterTitle: "the things I forget to say",
  bigLetterGreeting: "Hi,",
  bigLetterParagraphs: [
    "This is the big final letter — the heart of the gift. Write the paragraphs you mean but forget to say out loud.",
    "Each string in this array is one paragraph. Add or remove as many as you like.",
    "Placeholder line. Replace me.",
    "Placeholder line. Replace me.",
  ],
  bigLetterSignoff: "Yours,",
  bigLetterSignature: "— Me",

  // ---------- Outro ----------
  outroTitle: "the end, for now",
  outroLine: "…but never really the end.",

  // ---------- Music player ----------
  // Drop the audio file at public/music/blue.mp3 (see public/music/README.txt).
  music: {
    title: "Song Title",
    artist: "Artist",
    src: "/music/blue.mp3",
  },

  // ---------- Voice note ----------
  voice: {
    label: "A little voice note",
    caption: "press play — recorded this thinking of you",
    src: "/voice/note.mp3",
    duration: 60, // fallback; real duration is read from the file
  },

  // ---------- Our Story timeline ----------
  timelineIntro: "our story",
  timelineSubtitle: "a few chapters, in your own words",

  // ---------- "Open when…" envelopes ----------
  openWhenIntro: "open when…",
  openWhenSubtitle: "little envelopes for the moments you can't be there — tap one to open it",
  openWhenNotes: [
    {
      label: "you miss me",
      note: "Placeholder. Write a short note for when they miss you.",
    },
    {
      label: "you can't sleep",
      note: "Placeholder. Write a calming note for a sleepless night.",
    },
    {
      label: "you're proud of yourself",
      note: "Placeholder. Write something for a proud day.",
    },
    {
      label: "we fight",
      note: "Placeholder. Write the note you'd want them to read after a fight.",
    },
    {
      label: "you feel alone",
      note: "Placeholder. Write a note for a lonely moment.",
    },
    {
      label: "you need to remember us",
      note: "Placeholder. Write a note that reminds them of the good.",
    },
  ],

  // ---------- "Reasons I love you" deck ----------
  reasonsIntro: "reasons",
  reasonsSubtitle: "tap a card for the next one",
  reasons: [
    "Because — placeholder reason one.",
    "Because — placeholder reason two.",
    "Because — placeholder reason three.",
    "Because — placeholder reason four.",
    "Because — placeholder reason five.",
    "Add as many as you like — each string is one card.",
  ],

  // ---------- Final question moment ----------
  finalQuestion: {
    prompt: "So… after everything —",
    question: "will you keep choosing me?",
    yes: "Yes. Always.",
    no: "no",
    celebrate: "Forever, then. 🤍",
  },

  // ---------- Countdown ----------
  // Set startDate to your own date (YYYY-MM-DD). reunionDate optional.
  countdown: {
    startDate: "2025-01-01",
    startLabel: "days we've been choosing each other",
    reunionDate: null as string | null,
    reunionLabel: "days until I finally see you",
    caption: "since the day we said it out loud",
  },

  // ---------- Memory map ----------
  memoryMapIntro: "the places on our map",
  memoryMapSubtitle: "every pin is a piece of us — tap one",
  memoryPlaces: [
    { name: "place one", x: 26, y: 34, photo: "/pics/img1.jpg", caption: "Placeholder caption for this pin." },
    { name: "place two", x: 72, y: 26, photo: "/pics/img14.jpg", caption: "Placeholder caption for this pin." },
    { name: "place three", x: 30, y: 68, photo: "/pics/img10.jpg", caption: "Placeholder caption for this pin." },
    { name: "place four", x: 66, y: 72, photo: "/pics/img21.jpg", caption: "Placeholder caption for this pin." },
  ],

  // ---------- Playlist (drop MP3s in /public/music) ----------
  playlist: [
    { title: "Song One", artist: "Artist", src: "/music/blue.mp3" },
    { title: "Song Two", artist: "Artist", src: "/music/golden-hour.mp3" },
    { title: "Song Three", artist: "Artist", src: "/music/until-i-found-you.mp3" },
  ],

  // ---------- Keepsake ----------
  keepsake: {
    title: "before you go",
    saveLabel: "save this forever",
    savedNote: "it's yours now — bookmark this page and come back whenever. 🤍",
    replyLabel: "reply to me",
    replyPlaceholder: "say something back…",
    replyButton: "send it",
    // Where a reply should go. Put your email here to receive it.
    replyTo: "",
    thanks: "Thank you — keeping every word. 🤍",
  },
} as const;

export type ExperiencePhase = "lock" | "portal" | "envelope" | "journey";
