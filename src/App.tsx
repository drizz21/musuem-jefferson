import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocation, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import MotionPage from "./components/MotionPage";
import Threshold, { shouldPlayThreshold } from "./components/Threshold";
import { Stage } from "./stage";
import Home from "./pages/Home";
import HomeMobile from "./pages/HomeMobile";
import Exhibitions from "./pages/Exhibitions";
import ExhibitionDetail from "./pages/ExhibitionDetail";
import Collection from "./pages/Collection";
import Visit from "./pages/Visit";
import About from "./pages/About";

/**
 * The stage tells the pages when the curtain is up. See ./stage.ts
 */

/**
 * The Veil Wipe — the museum's signature route transition.
 *
 * Timeline (from the Motion section of the design system):
 *   0ms    click, the old page holds still
 *   180ms  a warm paper sheet sweeps up        (ease-veil)
 *   540ms  screen is paper; the route swaps underneath
 *   900ms  veil lifts; content settles, then text rises (+120ms)
 */
function VeilTransition({
  children,
  onStage,
}: {
  children: React.ReactNode;
  onStage: (ready: boolean) => void;
}) {
  const location = useLocation();
  const [phase, setPhase] = useState<"idle" | "in" | "hold" | "out">("idle");
  const [shown, setShown] = useState(children);
  // Path we last rendered content for. Seeded from the current pathname, so a
  // fresh mount never animates — and because this is state (not a ref) it is
  // re-seeded correctly when StrictMode double-mounts in development.
  const [lastPath, setLastPath] = useState(location.pathname);

  useEffect(() => {
    // First render of this path: show it, no veil. Only real navigations animate.
    if (location.pathname === lastPath) {
      setShown(children);
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(children);
      setLastPath(location.pathname);
      return;
    }

    // the curtain is coming down: hold the reveals
    onStage(false);
    setPhase("in");

    const swap = window.setTimeout(() => {
      setShown(children);
      setPhase("hold");
      window.scrollTo({ top: 0 });
    }, 900);

    const lift = window.setTimeout(() => setPhase("out"), 1040);

    // once the veil has lifted, let the new page reveal itself
    const clear = window.setTimeout(() => {
      setPhase("idle");
      setLastPath(location.pathname);
      onStage(true);
    }, 1960);

    return () => {
      window.clearTimeout(swap);
      window.clearTimeout(lift);
      window.clearTimeout(clear);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <>
      <div className="page-enter" key={location.pathname}>
        {shown}
      </div>
      {phase !== "idle" && (
        <div className="veil-overlay" data-phase={phase}>
          <div className="veil-text">
            <div className="veil-wordmark">JEFFERSON</div>
            <div className="veil-sub">MUSEUM OF ART</div>
          </div>
        </div>
      )}
    </>
  );
}

/** the shared chrome: nav, page, footer */
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full flex flex-col bg-[var(--color-bg)]">
      <NavBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  // read once: the curtain shows on the first visit of a session only
  const [playIntro] = useState(() => shouldPlayThreshold());
  const [ready, setReady] = useState(!playIntro);

  // no curtain to wait for — clear the stage on the next frame so the very
  // first paint is the real page, not a flash of dormant content
  useEffect(() => {
    if (!playIntro) return;
    const id = window.setTimeout(() => setReady(true), 2500);
    return () => window.clearTimeout(id);
  }, [playIntro]);

  // a page plus its chrome, wrapped in the veil and the motion layer
  const page = (node: React.ReactNode, name: string) => (
    <Shell>
      <MotionPage page={name}>{node}</MotionPage>
    </Shell>
  );

  const stage = useMemo(() => ready, [ready]);

  return (
    <Stage.Provider value={stage}>
      <Threshold play={playIntro} />
      <VeilTransition onStage={setReady}>
        <Routes>
          <Route path="/" element={page(<Home />, "Home / Landing")} />
          <Route
            path="/exhibitions"
            element={page(<Exhibitions />, "Exhibitions / Index")}
          />
          <Route
            path="/exhibitions/:slug"
            element={page(<ExhibitionDetail />, "Exhibition / Detail")}
          />
          <Route
            path="/collection"
            element={page(<Collection />, "Collection / Gallery")}
          />
          <Route path="/visit" element={page(<Visit />, "Visit")} />
          <Route path="/about" element={page(<About />, "About")} />

          {/* Mobile 390px artboard from the design, kept as a reference route.
              It renders without the shell because it carries its own mobile
              bar and footer. */}
          <Route
            path="/mobile"
            element={
              <MotionPage page="Home / Mobile 390">
                <HomeMobile />
              </MotionPage>
            }
          />
        </Routes>
      </VeilTransition>
    </Stage.Provider>
  );
}
