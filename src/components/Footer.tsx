import { Link } from "react-router-dom";

/**
 * Footer — lifted from the "Footer" component in the pen.dev document.
 *
 * Class strings match the design; the artboard width became `w-full` so the
 * shell can centre it, the top row stacks below `lg`, and the column labels
 * became links.
 */
const COLUMNS = [
  {
    head: "VISIT",
    links: [
      { label: "Hours", to: "/visit" },
      { label: "Tickets", to: "/visit" },
      { label: "Directions", to: "/visit" },
      { label: "Accessibility", to: "/visit" },
    ],
  },
  {
    head: "EXPLORE",
    links: [
      { label: "Exhibitions", to: "/exhibitions" },
      { label: "Collection", to: "/collection" },
      { label: "Journal", to: "/about" },
      { label: "Membership", to: "/about" },
    ],
  },
  {
    head: "CONNECT",
    links: [
      { label: "Newsletter", to: "/about" },
      { label: "Press", to: "/about" },
      { label: "Careers", to: "/about" },
      { label: "Contact", to: "/visit" },
    ],
  },
];

export default function Footer() {
  return (
    <div
      data-pen="Footer"
      className="responsive-footer box-border w-full h-fit shrink-0 flex flex-col gap-[56px] px-[64px] py-[72px] justify-start items-start bg-[var(--color-ink)]"
    >
      {/* Top */}
      <div
        data-pen="Top"
        className="box-border w-full h-fit shrink-0 flex flex-col lg:flex-row gap-[64px] justify-between items-start"
      >
        {/* Brand */}
        <div
          data-pen="Brand"
          className="box-border w-[360px] max-w-full shrink-0 h-fit flex flex-col gap-[18px] justify-start items-start"
        >
          <div
            data-pen="Wordmark"
            className="text-[34px]/[normal] box-border text-[var(--color-on-dark)] font-display font-semibold text-left whitespace-nowrap"
          >
            Jefferson
          </div>
          <p
            data-pen="Blurb"
            className="text-[13px]/[22px] box-border w-full text-[var(--color-on-dark-2)] font-body font-normal text-left"
          >
            A museum of modern and historical art in the heart of the city. Open
            to everyone, always.
          </p>
        </div>

        {/* Cols */}
        <div
          data-pen="Cols"
          className="box-border w-fit shrink-0 h-fit flex flex-row flex-wrap gap-[64px] justify-start items-start"
        >
          {COLUMNS.map((col) => (
            <div
              key={col.head}
              data-pen={col.head}
              className="box-border w-[150px] shrink-0 h-fit flex flex-col gap-[14px] justify-start items-start"
            >
              <div
                data-pen="Head"
                className="text-[10px]/[normal] box-border text-[var(--color-on-dark-2)] font-body font-semibold tracking-[1.6px] text-left whitespace-nowrap"
              >
                {col.head}
              </div>
              {col.links.map(({ label, to }) => (
                <Link
                  key={label}
                  to={to}
                  data-pen={label}
                  className="text-[13px]/[normal] box-border text-[var(--color-on-dark)] font-body font-normal text-left whitespace-nowrap transition-colors duration-[var(--dur-fast)] hover:text-[var(--color-on-dark-3)]"
                >
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div
        data-pen="Bottom"
        className="box-border w-full h-fit shrink-0 flex flex-row gap-0 pt-[24px] justify-between items-center border-t border-[var(--color-line-dark)]"
      >
        <div
          data-pen="Copy"
          className="text-[12px]/[normal] box-border text-[var(--color-on-dark-2)] font-body font-normal text-left whitespace-nowrap"
        >
          © 2026 Jefferson Museum of Art
        </div>
        <div
          data-pen="Addr"
          className="text-[12px]/[normal] box-border text-[var(--color-on-dark-2)] font-body font-normal text-left whitespace-nowrap"
        >
          12 Kestrel Row, Riverside · Open Tue–Sun 10–18
        </div>
      </div>
    </div>
  );
}
