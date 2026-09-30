import { useEffect } from "react";

/**
 * The caption band.
 *
 * The Collection page spells out its own hover rule in the design:
 *
 *   "Resting state is the work alone. On hover the caption band rises:
 *    title, artist, medium and date — never more than a glance's worth of
 *    information."
 *
 * The grid cards show their caption *below* the plate, so this builds the
 * band the design describes and slides it up over the plate on hover and on
 * keyboard focus. It is absolutely positioned inside the plate, so no layout
 * box changes — a reveal, not a reflow.
 *
 * Everything it draws reuses values the design already defines: the ink band,
 * on-dark labels, 22px display / 12px body type, 22×24 padding — identical to
 * the design's own "Hover Detail Demo" card. The demo card itself is left
 * exactly as it ships: it is a static illustration of this treatment, so
 * animating it would empty the illustration.
 *
 * The band is added to the Collection grid and to the "Also on view" row on
 * the exhibition page — the two places the design uses this card pattern.
 */

/** artist credits are not in the grid captions; edit here if the real
 *  catalogue differs (the filter chips use the surnames) */
const ARTISTS: Record<string, string> = {
  "Untitled (Ochre Field)": "Marta Solveig",
  "Woman in Profile": "Marta Solveig",
  "Dawn Ridge": "Marta Solveig",
  "Ink Branch": "Kenji Okada",
  "Great Wave Study": "Kenji Okada",
  "Tulips and Peonies": "Kenji Okada",
  "Vessel and Cloth": "Lucia Ruiz",
  "Nocturne in Blue": "Lucia Ruiz",
  "Field of Sienna": "Lucia Ruiz",
  "Marble Torso": "Lucia Ruiz",
  "Fresco Fragment": "Lucia Ruiz",
  "Still Life, Grey Jug": "Lucia Ruiz",
};

/** the arrow from the design's Overlay block */
const ARROW = `
<svg viewBox="0 0 14 14" fill="none" aria-hidden="true" class="w-[22px] h-[22px] shrink-0">
  <path d="M3.95 3.51a.6.6 0 0 0-.13.65.6.6 0 0 0 .55.38h4.5l-2.45 2.45c-1.1 1.1-1.79 1.79-2.06 2.07a.6.6 0 0 0 .79.9c.04-.02.19-.16.48-.43.28-.28.97-.97 2.07-2.06l2.45-2.45v2.21c0 1.48.01 2.25.03 2.31a.6.6 0 0 0 .61.47.6.6 0 0 0 .42-.25l.03-.02a.6.6 0 0 0 .06-.19c.01-.15.02-.38.02-.68V3.55a.6.6 0 0 0-.34-.43.6.6 0 0 0-.09-.04h-3.01c-2 0-3.02.01-3.07.01a.6.6 0 0 0-.12.42Z" fill="var(--color-on-dark)"/>
</svg>`;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** the band markup, mirroring the design's Overlay block */
function bandHTML(title: string, credit: string) {
  return `
    <div class="box-border w-fit shrink-0 h-fit flex flex-col gap-[4px] justify-start items-start">
      <div class="text-[22px]/[normal] box-border text-[var(--color-on-dark)] font-display font-normal text-left">${esc(title)}</div>
      <div class="text-[12px]/[normal] box-border text-[var(--color-on-dark-2)] font-body font-normal text-left">${esc(credit)}</div>
    </div>
    ${ARROW}`;
}

export function useCaptionBands(
  rootRef: React.RefObject<HTMLDivElement | null>,
  enabled = true,
) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !enabled) return;

    const made: HTMLElement[] = [];

    const attach = (plate: HTMLElement, title: string, credit: string) => {
      if (plate.querySelector("[data-mo-band]")) return;
      const band = document.createElement("div");
      band.dataset.moBand = "1";
      // the band carries the same information as the caption below it, so it
      // is decorative for assistive tech
      band.setAttribute("aria-hidden", "true");
      band.className =
        "mo-band box-border absolute left-0 right-0 bottom-0 flex flex-row gap-[16px] p-[22px_24px] justify-between items-center bg-[var(--color-ink)]";
      band.innerHTML = bandHTML(title, credit);
      plate.appendChild(band);
      made.push(band);
    };

    // ---- Collection grid --------------------------------------------------
    for (const plate of root.querySelectorAll<HTMLElement>(
      '[data-pen="Grid"] [data-pen="Plate"]',
    )) {
      const card = plate.parentElement;
      if (!card) continue;
      const title = card.querySelector('[data-pen="Title"]')?.textContent?.trim();
      const sub = card.querySelector('[data-pen="Sub"]')?.textContent?.trim() ?? "";
      if (!title) continue;
      const artist = ARTISTS[title];
      attach(plate, title, artist ? `${artist} · ${sub}` : sub);
    }

    // ---- "Also on view" row on the exhibition page -----------------------
    for (const plate of root.querySelectorAll<HTMLElement>(
      '[data-pen="Also On"] [data-pen="Plate"]',
    )) {
      const card = plate.parentElement;
      if (!card) continue;
      const title = card.querySelector('[data-pen="Title"]')?.textContent?.trim();
      const sub = card.querySelector('[data-pen="Sub"]')?.textContent?.trim() ?? "";
      if (!title) continue;
      attach(plate, title, sub);
    }

    return () => {
      for (const b of made) b.remove();
    };
  }, [rootRef, enabled]);
}
