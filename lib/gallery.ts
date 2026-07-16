// The scratch-to-reveal photo journey.
// A hand-picked, curated set — chosen for warmth and character, not order.
// Every photo has its own creative caption. Edit freely.

export interface GalleryItem {
  src: string;
  caption: string;
  note?: string; // handwritten note on the back of the polaroid (tap to flip)
}

// Curated favourites (hand-selected). Reorder/replace as you like.
export const galleryItems: GalleryItem[] = [
  { src: "/pics/img14.jpg", caption: "the day even the flowers were a little jealous", note: "I keep coming back to this one. You, and something blooming, and me realising I'd never look at flowers the same way again." },
  { src: "/pics/img17.jpg", caption: "sunlight learned how to fall from you", note: "Golden hour is just the world trying to look at you the way I do." },
  { src: "/pics/img20.jpg", caption: "soft as morning, and twice as warm", note: "This is the version of you I get on the good mornings — and I'd trade a lot to warm that cold floor for you in person." },
  { src: "/pics/img2.jpg", caption: "too cool for me — and yet, here we are", note: "Out of everyone in the world, you kept picking me. I still can't believe my luck." },
  { src: "/pics/img10.jpg", caption: "the face I'd find in any crowd", note: "I'd know you anywhere. I think I knew you before I even knew your name." },
  { src: "/pics/img7.jpg", caption: "even the night got a little brighter", note: "Two full days of calls, and my favourite hours are still the quiet ones where I just hear you breathe." },
  { src: "/pics/img21.jpg", caption: "I caught you dreaming, so I stayed", note: "Dream about the house with the big windows. I'm building toward it, one late night at a time." },
  { src: "/pics/img6.jpg", caption: "my favourite kind of ordinary", note: "You made ordinary days worth living. Colours are brighter, food tastes better — you said it first, and it's true for me too." },
  { src: "/pics/img12.jpg", caption: "the little smirk that completely undid me", note: "That smirk is a weapon and you know it. I surrender every single time." },
  { src: "/pics/img23.jpg", caption: "looking up, like something good was coming", note: "Something good was coming. It was us." },
  { src: "/pics/img13.jpg", caption: "even your pout is my favourite thing", note: "Do the 'huhhhhhhhh' for me. I can hear it just looking at this." },
  { src: "/pics/img1.jpg", caption: "peace — and the girl who gave me mine", note: "You crashed into my quiet little world and made it loud and colourful and alive. Thank you for staying anyway." },
];

// Longer, heartfelt lines for the crumpled-paper notes tucked between photos.
export const letterNotes: string[] = [
  "I keep these where I can find them on the hard days. One look and the whole world goes quiet in the best way.",
  "You never notice how often I'm looking at you. It's constantly — and it's my favourite thing to do.",
  "If I could bottle a feeling, it would be this one: you, unguarded, laughing at something only you found funny.",
  "Every photo here is a small proof that my luckiest day was the one I met you.",
  "I don't have the words big enough, so I collected these instead. Consider each one an 'I love you' I forgot to say out loud.",
  "Wherever we end up, I hope you keep this — so you never forget how deeply, and how stubbornly, you are loved.",
];
