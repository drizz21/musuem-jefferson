import { useEffect, useRef } from "react";

/**
 * Collection filters — real filtering, applied from the outside.
 *
 * The generated Collection page renders a filter bar (period / medium /
 * artist) and a 12-work grid, but the chips are inert. This hook reads the
 * grid, derives each work's period and medium from the caption the design
 * already shows ("Oil on canvas · 1954"), and hides the works that do not
 * match — without editing the generated file.
 *
 * The `ARTISTS` table is the ONE piece of data not present in the pen
 * document: the grid captions carry a medium and a year, never a name. The
 * names come from the artist chips the design does ship. Edit this table if
 * the real catalogue differs — nothing else needs to change.
 */

const ARTISTS: Record<string, string> = {
  "Untitled (Ochre Field)": "Solveig",
  "Woman in Profile": "Solveig",
  "Dawn Ridge": "Solveig",
  "Ink Branch": "Okada",
  "Great Wave Study": "Okada",
  "Tulips and Peonies": "Okada",
  "Vessel and Cloth": "Ruiz",
  "Nocturne in Blue": "Ruiz",
  "Field of Sienna": "Ruiz",
  "Marble Torso": "Ruiz",
  "Fresco Fragment": "Ruiz",
  "Still Life, Grey Jug": "Ruiz",
};

/** caption substring → the medium chip it belongs to */
const MEDIUM: Array<[string, string]> = [
  ["Oil", "Oil"],
  ["Ink", "Ink"],
  ["Marble", "Sculpture"],
  ["Woodblock", "Sculpture"],
  ["Pigment", "Sculpture"],
];

type Group = "period" | "medium" | "artist";
type Filters = Record<Group, string>;

const NONE: Filters = { period: "All", medium: "All", artist: "All" };

function yearOf(sub: string): number | null {
  const m = /(\d{4})/.exec(sub);
  return m ? Number(m[1]) : null;
}

function periodOf(sub: string): string {
  const y = yearOf(sub);
  if (y === null || y < 1800) return "Older";
  return y < 1900 ? "1800s" : "1900s";
}

function mediumOf(sub: string): string {
  for (const [needle, chip] of MEDIUM) if (sub.includes(needle)) return chip;
  return "Other";
}

export function useCollectionFilter(enabled = true) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || !enabled) return;

    /* ---- 1. read the works the page already renders ------------------- */
    type Work = {
      card: HTMLElement;
      period: string;
      medium: string;
      artist: string;
    };

    const works: Work[] = [];
    for (const plate of root.querySelectorAll<HTMLElement>(
      '[data-pen="Grid"] [data-pen="Plate"]',
    )) {
      const card = plate.parentElement;
      if (!card) continue;
      const title = card.querySelector('[data-pen="Title"]')?.textContent?.trim();
      const sub = card.querySelector('[data-pen="Sub"]')?.textContent?.trim() ?? "";
      if (!title) continue;
      works.push({
        card,
        period: periodOf(sub),
        medium: mediumOf(sub),
        artist: ARTISTS[title] ?? "Other",
      });
    }
    if (!works.length) return;

    /* ---- 2. find the chips, in DOM order, and tag them by group -------
       The bar is laid out as:  PERIODLbl chips… MEDIUMLbl chips…
       ARTISTLbl chips…  Each group repeats an "All" chip, so the label
       dividers are what tell the groups apart. */
    const bar = root.querySelector<HTMLElement>('[data-pen="Filter Bar"]');
    if (!bar) return;

    const HEADINGS: Array<[string, Group]> = [
      ["PERIODLbl", "period"],
      ["MEDIUMLbl", "medium"],
      ["ARTISTLbl", "artist"],
    ];

    const chips: Array<{ el: HTMLElement; group: Group; value: string }> = [];
    let group: Group | null = null;

    for (const child of Array.from(bar.children)) {
      const name = child.getAttribute("data-pen") ?? "";
      const heading = HEADINGS.find(([h]) => h === name);
      if (heading) {
        group = heading[1];
        continue;
      }
      // chips are the pill blocks; dividers/spacers/sort are not
      if (!group) continue;
      if (name.startsWith("Divider") || name === "Spacer") continue;
      if (name === "SortLbl" || name === "SortVal") continue;
      const el = child as HTMLElement;
      chips.push({ el, group, value: el.textContent?.trim() ?? "" });
    }

    if (!chips.length) return;

    /* ---- 3. swap the two chip skins the design already defines --------
       Active  = ink fill + on-dark label   (as the "All shows" chip)
       Resting = surface fill + hairline    (as the other chips) */
    const SKINS: Array<[string, string]> = [
      ["bg-[var(--color-ink)]", "bg-[var(--color-surface)]"],
      ["[outline:1px_solid_var(--color-ink)]", "[outline:1px_solid_var(--color-line)]"],
    ];

    const active: Filters = { ...NONE };

    const paint = () => {
      for (const { el, group: g, value } of chips) {
        const on = active[g] === value;
        for (const [onCls, offCls] of SKINS) {
          el.classList.toggle(onCls, on);
          el.classList.toggle(offCls, !on);
        }
        const label = el.querySelector('[data-pen="Label"]');
        if (label) {
          label.classList.toggle("text-[var(--color-on-dark)]", on);
          label.classList.toggle("text-[var(--color-ink-2)]", !on);
        }
        el.setAttribute("aria-pressed", on ? "true" : "false");
      }

      for (const w of works) {
        const ok =
          (active.period === "All" || w.period === active.period) &&
          (active.medium === "All" || w.medium === active.medium) &&
          (active.artist === "All" || w.artist === active.artist);

        if (ok) {
          w.card.classList.remove("mo-off", "mo-gone");
        } else if (!w.card.classList.contains("mo-gone")) {
          w.card.classList.add("mo-off");
          window.setTimeout(() => {
            if (w.card.classList.contains("mo-off")) w.card.classList.add("mo-gone");
          }, 320);
        }
      }

      // a grid row with nothing left in it should collapse too, so the
      // section spacing stays exactly as designed
      for (const row of root.querySelectorAll<HTMLElement>(
        '[data-pen="Grid"] > div',
      )) {
        const anyLeft = Array.from(row.children).some(
          (c) => !c.classList.contains("mo-gone"),
        );
        row.classList.toggle("mo-gone", !anyLeft);
      }
    };

    const onClick = (ev: Event) => {
      const el = ev.currentTarget as HTMLElement;
      const hit = chips.find((c) => c.el === el);
      if (!hit) return;
      active[hit.group] = hit.value;
      paint();
    };

    for (const { el } of chips) el.addEventListener("click", onClick);
    paint();

    return () => {
      for (const { el } of chips) el.removeEventListener("click", onClick);
    };
  }, [enabled]);

  return ref;
}
