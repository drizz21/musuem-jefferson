import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

/**
 * NavBar — lifted from the "Nav" component in the pen.dev document.
 *
 * Every class string matches the design exactly; the only changes are that
 * the labels became <Link> elements so routes work, the link row is hidden
 * below md (the design ships a separate 390px artboard for mobile), and the
 * hamburger opens a real mobile drawer.
 */
const LINKS = [
  { label: "Exhibitions", to: "/exhibitions" },
  { label: "Collection", to: "/collection" },
  { label: "Visit", to: "/visit" },
  { label: "About", to: "/about" },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // close the drawer on route change
  useEffect(() => setOpen(false), [location.pathname]);

  // close on Escape, lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div
      data-pen="Nav"
      className="responsive-nav box-border w-full max-w-[1440px] mx-auto h-[88px] shrink-0 flex flex-row gap-0 px-[64px] justify-between items-center bg-[var(--color-bg)]"
    >
      {/* Logo */}
      <Link
        to="/"
        data-pen="Logo"
        className="box-border w-fit shrink-0 h-fit flex flex-row gap-[12px] justify-start items-center"
      >
        <span
          data-pen="Wordmark"
          className="text-[26px]/[normal] box-border text-[var(--color-ink)] font-display font-semibold tracking-[0.4px] text-left whitespace-nowrap"
        >
          JEFFERSON
        </span>
        <span
          data-pen="Sub"
          className="text-[9px]/[normal] box-border text-[var(--color-ink-3)] font-body font-semibold tracking-[2.2px] text-left whitespace-nowrap"
        >
          MUSEUM OF ART
        </span>
      </Link>

      {/* Links (desktop) */}
      <nav
        data-pen="Links"
        className="box-border w-fit shrink-0 h-fit hidden md:flex flex-row gap-[34px] justify-start items-center"
      >
        {LINKS.map(({ label, to }) => (
          <Link
            key={to}
            to={to}
            data-pen={label}
            className="mo-link text-[13px]/[normal] box-border text-[var(--color-ink-2)] font-body font-normal tracking-[0.2px] text-left whitespace-nowrap transition-colors duration-[var(--dur-fast)] hover:text-[var(--color-ink)]"
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* CTA + hamburger */}
      <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-[12px] justify-start items-center">
        <Link
          to="/visit"
          data-pen="CTA"
          className="box-border w-fit shrink-0 h-fit hidden sm:flex flex-row gap-[10px] px-[28px] py-[16px] justify-start items-center bg-[var(--color-accent)] rounded-[2px] transition-colors duration-[var(--dur-fast)] hover:bg-[var(--color-accent-press)]"
        >
          <span
            data-pen="Label"
            className="text-[11px]/[normal] box-border text-[var(--color-on-dark)] font-body font-semibold tracking-[1.4px] text-left whitespace-nowrap"
          >
            TICKETS
          </span>
        </Link>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden w-[44px] h-[44px] -mr-[10px] flex items-center justify-center text-[var(--color-ink)]"
        >
          {open ? (
            <X className="w-[24px] h-[24px]" />
          ) : (
            <Menu className="w-[24px] h-[24px]" />
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          className="nav-backdrop md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
      <div
        className={"nav-drawer md:hidden" + (open ? " nav-drawer-open" : "")}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="nav-drawer-head">
          <span className="text-[11px] font-body font-semibold tracking-[2px] text-[var(--color-ink-3)]">
            MENU
          </span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="w-[44px] h-[44px] flex items-center justify-center -mr-[10px] text-[var(--color-ink)]"
          >
            <X className="w-[24px] h-[24px]" />
          </button>
        </div>
        <nav className="nav-drawer-links">
          {LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className="font-display text-[34px] text-[var(--color-ink)] border-b border-[var(--color-line)] py-[14px] block"
            >
              {label}
            </Link>
          ))}
          <Link
            to="/visit"
            onClick={() => setOpen(false)}
            className="mt-[20px] inline-flex items-center justify-center bg-[var(--color-accent)] text-[var(--color-on-dark)] font-body font-semibold text-[12px] tracking-[1.4px] px-[28px] py-[16px] rounded-[2px]"
          >
            TICKETS
          </Link>
        </nav>
      </div>
    </div>
  );
}
