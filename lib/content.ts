// All human-facing content lives here so the experience is easy to personalise.

export const experienceContent = {
  // ---------- Lock screen ----------
  // The passcode. Change this to something meaningful (a date, etc.).
  lockCode: "21102025",
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
  smallLetterGreeting: "Hi, my love,",
  smallLetterBody: [
    "I wanted to give you something you couldn't just scroll past — something you'd have to slow down for, the way we slow down for the things that matter.",
    "So I built you a little garden and hid my favourite moments of you inside it. Some are behind flowers, some behind a gentle scratch of your finger.",
    "Take your time with it. There's no rush here — just me, trying to say what I feel, in the only way big enough to hold it.",
  ],

  // ---------- Gallery section intro ----------
  galleryIntro: "moments of you",
  gallerySubtitle: "scratch each photo to reveal it",

  // ---------- The big final letter (the heart of the gift) ----------
  bigLetterTitle: "everything I forget to say out loud",
  bigLetterGreeting: "My love,",
  bigLetterParagraphs: [
    "There are things I carry with me everywhere — the sound of your voice when you're half-asleep, the way you go quiet when something moves you, and the quiet certainty that the world became gentler the day it handed me you.",
    "I'm not always good at saying it out loud, so I built you this instead: a small garden, a handful of stolen moments, and every word I mean but somehow forget to say when you're looking at me.",
    "Thank you for the mornings that feel like Sundays even when they aren't. For laughing at the jokes that don't deserve it. For staying — especially on the days I made staying hard.",
    "You are my favourite person, my calmest place, and the best thing I never planned for. If I had to fall for you all over again, I'd do it slower, just to feel every second of it twice.",
    "Wherever you are as you read this, know that I'm already thinking of you. I probably have been all day.",
  ],
  bigLetterSignoff: "Yours — completely, and without conditions,",
  bigLetterSignature: "— Me",

  // ---------- Outro ----------
  outroTitle: "the end, for now",
  outroLine: "…but never the end of us.",

  // ---------- Music player (procedural audio, no files) ----------
  // Drop the audio file at public/music/blue.mp3 (see public/music/README.txt).
  music: {
    title: "Blue",
    artist: "yung kai",
    src: "/music/blue.mp3",
  },

  // ---------- Voice note ----------
  voice: {
    label: "A little voice note",
    caption: "press play — I recorded this thinking of you",
    src: "/voice/note.mp3",
    duration: 67, // fallback; real duration is read from the file
  },

  // ---------- Our Story timeline ----------
  timelineIntro: "our story",
  timelineSubtitle: "eight months, and every storm we chose to survive",

  // ---------- "Open when…" envelopes ----------
  openWhenIntro: "open when…",
  openWhenSubtitle: "little envelopes for the moments I can't be there — tap one to open it",
  openWhenNotes: [
    {
      label: "you miss me",
      note: "Then close your eyes and remember: 108 miles is nothing to a heart that already decided. I'm missing you back, at this exact second, probably harder. Play our song, watch one of my circle videos on repeat like I watch yours, and know I'm counting down to the next time your voice is in my ear.",
    },
    {
      label: "you can't sleep",
      note: "Come here. Put the phone down for a second and just breathe with me — in for four, out for four. You've survived every single one of your worst nights so far, and you'll survive this one too. I'm on the other side of the dark, awake with you in spirit, holding your hand across all those hours. Sleep now, my babygirl. I've got the night watch.",
    },
    {
      label: "you're proud of yourself",
      note: "GOOD. Finally. I hope you feel it in your whole chest. I've watched you carry so much for so long, so on the day you actually let yourself feel proud — I'm the loudest one in the room, screaming for you. Whatever you just did, I already knew you could. I always knew.",
    },
    {
      label: "we fight",
      note: "Read this slowly. I'm not going anywhere. Not over this, not over anything. We've broken more times than I can count and found our way back every single time, because what we have is bigger than any bad night. I'm sorry for my part. I love you more than I love being right. Come back to me — I'm already halfway to you.",
    },
    {
      label: "you feel alone",
      note: "You are not alone. You have never been alone since October 21st, and you never will be again. Even in your silence I'm there — I told you, your silence is full of you and I'd rather live inside it than anywhere without you. Whatever you're carrying, hand me half. That's what I'm for.",
    },
    {
      label: "you need to remember us",
      note: "Scroll back up. Read the whole story. Every storm, every 3 a.m. novel, every 'okay' that meant everything. Remember the house with the big windows, the garden, the little girl with your eyes. We are real, and we are worth it, and I will keep choosing you until the very last page. Always.",
    },
  ],

  // ---------- "Reasons I love you" deck ----------
  reasonsIntro: "reasons I love you",
  reasonsSubtitle: "tap a card for the next one — there are more of these than cards could ever hold",
  reasons: [
    "Because you feel everything all the way to the bottom, and you never once pretended otherwise.",
    "Because your good-morning videos are the reason I love mornings now.",
    "Because you came back. Every single time, you came back.",
    "Because you trusted me with the quiet channel you kept only for yourself.",
    "Because you say 'huhhhhhhhh' and it undoes me every time.",
    "Because you make kolbasa-and-qiyma pizza and manti like it's nothing, my talented girl.",
    "Because you gave me an oath on your whole life, and meant it.",
    "Because you find the exact word for the thing everyone else leaves unnamed.",
    "Because you're soft without ever being weak, and strong without ever going cold.",
    "Because you kept your faith even while you were drowning.",
    "Because you want three kids and a garden and a loud little house, same as me.",
    "Because you looked at all my mess and decided to stay anyway.",
    "Because 108 miles never once made you love me quieter.",
    "Because you're my anomaly — the girl who crashed into my quiet world and made it alive.",
    "Because loving you is the easiest, truest thing I have ever done.",
  ],

  // ---------- Final question moment ----------
  finalQuestion: {
    prompt: "So… after everything —",
    question: "will you keep choosing me?",
    yes: "Yes. Always.",
    no: "no",
    celebrate: "I was never going to let you say no anyway. Forever, then. 🤍",
  },

  // ---------- Countdown ----------
  // Our story began on October 21st. Set reunionDate to the day you'll meet
  // (YYYY-MM-DD) to show "days until I see you", or leave it null to hide it.
  countdown: {
    startDate: "2025-10-21",
    startLabel: "days we've been choosing each other",
    reunionDate: null as string | null,
    reunionLabel: "days until I finally hold you",
    caption: "since October 21st — the day we said it out loud",
  },

  // ---------- Memory map ----------
  memoryMapIntro: "the places on our map",
  memoryMapSubtitle: "108 miles, and every pin is a piece of us — tap one",
  memoryPlaces: [
    { name: "the channel", x: 26, y: 34, photo: "/pics/img1.jpg", caption: "a tiny Telegram channel, a 3 a.m. post about love — where a stranger with a Berserk picture appeared." },
    { name: "your side", x: 72, y: 26, photo: "/pics/img14.jpg", caption: "108 miles away, where your good-morning videos come from — and where the cold floor waits for you every morning." },
    { name: "my side", x: 30, y: 68, photo: "/pics/img10.jpg", caption: "where I count toward the ninety minutes, then carry your voice through the rest of the night." },
    { name: "the house", x: 66, y: 72, photo: "/pics/img21.jpg", caption: "big windows, a garden, manti in the kitchen, a little girl with your eyes. Not built yet — but we both know how to find it." },
  ],

  // ---------- Playlist (drop MP3s in /public/music) ----------
  playlist: [
    { title: "Blue", artist: "yung kai", src: "/music/blue.mp3" },
    { title: "golden hour", artist: "JVKE", src: "/music/golden-hour.mp3" },
    { title: "Until I Found You", artist: "Stephen Sanchez", src: "/music/until-i-found-you.mp3" },
  ],

  // ---------- Keepsake ----------
  keepsake: {
    title: "before you go",
    saveLabel: "save this forever",
    savedNote: "it's yours now — bookmark this page and come back whenever you miss me. I'll be right here. 🤍",
    replyLabel: "reply to me",
    replyPlaceholder: "say something back to me…",
    replyButton: "send it to me",
    // Where a reply should go. Put your email here to receive it.
    replyTo: "",
    thanks: "I felt that. Thank you — I'm keeping every word. 🤍",
  },
} as const;

export type ExperiencePhase = "lock" | "portal" | "envelope" | "journey";
