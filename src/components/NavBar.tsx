import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

/**
 * NavBar — lifted from the "Nav" component in the pen.dev document.
 *
 * Every class string matches the design exactly; the only changes are that
 * the labels became <Link> elements so routes work, and the link row is
 * hidden below md (the design ships a separate 390px artboard for mobile).
 */
const LINKS = [
  { label: "Exhibitions", to: "/exhibitions" },
  { label: "Collection", to: "/collection" },
  { label: "Visit", to: "/visit" },
  { label: "About", to: "/about" },
];

export default function NavBar() {
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

      {/* Links */}
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

      {/* CTA */}
      <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-[12px] justify-start items-center">
        <Link
          to="/visit"
          data-pen="CTA"
          className="box-border w-fit shrink-0 h-fit flex flex-row gap-[10px] px-[28px] py-[16px] justify-start items-center bg-[var(--color-accent)] rounded-[2px] transition-colors duration-[var(--dur-fast)] hover:bg-[var(--color-accent-press)]"
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
          aria-label="Open menu"
          className="md:hidden w-[22px] h-[22px] flex items-center justify-center text-[var(--color-ink)]"
        >
          <Menu className="w-[22px] h-[22px]" />
        </button>
      </div>
    </div>
  );
}
