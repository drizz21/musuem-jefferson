import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMotion, useInteractive } from "../motion";
import { useCollectionFilter } from "../filters";
import { useCaptionBands } from "../captions";
import { useStage } from "../stage";
import {
  useParallax,
  useTilt,
  useMagnetic,
  useCounters,
  useBreath,
  useArtCursor,
  useInView,
  useScramble,
} from "../feel";

/**
 * MotionPage — wraps one generated page and brings it to life.
 *
 * The generated page components are never edited: this wrapper renders them
 * untouched, then decorates the DOM from the outside using the `data-pen`
 * layer names the generator already emits.
 *
 * It also wires the two behaviours the design implies but the export cannot
 * carry: clicking a card or row navigates, and the Collection filter bar
 * actually filters.
 */

/** layer name → the route that layer should open */
const ROUTE: Record<string, string> = {
  "The Long Horizon": "/exhibitions/the-long-horizon",
  "Paper & Pigment": "/exhibitions/paper-and-pigment",
  "Vessel and Cloth": "/exhibitions/vessel-and-cloth",
  "After the Object": "/exhibitions/after-the-object",
  "The Marble Room": "/exhibitions/the-marble-room",
};

export default function MotionPage({
  page,
  children,
}: {
  page: string;
  children: React.ReactNode;
}) {
  const stageReady = useStage();
  const navigate = useNavigate();
  const location = useLocation();
  const [mounted, setMounted] = useState(false);

  // the motion pass only decorates once the curtain is up, so the entrance
  // is never played behind the veil
  const { ref } = useMotion(page, [stageReady], stageReady);
  const filterRef = useCollectionFilter(stageReady);

  // human touch hooks — parallax, tilt, magnet, counter, breath
  useParallax(ref, stageReady && mounted);
  useTilt(ref, stageReady && mounted);
  useMagnetic(ref, stageReady && mounted);
  useCounters(ref, stageReady && mounted);
  useBreath(ref, stageReady && mounted);
  useInView(ref, stageReady && mounted);
  useScramble(ref, stageReady && mounted);
  // cursor is global — mount once from the top-level page wrapper
  useArtCursor();

  useEffect(() => {
    if (!stageReady) return;
    const id = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(id);
  }, [stageReady]);

  useInteractive(ref, mounted);
  useCaptionBands(ref, mounted);

  // one root ref serves both hooks: the motion pass needs it during render,
  // so assign through a callback rather than two competing refs
  const setRefs = (el: HTMLDivElement | null) => {
    (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
    (filterRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
  };

  // click a card / row to open it. Delegated, so it also covers the cards
  // the caption pass creates.
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const onClick = (ev: MouseEvent) => {
      const target = ev.target as HTMLElement | null;
      if (!target) return;
      // let real links and controls do their own thing
      if (target.closest("a, button")) return;

      const hit = target.closest<HTMLElement>(".mo-card, .mo-row");
      if (!hit) return;

      // find the design layer name that carries the route
      const named = [
        hit,
        ...Array.from(hit.querySelectorAll<HTMLElement>("[data-pen]")),
      ];
      for (const el of named) {
        const name = el.getAttribute("data-pen");
        if (name && ROUTE[name]) {
          navigate(ROUTE[name]);
          return;
        }
      }
      // rows on the exhibitions index: use their own title
      const title = hit
        .querySelector('[data-pen="Title"]')
        ?.textContent?.trim();
      if (title && ROUTE[title]) navigate(ROUTE[title]);
    };

    const onKey = (ev: KeyboardEvent) => {
      if (ev.key !== "Enter" && ev.key !== " ") return;
      const hit = ev.target as HTMLElement | null;
      if (
        !hit?.classList.contains("mo-card") &&
        !hit?.classList.contains("mo-row")
      )
        return;
      ev.preventDefault();
      hit.click();
    };

    root.addEventListener("click", onClick);
    root.addEventListener("keydown", onKey);
    return () => {
      root.removeEventListener("click", onClick);
      root.removeEventListener("keydown", onKey);
    };
  }, [navigate, ref, mounted]);

  // the Exhibition Detail page is a single artboard in the design, so any
  // exhibition opens it; scroll to the top when the slug changes
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  return <div ref={setRefs}>{children}</div>;
}
