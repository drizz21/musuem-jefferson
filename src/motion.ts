import { useEffect, useRef, useState } from "react";

/**
 * Motion engine.
 *
 * The pen.dev pages are generated files — they must not be hand-edited, or a
 * re-run of `tools/pen-to-jsx.mjs` would wipe the changes. So every effect is
 * attached from the OUTSIDE, by walking the DOM and reading the `data-pen`
 * attributes the generator already emits (they mirror the layer names in the
 * design document exactly).
 *
 * Nothing here writes to a layout property: only classes that animate
 * transform / opacity / clip-path are added.
 */

const REDUCED = "(prefers-reduced-motion: reduce)";

export const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia(REDUCED).matches;

/** adds a class to an element's existing className, without duplicating */
const add = (el: Element, ...names: string[]) => {
  for (const n of names) el.classList.add(n);
};

/** sets --mo-d (stagger index) so siblings cascade instead of popping */
const stagger = (el: HTMLElement, i: number) => {
  el.style.setProperty("--mo-d", String(i));
};

/* ------------------------------------------------------------------ *
 * Per-page decoration recipes.
 *
 * Each entry is [selector, ...classes]. Selectors are scoped to the page
 * root, and every one is expressed in terms of the design's own layer names
 * (`[data-pen="..."]`) so the mapping back to the canvas is obvious.
 * ------------------------------------------------------------------ */

type Rule = [string, string];

const REVEAL = "mo";
const PLATE = "mo-plate";
const RULE = "mo-rule";

/** Selectors that appear on every page: the chrome + the shared blocks. */
const SHARED: Rule[] = [
  // ---- NavBar: the logo settles in, links underline, the CTA presses
  ['[data-pen="Nav"] [data-pen="Logo"]', "mo mo-fade"],
  ['[data-pen="Nav"] nav a', "nav-link"],
  ['[data-pen="Nav"] a[data-pen="CTA"]', "mo-press"],

  // ---- Footer: brand, blurb and the three link columns cascade
  ['[data-pen="Footer"] [data-pen="Wordmark"]', "mo"],
  ['[data-pen="Footer"] [data-pen="Blurb"]', "mo"],
  ['[data-pen="Footer"] [data-pen="VISIT"]', "mo"],
  ['[data-pen="Footer"] [data-pen="EXPLORE"]', "mo"],
  ['[data-pen="Footer"] [data-pen="CONNECT"]', "mo"],
  ['[data-pen="Footer"] [data-pen="Bottom"]', "mo"],
];

/** Big statement/lead paragraphs that deserve the slower rise. */
const LEAD = [
  '[data-pen="Statement"]',
  '[data-pen="Lead"]',
  '[data-pen="Mission"]',
  '[data-pen="Intro"] [data-pen="Statement"]',
];

export type Recipe = {
  /** elements that rise + fade as they enter the viewport */
  reveal: string[];
  /** image plates that wipe open, then drift on hover */
  plates: string[];
  /** full-bleed hero artwork: settles from a slow scale instead of a wipe */
  heroes: string[];
  /** gradient scrims that fade in behind hero text */
  scrims: string[];
  /** hairline rules that draw themselves left-to-right */
  rules: string[];
  /** interactive cards (lift on hover, image zoom) */
  cards: string[];
  /** interactive list rows (nudge right on hover) */
  rows: string[];
  /** button-like blocks (press feedback) */
  press: string[];
  /** filter chips */
  chips: string[];
  /** extra one-off selectors */
  extra: Rule[];
};

const EMPTY: Recipe = {
  reveal: [],
  plates: [],
  heroes: [],
  scrims: [],
  rules: [],
  cards: [],
  rows: [],
  press: [],
  chips: [],
  extra: [],
};

const RECIPES: Record<string, Partial<Recipe>> = {
  /* ------------------------------------------------------------- HOME */
  "Home / Landing": {
    reveal: [
      '[data-pen="Hero"] [data-pen="Eyebrow"]',
      '[data-pen="Hero"] [data-pen="Hero Title"]',
      '[data-pen="Hero"] [data-pen="Hero Copy"]',
      '[data-pen="Hero"] [data-pen="Hero Buttons"]',
      '[data-pen="Hero"] [data-pen="Meta"]',
      '[data-pen="Intro"] [data-pen="Statement"]',
      '[data-pen="Intro"] [data-pen="Side"]',
      ...LEAD,
      '[data-pen="Stat"]',
      '[data-pen="Featured Exhibitions"] [data-pen="Head"]',
      '[data-pen="Collection Teaser"] [data-pen="Head"]',
      '[data-pen="Visit Strip"] [data-pen="Text"]',
    ],
    heroes: ['[data-pen="Hero"] [data-pen="Hero Artwork"]'],
    scrims: ['[data-pen="Hero"] [data-pen="Scrim"]'],
    plates: [
      '[data-pen="Featured Exhibitions"] [data-pen="Plate"]',
      '[data-pen="Collection Teaser"] [data-pen="Plate"]',
      '[data-pen="Visit Strip"] [data-pen="Photo"]',
    ],
    rules: [
      '[data-pen="Hero"] [data-pen="Rule"]',
      '[data-pen="Stat"] [data-pen="Rule"]',
    ],
    cards: [
      '[data-pen="Featured Exhibitions"] [data-pen="Row"] > div',
      '[data-pen="Collection Teaser"] [data-pen="Row"] > div',
    ],
    press: [
      '[data-pen="Hero Buttons"] > div',
      '[data-pen="Visit Strip"] [data-pen="Buttons"] > div',
    ],
    extra: [
      ['[data-pen="Featured Exhibitions"] [data-pen="All"]', "mo mo-x"],
      ['[data-pen="Collection Teaser"] [data-pen="All"]', "mo mo-x"],
      // human touch — depth, tilt, magnet, counter
      ['[data-pen="Hero"] [data-pen="Hero Artwork"]', "mo-depth"],
      ['[data-pen="Featured Exhibitions"] [data-pen="Plate"]', "mo-depth"],
      ['[data-pen="Collection Teaser"] [data-pen="Plate"]', "mo-depth"],
      [
        '[data-pen="Featured Exhibitions"] [data-pen="Row"] > div',
        "mo-tilt mo-card-hover",
      ],
      [
        '[data-pen="Collection Teaser"] [data-pen="Row"] > div',
        "mo-tilt mo-card-hover",
      ],
      ['[data-pen="Hero Buttons"] > div', "mo-magnet mo-sweep"],
      [
        '[data-pen="Visit Strip"] [data-pen="Buttons"] > div',
        "mo-magnet mo-sweep",
      ],
      ['[data-pen="Stat"] [data-pen="Num"]', "mo-count mo-float"],
      // clip-reveal plates on scroll
      ['[data-pen="Featured Exhibitions"] [data-pen="Plate"]', "mo-depth"],
      ['[data-pen="Collection Teaser"] [data-pen="Plate"]', "mo-depth"],
      ['[data-pen="Visit Strip"] [data-pen="Photo"]', "mo-depth"],
      // section stagger
      ['[data-pen="Featured Exhibitions"] [data-pen="Row"]', "mo-stagger"],
      ['[data-pen="Collection Teaser"] [data-pen="Row"]', "mo-stagger"],
      // accent dots pulse
      ['[data-pen="Eyebrow"] [data-pen="Dot"]', "mo-dot-pulse"],
    ],
  },

  /* ------------------------------------------------------- EXHIBITIONS */
  "Exhibitions / Index": {
    reveal: [
      '[data-pen="Header"] [data-pen="Left"]',
      '[data-pen="Header"] [data-pen="Intro"]',
      '[data-pen="Filters"]',
      '[data-pen="List"] > div',
    ],
    plates: ['[data-pen="List"] [data-pen="Plate"]'],
    rows: ['[data-pen="List"] > div'],
    chips: [
      '[data-pen="Filters"] > div:not([data-pen="Spacer"]):not([data-pen="Count"])',
    ],
    extra: [
      ['[data-pen="Filters"] [data-pen="Count"]', "mo mo-x"],
      // human touch
      ['[data-pen="List"] [data-pen="Plate"]', "mo-depth"],
      ['[data-pen="List"] > div', "mo-tilt mo-card-hover mo-border-draw"],
      ['[data-pen="List"] [data-pen="Title"]', "mo-scramble"],
      ['[data-pen="List"] [data-pen="Num"]', "mo-float"],
      ['[data-pen="Filters"] > div', "mo-tag"],
      ['[data-pen="List"]', "mo-stagger"],
    ],
  },

  /* -------------------------------------------------- EXHIBITION DETAIL */
  "Exhibition / Detail": {
    reveal: [
      '[data-pen="Crumbs"]',
      '[data-pen="Title Block"] [data-pen="Left"]',
      '[data-pen="Right"] > div',
      '[data-pen="Statement"] [data-pen="Copy"]',
      '[data-pen="Statement"] [data-pen="Artist"]',
      '[data-pen="Also On"] [data-pen="Head"]',
    ],
    heroes: ['[data-pen="Artwork Hero"] [data-pen="Hero Art"]'],
    scrims: ['[data-pen="Hero"] [data-pen="Scrim"]'],
    plates: [
      '[data-pen="Statement"] [data-pen="Portrait"]',
      '[data-pen="Also On"] [data-pen="Plate"]',
    ],
    rules: [],
    cards: ['[data-pen="Also On"] [data-pen="Row"] > div'],
    press: ['[data-pen="BookBtn"]'],
    extra: [
      ['[data-pen="Artwork Hero"] [data-pen="Plate"]', "mo mo-fade"],
      ['[data-pen="Also On"] [data-pen="All"]', "mo mo-x"],
      // human touch
      ['[data-pen="Artwork Hero"] [data-pen="Hero Art"]', "mo-depth"],
      ['[data-pen="Statement"] [data-pen="Portrait"]', "mo-grey"],
      ['[data-pen="Title Block"] [data-pen="Title"]', "mo-scramble"],
      [
        '[data-pen="Title Block"] [data-pen="Right"] > div',
        "mo-info-row mo-border-draw",
      ],
      ['[data-pen="BookBtn"]', "mo-magnet mo-sweep"],
      [
        '[data-pen="Statement"] [data-pen="Eyebrow"] [data-pen="Dot"]',
        "mo-dot-pulse",
      ],
    ],
  },

  /* -------------------------------------------------------- COLLECTION */
  "Collection / Gallery": {
    reveal: [
      '[data-pen="Header"] [data-pen="Left"]',
      '[data-pen="Header"] [data-pen="Intro"]',
      '[data-pen="Filter Bar"]',
      '[data-pen="Grid"] [data-pen="Row 1"] > div',
      '[data-pen="Grid"] [data-pen="Row 2"] > div',
      '[data-pen="Grid"] [data-pen="Row 3"] > div',
      '[data-pen="Hover Detail Demo"] [data-pen="Explain"]',
    ],
    plates: [
      '[data-pen="Grid"] [data-pen="Plate"]',
      '[data-pen="Hover Detail Demo"] [data-pen="Card"] [data-pen="Plate"]',
    ],
    cards: [
      '[data-pen="Grid"] [data-pen="Row 1"] > div',
      '[data-pen="Grid"] [data-pen="Row 2"] > div',
      '[data-pen="Grid"] [data-pen="Row 3"] > div',
      '[data-pen="Hover Detail Demo"] [data-pen="Card"]',
    ],
    chips: [
      '[data-pen="Filter Bar"] [data-pen="All"]',
      '[data-pen="Filter Bar"] [data-pen="1800s"]',
      '[data-pen="Filter Bar"] [data-pen="1900s"]',
      '[data-pen="Filter Bar"] [data-pen="Oil"]',
      '[data-pen="Filter Bar"] [data-pen="Ink"]',
      '[data-pen="Filter Bar"] [data-pen="Sculpture"]',
      '[data-pen="Filter Bar"] [data-pen="Solveig"]',
      '[data-pen="Filter Bar"] [data-pen="Okada"]',
      '[data-pen="Filter Bar"] [data-pen="Ruiz"]',
    ],
    extra: [
      ['[data-pen="Filter Bar"] [data-pen="SortVal"]', "mo-chip"],
      // human touch
      ['[data-pen="Grid"] [data-pen="Plate"]', "mo-depth"],
      ['[data-pen="Grid"] [data-pen="Row 1"] > div', "mo-tilt mo-card-hover"],
      ['[data-pen="Grid"] [data-pen="Row 2"] > div', "mo-tilt mo-card-hover"],
      ['[data-pen="Grid"] [data-pen="Row 3"] > div', "mo-tilt mo-card-hover"],
      ['[data-pen="Grid"] [data-pen="Row 1"]', "mo-stagger"],
      ['[data-pen="Grid"] [data-pen="Row 2"]', "mo-stagger"],
      ['[data-pen="Grid"] [data-pen="Row 3"]', "mo-stagger"],
      ['[data-pen="Filter Bar"] > div', "mo-tag"],
      ['[data-pen="Header"] [data-pen="Title"]', "mo-scramble"],
    ],
  },

  /* --------------------------------------------------------------- VISIT */
  Visit: {
    reveal: [
      '[data-pen="Header"] [data-pen="Left"]',
      '[data-pen="Header"] [data-pen="Intro"]',
      '[data-pen="Info Grid"] [data-pen="Left"] > div',
      '[data-pen="Map Block"]',
      '[data-pen="MapFoot"]',
      '[data-pen="Admission Band"] [data-pen="L"]',
      '[data-pen="Admission Band"] [data-pen="R"] > div',
      '[data-pen="Getting Here"] [data-pen="Title"]',
      '[data-pen="Getting Here"] [data-pen="Row"] > div',
    ],
    rules: ['[data-pen="Getting Here"] [data-pen="Rule"]'],
    press: ['[data-pen="Admission Band"] [data-pen="ADULT"]'],
    extra: [
      // the map draws itself: roads sweep out, blocks pop, pin drops
      ['[data-pen="Map Block"] [data-pen="Road H"]', "mo-map-x"],
      ['[data-pen="Map Block"] [data-pen="Road V"]', "mo-map-y"],
      ['[data-pen="Map Block"] [data-pen="Water"]', "mo-map-x"],
      ['[data-pen="Map Block"] [data-pen="Park"]', "mo-map-pop"],
      ['[data-pen="Map Block"] [data-pen="Block A"]', "mo-map-pop"],
      ['[data-pen="Map Block"] [data-pen="Block B"]', "mo-map-pop"],
      ['[data-pen="Map Block"] [data-pen="RiverLabel"]', "mo mo-fade"],
      ['[data-pen="Map Block"] [data-pen="ParkLabel"]', "mo mo-fade"],
      ['[data-pen="Map Block"] [data-pen="Pin"]', "mo-map-pin"],
      ['[data-pen="Getting Here"] svg', "mo mo-fade"],
      ['[data-pen="MapFoot"] [data-pen="Dir"]', "mo-chip"],
      // human touch
      ['[data-pen="Admission Band"] [data-pen="ADULT"]', "mo-magnet mo-sweep"],
      [
        '[data-pen="Info Grid"] [data-pen="Left"] > div',
        "mo-info-row mo-border-draw",
      ],
      [
        '[data-pen="Getting Here"] [data-pen="Row"] > div',
        "mo-card-hover mo-tilt",
      ],
      ['[data-pen="Getting Here"] [data-pen="Row"]', "mo-stagger"],
      ['[data-pen="Header"] [data-pen="Title"]', "mo-scramble"],
      ['[data-pen="Map Block"]', "mo-depth"],
      ['[data-pen="Eyebrow"] [data-pen="Dot"]', "mo-dot-pulse"],
    ],
  },

  /* --------------------------------------------------------------- ABOUT */
  About: {
    reveal: [
      '[data-pen="Header"] [data-pen="Left"]',
      '[data-pen="Header"] [data-pen="Intro"]',
      '[data-pen="Story"] [data-pen="Copy"]',
      '[data-pen="Timeline"] [data-pen="Head"]',
      '[data-pen="Timeline"] [data-pen="Rows"] > div',
      '[data-pen="Team"] [data-pen="Title"]',
      '[data-pen="Team"] [data-pen="Row"] > div',
      '[data-pen="Mission Band"] [data-pen="Eyebrow"]',
      '[data-pen="Mission Band"] [data-pen="Mission"]',
      '[data-pen="Mission Band"] [data-pen="Ghost"]',
    ],
    plates: ['[data-pen="Story"] [data-pen="Photo"]'],
    rules: ['[data-pen="Team"] [data-pen="Rule"]'],
    rows: ['[data-pen="Timeline"] [data-pen="Rows"] > div'],
    press: ['[data-pen="Mission Band"] [data-pen="Ghost"]'],
    extra: [
      // human touch
      ['[data-pen="Story"] [data-pen="Photo"]', "mo-depth mo-grey"],
      [
        '[data-pen="Timeline"] [data-pen="Rows"] > div',
        "mo-border-draw mo-info-row",
      ],
      ['[data-pen="Timeline"] [data-pen="Rows"]', "mo-stagger"],
      ['[data-pen="Team"] [data-pen="Row"] > div', "mo-tilt mo-card-hover"],
      ['[data-pen="Team"] [data-pen="Row"] [data-pen="Photo"]', "mo-grey"],
      ['[data-pen="Team"] [data-pen="Row"]', "mo-stagger"],
      [
        '[data-pen="Mission Band"] [data-pen="Ghost"]',
        "mo-magnet mo-sweep-ghost",
      ],
      ['[data-pen="Header"] [data-pen="Title"]', "mo-scramble"],
      ['[data-pen="Eyebrow"] [data-pen="Dot"]', "mo-dot-pulse"],
    ],
  },
};

/** resolve a recipe into concrete rules, in the right cascade order */
export function recipeFor(page: string): Rule[] {
  const r: Recipe = { ...EMPTY, ...(RECIPES[page] ?? {}) };
  const out: Rule[] = [...SHARED];

  // chrome first, then structure, then the pointer-reactive bits
  for (const s of r.reveal) out.push([s, REVEAL]);
  for (const s of r.scrims) out.push([s, "mo-fade-slow"]);
  for (const s of r.heroes) out.push([s, "mo-hero-art"]);
  for (const s of r.plates) out.push([s, PLATE]);
  for (const s of r.rules) out.push([s, RULE]);
  for (const s of r.cards) out.push([s, "mo-card"]);
  for (const s of r.rows) out.push([s, "mo-row"]);
  for (const s of r.press) out.push([s, "mo-press"]);
  for (const s of r.chips) out.push([s, "mo-chip"]);
  for (const e of r.extra) out.push(e);

  return out;
}

/* ------------------------------------------------------------------ *
 * The hook: decorate the page once it mounts, then observe it.
 * ------------------------------------------------------------------ */
export function useMotion(page: string, deps: unknown[] = [], enabled = true) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    // the curtain is still down: decorating now would play the entrance
    // where nobody can see it
    if (!enabled) return;

    const reduced = prefersReduced();

    // 1. paint the classes on
    const animated: HTMLElement[] = [];
    for (const [sel, cls] of recipeFor(page)) {
      let nodes: Element[] = [];
      try {
        nodes = Array.from(root.querySelectorAll(sel));
      } catch {
        continue; // an unsupported selector must never break the page
      }
      for (const el of nodes) {
        if (!(el instanceof HTMLElement)) continue;
        add(el, ...cls.split(" "));
        if (cls.includes("mo")) animated.push(el);
      }
    }

    // 2. stagger siblings that share a parent, so groups cascade
    const byParent = new Map<Element, HTMLElement[]>();
    for (const el of animated) {
      const p = el.parentElement;
      if (!p) continue;
      const list = byParent.get(p) ?? [];
      list.push(el);
      byParent.set(p, list);
    }
    for (const list of byParent.values()) {
      if (list.length < 2) continue;
      list.forEach((el, i) => {
        if (!el.style.getPropertyValue("--mo-d")) stagger(el, i);
      });
    }

    setReady(true);

    if (reduced) {
      for (const el of animated) el.classList.add("is-in");
      return;
    }

    // 3. reveal on scroll. Plates wipe in earlier than text so the eye
    //    reads image → caption, the way a wall label works.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.classList.add("is-in");
          io.unobserve(el); // reveal once; never re-hide
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 },
    );

    // observe every decorated element, plus a couple of compound selectors
    const toObserve = new Set<Element>(animated);
    for (const sel of [
      ".mo-plate",
      ".mo-rule",
      ".mo-hero-art",
      ".mo-map-x",
      ".mo-map-y",
      ".mo-map-pop",
      ".mo-map-pin",
      ".mo-fade-slow",
      ".mo-spot",
    ]) {
      root.querySelectorAll(sel).forEach((el) => toObserve.add(el));
    }
    toObserve.forEach((el) => io.observe(el));

    // 4. pointer spotlight on the big interactive surfaces
    const cleanups: Array<() => void> = [];
    root.querySelectorAll<HTMLElement>(".mo-card, .mo-row").forEach((el) => {
      const move = (ev: PointerEvent) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mo-mx", `${ev.clientX - r.left}px`);
        el.style.setProperty("--mo-my", `${ev.clientY - r.top}px`);
      };
      el.addEventListener("pointermove", move);
      cleanups.push(() => el.removeEventListener("pointermove", move));
    });

    return () => {
      io.disconnect();
      for (const fn of cleanups) fn();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, ...deps]);

  return { ref, ready };
}

/* ------------------------------------------------------------------ *
 * Make a whole generated page block interactive.
 *
 * The generator emits plain <div>s, so cards and rows are not focusable and
 * have no pointer cursor. This walks the decorated nodes and upgrades the
 * ones that behave like controls into real buttons, WITHOUT touching a
 * single class or the DOM order.
 * ------------------------------------------------------------------ */
export function useInteractive(
  rootRef: React.RefObject<HTMLDivElement | null>,
  enabled = true,
) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !enabled) return;

    const made: Array<{ el: HTMLElement; tab: string | null }> = [];

    const upgrade = (el: HTMLElement, label: string) => {
      if (el.dataset.moButton === "1") return;
      el.dataset.moButton = "1";
      el.setAttribute("role", "button");
      el.setAttribute("tabindex", "0");
      if (!el.getAttribute("aria-label")) el.setAttribute("aria-label", label);

      const key = (ev: KeyboardEvent) => {
        if (ev.key !== "Enter" && ev.key !== " ") return;
        ev.preventDefault();
        el.click();
      };
      el.addEventListener("keydown", key);

      made.push({ el, tab: "0" });
    };

    root.querySelectorAll<HTMLElement>(".mo-card").forEach((el) => {
      const title =
        el.querySelector('[data-pen="Title"]')?.textContent?.trim() ??
        el.querySelector('[data-pen="T"]')?.textContent?.trim() ??
        "Open";
      upgrade(el, title);
    });

    root.querySelectorAll<HTMLElement>(".mo-chip").forEach((el) => {
      upgrade(el, el.textContent?.trim() || "Filter");
    });

    root.querySelectorAll<HTMLElement>(".mo-press").forEach((el) => {
      upgrade(el, el.textContent?.trim() || "Action");
    });

    return () => {
      for (const { el } of made) {
        el.removeAttribute("role");
        el.removeAttribute("tabindex");
        delete el.dataset.moButton;
      }
    };
  }, [rootRef, enabled]);
}
