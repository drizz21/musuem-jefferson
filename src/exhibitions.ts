/**
 * Exhibition metadata — single source of truth for all exhibition pages.
 * Used by ExhibitionDetail to render dynamic pages per slug.
 */

export interface Exhibition {
  slug: string;
  title: string;
  dates: string;
  location: string;
  status: "CURRENT" | "UPCOMING";
  heroImage: string;
  heroCaption: string;
  curatorName: string;
  curatorTitle: string;
  artistName: string;
  artistPortrait: string;
  artistBio: string;
  curatorStatement: string;
  curatorBody: string;
}

export const EXHIBITIONS: Record<string, Exhibition> = {
  "the-long-horizon": {
    slug: "the-long-horizon",
    title: "The Long Horizon",
    dates: "12 September 2026 – 14 February 2027",
    location: "Gallery 2, North Wing",
    status: "CURRENT",
    heroImage: "/images/generated-11.png",
    heroCaption:
      "PLATE I · THE LONG HORIZON, 1934 · OIL ON CANVAS",
    curatorName: "Dr. Ines Moreau",
    curatorTitle: "CURATOR",
    artistName: "Marta Solveig",
    artistPortrait: "/images/generated-10.png",
    artistBio:
      "Born in Bergen in 1901, Solveig painted the same valley for forty years. Jefferson holds twenty-two of her works, the largest group outside Norway.",
    curatorStatement:
      "A horizon is the simplest thing a painter can draw and the hardest thing to mean. This exhibition follows ninety years of artists who kept returning to that line — and kept failing, beautifully, to settle it.",
    curatorBody:
      "Drawn from our own holdings and twelve loans, the show is arranged in five rooms rather than chronologically. You begin in a dark room, move toward light, and end at a window that looks onto the river the paintings were made beside.\n\nThere are no wall texts inside the galleries. The full catalogue is free at the door, and every work has a short audio note you can reach by phone.",
  },

  "paper-and-pigment": {
    slug: "paper-and-pigment",
    title: "Paper & Pigment",
    dates: "4 October 2026 – 22 March 2027",
    location: "Print Room",
    status: "CURRENT",
    heroImage: "/images/generated-6.png",
    heroCaption: "PLATE I · WINTER GARDEN, EDO PERIOD · WOODBLOCK ON PAPER",
    curatorName: "Dr. James Chen",
    curatorTitle: "CURATOR",
    artistName: "Kenji Okada",
    artistPortrait: "/images/generated-9.png",
    artistBio:
      "A master of woodblock techniques, Okada (1750–1820) refined the tradition of landscape printing during Japan's most refined artistic period. Jefferson's collection spans his entire career.",
    curatorStatement:
      "Woodblock prints are an art of restraint — every mark counts, every colour sings. This exhibition reveals how Edo artists achieved such depth with such economy.",
    curatorBody:
      "Arranged in low light to preserve the pigments, these works are shown at eye level — a rare vantage that lets you read each brush gesture and pressure. The prints are never rushed; the exhibition invites slow looking.\n\nEach work includes a meditation note and technical brief. Audio guides explore the printing process itself.",
  },

  "vessel-and-cloth": {
    slug: "vessel-and-cloth",
    title: "Vessel and Cloth",
    dates: "22 November 2026 – 30 April 2027",
    location: "Gallery 5",
    status: "CURRENT",
    heroImage: "/images/generated-3.png",
    heroCaption:
      "PLATE I · STILL LIFE WITH LINEN AND JUG, 1921 · OIL ON BOARD",
    curatorName: "Dr. Sofia Ruiz",
    curatorTitle: "CURATOR",
    artistName: "Lucia Ruiz",
    artistPortrait: "/images/generated-5.png",
    artistBio:
      "Ruiz (1889–1968) painted domestic quiet for fifty years. A textile specialist's eye and a painter's hand made her still lifes into studies of light, weight, and desire. Jefferson holds her largest retrospective.",
    curatorStatement:
      "The painters in this room loved humble things: folded cloth, simple vessels, the light that finds a corner of a table. They understood that still life is not about objects — it is about time stopping.",
    curatorBody:
      "Rather than arrange by period or medium, we have grouped works by the light they catch: morning windows, afternoon slant, evening shadow. You walk through five rooms, each tuned to a different hour of the day.\n\nFull catalogue at the door. No labels — let your eye do the work first.",
  },
};

export function getExhibition(slug: string): Exhibition | null {
  return EXHIBITIONS[slug] || null;
}
