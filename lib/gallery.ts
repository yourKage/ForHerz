// The scratch-to-reveal photo journey.
// Placeholder captions — replace with your own. Point `src` at files you drop
// into public/pics (e.g. /pics/img1.jpg). Add or remove items freely.

export interface GalleryItem {
  src: string;
  caption: string;
  note?: string; // handwritten note on the back of the polaroid (tap to flip)
}

// Edit these: one entry per photo. `note` (the flip-side line) is optional.
export const galleryItems: GalleryItem[] = [
  { src: "/pics/img1.jpg", caption: "placeholder caption", note: "placeholder note — the line on the back of the photo." },
  { src: "/pics/img2.jpg", caption: "placeholder caption", note: "placeholder note." },
  { src: "/pics/img3.jpg", caption: "placeholder caption", note: "placeholder note." },
  { src: "/pics/img4.jpg", caption: "placeholder caption", note: "placeholder note." },
  { src: "/pics/img5.jpg", caption: "placeholder caption", note: "placeholder note." },
  { src: "/pics/img6.jpg", caption: "placeholder caption", note: "placeholder note." },
];

// Longer lines for the crumpled-paper notes tucked between photos. Replace these.
export const letterNotes: string[] = [
  "Placeholder note one — write something you'd tuck between the photos.",
  "Placeholder note two.",
  "Placeholder note three.",
  "Placeholder note four.",
];
