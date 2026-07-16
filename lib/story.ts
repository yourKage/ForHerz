// "Our Story" — a timeline of chapters, condensed from your own writing.
// Every word here is editable. When the 9th month arrives, fill in chapter nine.
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
export const storySubtitle = "eight months, every storm we chose to survive — and a ninth about to begin";

export const storyChapters: StoryChapter[] = [
  {
    kicker: "Chapter One",
    title: "The Anomaly",
    period: "where it began",
    body: "A tiny Telegram channel, a 3 a.m. post about love, and a stranger with a Berserk profile picture who appeared quiet in my livestreams like a lighthouse in the fog. A careless message from someone else nearly ended us before we began — but a golden-hour song brought you back. And on October 21st, we finally said it out loud: I love you.",
    flower: "rose",
  },
  {
    kicker: "Chapter Two",
    title: "Sixty Days",
    period: "the second month",
    body: "Good-morning circle videos I'd rewatch twenty times. Breaking four or five times, and choosing each other again every single time. Forty-seven hours of calls, your midnight oath, and dreams of a loud little house with three kids. Somewhere in there you stopped being a stranger and became my daily magic.",
    flower: "peony",
  },
  {
    kicker: "Chapter Three",
    title: "Ms. Feel",
    period: "your hidden world",
    body: "Then I found the quiet channel you kept only for yourself — the one called Meaningless, then just a dot. I read your walls speak and your silence leave footprints, and understood you deeper: soft but guarded, tired but faithful. I hadn't just fallen for a girl. I'd fallen for a whole universe.",
    flower: "hydrangea",
  },
  {
    kicker: "Chapter Four",
    title: "The Heartbeat",
    period: "the fifth month",
    body: "Calls from your first sleepy circle video until the stars came out on my side. \u201Cmaybe I miss you a little too.\u201D We built a house with big windows in our heads — a garden, your manti, a daughter with your eyes — and I stayed on the line through every guilt and every doubt that tried to pull us apart.",
    flower: "lily",
  },
  {
    kicker: "Chapter Five",
    title: "The Month That Almost Ended It",
    period: "March",
    body: "It began gentle and warm — even a message for you at the stroke of midnight. Then a taken phone, a greenhouse with no signal, and four words that were never mine reaching you first: it's over. And still, from the very edge of losing everything, we clawed our way back to each other.",
    flower: "iris",
  },
  {
    kicker: "Chapter Six",
    title: "The Quietest Bleed",
    period: "April",
    body: "Eight-hour shifts with only ninety minutes carved out for you — the center of my day, and never enough. A broken phone and three days of silence. My mother's words reaching you, then reaching further. The cancer I told you about before anyone else. We broke, and still I said it: I'll be at the house, by the door, watching the road where you disappeared.",
    flower: "anemone",
  },
  {
    kicker: "Chapter Seven",
    title: "The Threshold in the Street",
    period: "May",
    body: "You said thank you, then goodbye, then blocked me — and I kept a vow I'd made in the dark. Days on cold concrete, hollow with hunger, walking to the university just to reach a screen. A Friday prayer, my forehead on the carpet longer than I needed. One step from my own door — and the message that it had been a test. My father left for Hajj; I came back for his sake. The staying was the only freedom I ever wanted.",
    flower: "lotus",
  },
  {
    kicker: "Chapter Eight",
    title: "Her Birthday in the Ruins",
    period: "June",
    body: "June opened with you back, and I started building your birthday with my hands — the camera, the perfume, every small thing chosen to land in the exact place inside you. Then June 16th, the same hand reached you again, and you went quiet. I didn't argue, and I didn't stop. I kept wrapping the birthday anyway, because the tide always comes back, and I meant to be on the shore when it did.",
    flower: "dahlia",
  },
  {
    kicker: "Chapter Nine",
    title: "The One We Haven't Written Yet",
    period: "a few days away",
    body: "The ninth month is almost here — closer with every hour. I don't know yet what it holds, only that I want to write it with you and not about you. Whatever shape it takes, the house with the big windows is still there between the sentences, still waiting. Come write this one with me.",
    flower: "daisy",
    coming: true,
  },
];
