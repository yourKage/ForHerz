// Curated romantic-botanical colour sets. Each flower picks one at random
// (deterministically, via its seed) so the wreath feels varied but harmonious.

export interface Palette {
  outer: string;
  inner: string;
  core: string;
  edge: string;
}

export const FLOWER_PALETTES: Palette[] = [
  { outer: "#f3cfcb", inner: "#e9aaa3", core: "#d2a959", edge: "#dd857c" }, // blush
  { outer: "#e6a4ac", inner: "#d67f8c", core: "#efdcae", edge: "#c05a6d" }, // rose
  { outer: "#f4e8d2", inner: "#efdcae", core: "#d2a959", edge: "#e3c583" }, // cream-gold
  { outer: "#e9d4e8", inner: "#d4b0d6", core: "#efdcae", edge: "#b98fc0" }, // lilac
  { outer: "#f9e5e3", inner: "#f3cfcb", core: "#e3c583", edge: "#e9aaa3" }, // pale rose
];

export const LEAF_GREENS = ["#93a67e", "#6f855b", "#b7c4a4", "#556844"];
