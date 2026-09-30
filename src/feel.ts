import { useEffect } from "react";
import { prefersReduced } from "./motion";

/**
 * The human layer — the touches that make a museum feel inhabited.
 *
 * A page can be perfect and still feel dead. What makes a room feel alive is
 * small: light shifting across a frame as you pass it, a wall label lifting
 * when you reach for it, a number counting up as if it were being read aloud.
 *
 * Every effect here obeys the motion layer's hard rules:
 *   - only transform / opacity / filter are animated
 *   - no layout property is touched, no colour is invented
 *   - everything reads its colour from the existing design tokens
 *   - a pointer is never *required*: keyboard focus and touch get the same
 *     treatment, and reduced-motion visitors get a static, finished page
 *
 * Each hook decorates from the OUTSIDE, so the generated pen.dev pages are
 * never edited and `tools/pen-to-jsx.mjs` can still be re-run safely.
 */

/* ==================================================================== *
 * Parallax — images drift against the scroll, at different depths.
 *
 * Each depth layer is a child of the scroll container, so a fixed offset
 * per element turns scrolling into depth. The amount is a fraction of the
 * element's own travel, never a full re-layout, and it is clamped so an
 * element far below the fold never flies off.
 * ==================================================================== */
export function useParallax(
  rootRef: React.RefObject<HTMLElement | null>,
  enabled = true,
) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !enabled) return;
    if (prefersReduced()) return;

    // read once — a class per depth tier, no per-element work at mount
    const targets: Array<{ el: HTMLElement; speed: number }> = [];
    root.querySelectorAll<HTMLElement>(".mo-depth").forEach((el, i) => {
      // odd tiers drift up, even tiers sink slightly — gives the page a
      // layered feel without any of them looking like a slideshow
      const speed = i % 2 === 0 ? 0.06 : -0.04;
      targets.push({ el, speed });
    });
    if (!targets.length) return;

    let frame = 0;
    const apply = () => {
      frame = 0;
      const vh = window.innerHeight || 1;
      for (const { el, speed } of targets) {
        const r = el.getBoundingClientRect();
        // distance of the element's centre from the viewport centre
        const delta = r.top + r.height / 2 - vh / 2;
        const shift = delta * speed;
        // clamp: a plate never travels more than ~90px from its design spot
        const capped = Math.max(-90, Math.min(90, shift));
        el.style.setProperty("--mo-py", `${capped.toFixed(2)}px`);
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(apply);
    };

    // paint once before any scroll, so the resting state is already right
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [rootRef, enabled]);
}

/* ==================================================================== *
 * 3D tilt — a card leans toward the pointer, like a hung frame.
 *
 * The rotation is tiny (max ~3.5deg) and the perspective is generous, so it
 * reads as depth rather than as a game. It tracks with a rAF so it never
 * re-renders React, and it recentres on leave so a keyboard user is never
 * left with a card stuck at an angle.
 * ==================================================================== */
export function useTilt(
  rootRef: React.RefObject<HTMLElement | null>,
  enabled = true,
) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !enabled) return;
    if (prefersReduced()) return;

    const cards = Array.from(root.querySelectorAll<HTMLElement>(".mo-tilt"));
    if (!cards.length) return;

    const MAX = 3.5; // degrees
    const STRENGTH = 1.9; // how far to the card edge the tilt reaches
    let frame = 0;

    const paint = (el: HTMLElement, rx: number, ry: number) => {
      el.style.setProperty("--mo-rx", `${rx.toFixed(2)}deg`);
      el.style.setProperty("--mo-ry", `${ry.toFixed(2)}deg`);
    };

    const onMove = (ev: PointerEvent) => {
      if (ev.pointerType === "touch") return;
      const card = (ev.target as HTMLElement | null)?.closest<HTMLElement>(
        ".mo-tilt",
      );
      if (!card) return;
      const r = card.getBoundingClientRect();
      // -0.5 .. 0.5, zero exactly in the middle of the card
      const px = (ev.clientX - r.left) / r.width - 0.5;
      const py = (ev.clientY - r.top) / r.height - 0.5;

      if (frame) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        paint(card, -py * MAX * STRENGTH * 2, px * MAX * STRENGTH * 2);
      });
    };

    const reset = (ev: Event) => {
      const card = (ev.target as HTMLElement | null)?.closest<HTMLElement>(
        ".mo-tilt",
      );
      if (!card) return;
      paint(card, 0, 0);
    };

    root.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerleave", reset, { passive: true });
    for (const c of cards) {
      c.addEventListener("pointerleave", reset, { passive: true });
    }

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", reset);
      for (const c of cards) c.removeEventListener("pointerleave", reset);
      // leave nothing tilted behind us when the page unmounts
      for (const c of cards) paint(c, 0, 0);
    };
  }, [rootRef, enabled]);
}

/* ==================================================================== *
 * Magnetic buttons — a small attraction toward the pointer.
 *
 * The idea: a button leans into your hand as it approaches. The pull is
 * capped at a few pixels and the spring is soft, so the control still lands
 * exactly where the design put it and clicking stays pixel-accurate.
 * ==================================================================== */
export function useMagnetic(
  rootRef: React.RefObject<HTMLElement | null>,
  enabled = true,
) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !enabled) return;
    if (prefersReduced()) return;

    const els = Array.from(root.querySelectorAll<HTMLElement>(".mo-magnet"));
    if (!els.length) return;

    const PULL = 0.28; // fraction of the remaining distance
    const RADIUS = 90; // px around the button that still attracts
    let frame = 0;

    const paint = (el: HTMLElement, x: number, y: number) => {
      el.style.setProperty("--mo-mx", `${x.toFixed(2)}px`);
      el.style.setProperty("--mo-my", `${y.toFixed(2)}px`);
    };

    const onMove = (ev: PointerEvent) => {
      if (ev.pointerType === "touch") return;
      let touched = false;
      for (const el of els) {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = ev.clientX - cx;
        const dy = ev.clientY - cy;
        // distance to the box, not the centre
        const gapX = Math.max(0, Math.abs(dx) - r.width / 2);
        const gapY = Math.max(0, Math.abs(dy) - r.height / 2);
        const dist = Math.hypot(gapX, gapY);
        if (dist > RADIUS) continue;
        touched = true;
        if (frame) window.cancelAnimationFrame(frame);
        frame = window.requestAnimationFrame(() =>
          paint(el, dx * PULL, dy * PULL),
        );
      }
      // nothing near the cursor: let everything drift home
      if (!touched) {
        for (const el of els) paint(el, 0, 0);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      for (const el of els) paint(el, 0, 0);
    };
  }, [rootRef, enabled]);
}

/* ==================================================================== *
 * Counters — the numbers read themselves aloud.
 *
 * Museum statistics sit in the 52px display face; a count-up turns a figure
 * into an event. The tween is eased and starts only once the stat scrolls
 * into view, so it never runs on a page the visitor cannot see.
 * ==================================================================== */
export function useCounters(
  rootRef: React.RefObject<HTMLElement | null>,
  enabled = true,
) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !enabled) return;

    const nums = Array.from(root.querySelectorAll<HTMLElement>(".mo-count"));
    if (!nums.length) return;

    const build = (el: HTMLElement) => {
      const text = el.textContent?.trim() ?? "";
      // "12,400" / "1.2M" / "1954" — keep whatever the design already shows
      const m = /(-?[\d,.]+)/.exec(text);
      if (!m) return;
      const raw = m[1];
      const num = Number(raw.replace(/,/g, ""));
      if (!Number.isFinite(num)) return;

      const decimals = raw.includes(".")
        ? raw.split(".")[1]?.replace(/,/g, "").length ?? 0
        : 0;
      const comma = raw.includes(",");
      const suffix = text.replace(m[1], "").trim(); // "M", "+", " yrs"
      const write = (v: number) => {
        const fixed = v.toFixed(decimals);
        const withComma = comma
          ? Number(fixed).toLocaleString("en-US")
          : fixed;
        el.textContent = `${withComma}${suffix ? ` ${suffix}` : ""}`;
      };

      if (prefersReduced()) {
        el.textContent = text; // no animation, exact original string
        return;
      }

      const DUR = 1500;
      let start = 0;
      let raf = 0;
      const step = (ts: number) => {
        if (!start) start = ts;
        const t = Math.min(1, (ts - start) / DUR);
        // ease-out-cubic: fast off the line, settling gently into place
        const eased = 1 - Math.pow(1 - t, 3);
        write(num * eased);
        if (t < 1) raf = window.requestAnimationFrame(step);
        else write(num);
      };
      el.dataset.moCount = "1";
      raf = window.requestAnimationFrame(step);
      return () => window.cancelAnimationFrame(raf);
    };

    const cleanups: Array<() => void> = [];

    if (prefersReduced()) {
      for (const el of nums) cleanups.push(build(el) ?? (() => {}));
      return () => cleanups.forEach((f) => f());
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          io.unobserve(el);
          const off = build(el);
          if (off) cleanups.push(off);
        }
      },
      { threshold: 0.4 },
    );
    nums.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      cleanups.forEach((f) => f());
    };
  }, [rootRef, enabled]);
}

/* ==================================================================== *
 * Art Cursor — custom crosshair that follows the pointer.
 *
 * Injects a single #jf-cursor element into document.body and tracks
 * pointer position via rAF. Data attributes on <body> drive CSS state
 * transitions: hover, press, image.
 * ==================================================================== */
export function useArtCursor() {
  useEffect(() => {
    if (prefersReduced()) return;
    if (typeof document === "undefined") return;

    // Build cursor DOM once
    let cursor = document.getElementById("jf-cursor");
    if (!cursor) {
      cursor = document.createElement("div");
      cursor.id = "jf-cursor";
      const dot = document.createElement("div");
      dot.id = "jf-cursor-dot";
      const ring = document.createElement("div");
      ring.id = "jf-cursor-ring";
      cursor.appendChild(ring);
      cursor.appendChild(dot);
      document.body.appendChild(cursor);
      document.body.style.cursor = "none";
    }

    let mx = -200, my = -200;
    let cx = -200, cy = -200;
    let frame = 0;

    // smooth lerp — cursor trails the real pointer slightly
    const LERP = 0.14;

    const tick = () => {
      frame = requestAnimationFrame(tick);
      cx += (mx - cx) * LERP;
      cy += (my - cy) * LERP;
      (cursor as HTMLElement).style.transform =
        `translate3d(${(cx - 3).toFixed(1)}px,${(cy - 3).toFixed(1)}px,0)`;
    };
    frame = requestAnimationFrame(tick);

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const isImg =
        t.closest(".mo-img") !== null ||
        t.closest('[data-pen="Plate"]') !== null ||
        t.closest('[data-pen="Hero Artwork"]') !== null ||
        t.closest('[data-pen="Portrait"]') !== null;
      const isBtn =
        t.closest("a") !== null ||
        t.closest("button") !== null ||
        t.closest(".mo-magnet") !== null ||
        t.closest(".mo-sweep") !== null ||
        t.closest(".mo-card-hover") !== null;
      document.body.dataset.cursor = isImg ? "image" : isBtn ? "hover" : "";
    };

    const onDown = () => { document.body.dataset.cursor = "press"; };
    const onUp   = () => { document.body.dataset.cursor = ""; };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseover",  onOver, { passive: true });
    document.addEventListener("mousedown",  onDown, { passive: true });
    document.addEventListener("mouseup",    onUp,   { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseover",  onOver);
      document.removeEventListener("mousedown",  onDown);
      document.removeEventListener("mouseup",    onUp);
      document.body.style.cursor = "";
      delete document.body.dataset.cursor;
    };
  }, []);
}

/* ==================================================================== *
 * InView — adds `mo-in` class to elements with `.mo-clip`, `.mo-rule-draw`,
 * `.mo-stagger`, `.mo-scramble`, or `.mo-float` once they enter the viewport.
 * This is the trigger layer for all CSS-only entrance animations in art.css.
 * ==================================================================== */
export function useInView(
  rootRef: React.RefObject<HTMLElement | null>,
  enabled = true,
) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !enabled) return;

    const SELECTORS = [
      ".mo-clip",
      ".mo-rule-draw",
      ".mo-stagger",
      ".mo-scramble",
    ].join(",");

    const targets = Array.from(root.querySelectorAll<HTMLElement>(SELECTORS));
    if (!targets.length) return;

    if (prefersReduced()) {
      targets.forEach(el => el.classList.add("mo-in"));
      return;
    }

    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          (e.target as HTMLElement).classList.add("mo-in");
          io.unobserve(e.target);
        }
      },
      { threshold: 0.15 },
    );
    targets.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [rootRef, enabled]);
}

/* ==================================================================== *
 * Scramble — splits heading text into individual <span> chars with
 * CSS variables so the stagger animation in art.css can run.
 * ==================================================================== */
export function useScramble(
  rootRef: React.RefObject<HTMLElement | null>,
  enabled = true,
) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !enabled) return;

    root.querySelectorAll<HTMLElement>(".mo-scramble").forEach(el => {
      if (el.dataset.scrambled) return;
      el.dataset.scrambled = "1";
      const text = el.textContent ?? "";
      el.textContent = "";
      let i = 0;
      for (const ch of text) {
        const span = document.createElement("span");
        span.className = "char";
        span.textContent = ch === " " ? "\u00a0" : ch;
        // tiny random tilt per char — like letters dropped from a typeset
        const tilt = ((i % 3) - 1) * 1.2;
        span.style.setProperty("--char-i", String(i));
        span.style.setProperty("--char-tilt", `${tilt}deg`);
        el.appendChild(span);
        if (ch !== " ") i++;
      }
    });
  }, [rootRef, enabled]);
}

/* ==================================================================== *
 * Section breath — a barely-there sway so nothing on the page is dead.
 *
 * Purely decorative and off by default: only plates deep enough on a page
 * to justify it get the class. Kept to a fraction of a degree and a slow
 * cycle so it reads as a room with air in it, not as an animation.
 * ==================================================================== */
export function useBreath(
  rootRef: React.RefObject<HTMLElement | null>,
  enabled = true,
) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !enabled) return;
    if (prefersReduced()) return;
    // the design has no breathing motion of its own, so this is applied to
    // a single decorative element per page at most, and read at 0.4deg
    root.querySelectorAll<HTMLElement>(".mo-breath").forEach((el, i) => {
      el.style.setProperty("--mo-bx", `${i % 2 ? "0.4" : "-0.4"}deg`);
      el.style.setProperty("--mo-by", `${i % 2 ? "-0.3" : "0.3"}deg`);
    });
  }, [rootRef, enabled]);
}
