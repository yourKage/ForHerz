// "Our Story" — a timeline of chapters. Every word here is placeholder sample
// text; replace each chapter with your own. Add or remove chapters freely.
import type { FlowerSpecies } from "@/components/art/FlowerHead";

export interface StoryChapter {
  kicker: string; // "Chapter One"
  title: string;
  period: string; // a date or a season label
  body: string;
  flower: FlowerSpecies;
  coming?: boolean; // the chapter not yet written
}

export const storyTitle = "our story";
export const storySubtitle = "a few chapters, in your own words";

export const storyChapters: StoryChapter[] = [
  {
    kicker: "Chapter One",
    title: "Where It Began",
    period: "the beginning",
    body: "Placeholder text. Write how your story started — the first message, the first moment, the day it became real.",
    flower: "rose",
  },
  {
    kicker: "Chapter Two",
    title: "Getting Closer",
    period: "the early days",
    body: "Placeholder text. Write about the stretch where a stranger turned into your favourite person.",
    flower: "peony",
  },
  {
    kicker: "Chapter Three",
    title: "Knowing You",
    period: "deeper",
    body: "Placeholder text. Write about learning who they really are.",
    flower: "hydrangea",
  },
  {
    kicker: "Chapter Four",
    title: "Building Something",
    period: "later",
    body: "Placeholder text. Write about the plans, the dreams, the house in your heads.",
    flower: "lily",
  },
  {
    kicker: "Chapter Five",
    title: "The Hard Part",
    period: "a storm",
    body: "Placeholder text. Write about a season you survived together.",
    flower: "iris",
  },
  {
    kicker: "Chapter Six",
    title: "The One We Haven't Written Yet",
    period: "what's next",
    body: "Placeholder text. Leave this as the chapter still being written — the future you want to write together.",
    flower: "daisy",
    coming: true,
  },
];
