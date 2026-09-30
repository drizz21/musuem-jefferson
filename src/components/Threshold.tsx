import { useEffect, useState } from "react";

/**
 * The Threshold — the museum's first-visit opening.
 *
 * The idea is a pair of tall paper doors, like the ones at the entrance to a
 * gallery. They are closed when you arrive; a hairline seam draws across the
 * middle, the wordmark rises letter by letter out of the seam, and then the
 * two panels part — one up, one down — to let the visitor in.
 *
 * It plays once per browser session (`sessionStorage`), so navigating between
 * pages never re-triggers it; the lighter Veil Wipe handles those instead.
 * With `prefers-reduced-motion` it never renders at all.
 *
 * Nothing here touches the page design: the overlay is a fixed-position
 * sibling, and it removes itself completely when it is done.
 */

const SEEN = "jefferson:threshold";

const WORD = "JEFFERSON";
const SUB = "MUSEUM OF ART";

/** runs before React paints, so the curtain never flashes on a repeat visit */
export function shouldPlayThreshold() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    if (sessionStorage.getItem(SEEN) === "1") return false;
    sessionStorage.setItem(SEEN, "1");
    return true;
  } catch {
    return true; // private mode: still show it, just without the memo
  }
}

type Phase = "shut" | "seam" | "part" | "done";

export default function Threshold({ play }: { play: boolean }) {
  const [phase, setPhase] = useState<Phase>(play ? "shut" : "done");

  useEffect(() => {
    if (!play) return;

    // 1. the seam draws across the closed doors
    const t1 = window.setTimeout(() => setPhase("seam"), 120);
    // 2. the doors part
    const t2 = window.setTimeout(() => setPhase("part"), 1500);
    // 3. the overlay is gone from the DOM entirely
    const t3 = window.setTimeout(() => setPhase("done"), 2600);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [play]);

  if (phase === "done") return null;

  return (
    <div className="intro" data-state={phase} aria-hidden="true">
      <div className="intro__panel intro__panel--top" />
      <div className="intro__panel intro__panel--bottom" />
      <div className="intro__seam" />
      <div className="intro__word">
        <div className="intro__letters">
          {WORD.split("").map((ch, i) => (
            <span
              key={`${ch}-${i}`}
              className="intro__letter font-display text-[64px] font-medium tracking-[0.18em] text-[var(--color-ink)] md:text-[92px]"
              style={{ "--i": i } as React.CSSProperties}
            >
              {ch}
            </span>
          ))}
        </div>
        <div className="intro__sub font-body text-[10px] font-semibold tracking-[4px] text-[var(--color-ink-3)]">
          {SUB}
        </div>
      </div>
    </div>
  );
}
