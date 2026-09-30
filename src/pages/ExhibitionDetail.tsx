import { useParams, Navigate } from "react-router-dom";
import { getExhibition } from "../exhibitions";

export default function ExhibitionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const exhibition = slug ? getExhibition(slug) : null;

  if (!exhibition) {
    return <Navigate to="/exhibitions" replace />;
  }

  return (
    <div
      data-pen="Exhibition / Detail"
      className="responsive-page box-border w-full max-w-[1440px] mx-auto relative h-fit flex flex-col gap-0 justify-start items-start bg-[var(--color-bg)] overflow-hidden"
    >
      {/* Breadcrumbs */}
      <div
        data-pen="Crumbs"
        className="[box-sizing:content-box] w-[1440px] h-[68.5px] shrink-0 flex flex-row gap-[10px] p-[28px_96px] justify-start items-center [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:var(--color-line)] [margin:0px_0px_-0.5px_0px]"
      >
        <div
          data-pen="A"
          className="text-[11px]/[normal] box-border text-[var(--color-ink-3)] font-body font-normal tracking-[1.2px] text-left [white-space:nowrap]"
        >
          EXHIBITIONS
        </div>
        <div
          data-pen="Sep"
          className="text-[11px]/[normal] box-border text-[var(--color-ink-3)] font-body font-normal text-left [white-space:nowrap]"
        >
          /
        </div>
        <div
          data-pen="B"
          className="text-[11px]/[normal] box-border text-[var(--color-ink)] font-body font-normal tracking-[1.2px] text-left [white-space:nowrap]"
        >
          {exhibition.title.toUpperCase()}
        </div>
      </div>

      {/* Hero Artwork */}
      <div
        data-pen="Artwork Hero"
        className="box-border w-full h-[760px] shrink-0 overflow-hidden relative"
      >
        <div
          data-pen="Hero Art"
          className="box-border w-[1440px] h-[760px] absolute left-0 top-0 flex flex-row gap-0 justify-start items-start bg-no-repeat bg-cover bg-center [z-index:0]"
          style={{ backgroundImage: `url('${exhibition.heroImage}')` }}
        />
        <div
          data-pen="Plate"
          className="text-[11px]/[normal] box-border absolute left-[96px] top-[700px] text-[var(--color-surface-warm)] font-body font-normal tracking-[1.6px] text-left [white-space:nowrap] [z-index:1]"
        >
          {exhibition.heroCaption}
        </div>
      </div>

      {/* Title Block */}
      <div
        data-pen="Title Block"
        className="box-border w-full h-fit shrink-0 flex flex-row gap-[96px] p-[76px_96px] justify-between items-start"
      >
        <div
          data-pen="Left"
          className="box-border w-[700px] shrink-0 h-fit flex flex-col gap-[22px] justify-start items-start"
        >
          <div
            data-pen="Tag"
            className="box-border w-fit h-fit shrink-0 flex flex-row gap-0 p-[9px_18px] justify-start items-center bg-[var(--color-ink)] [outline:1px_solid_var(--color-ink)] [outline-offset:-0.5px] rounded-[999px]"
          >
            <div
              data-pen="Label"
              className="text-[11px]/[normal] box-border text-[var(--color-on-dark)] font-body font-normal tracking-[0.6px] text-left [white-space:nowrap]"
            >
              {exhibition.status}
            </div>
          </div>
          <div
            data-pen="Title"
            className="text-[92px]/[88px] box-border w-full text-[var(--color-ink)] font-display font-normal text-left"
          >
            {exhibition.title}
          </div>
          <div
            data-pen="Sub"
            className="text-[18px]/[31px] box-border w-full text-[var(--color-ink-2)] font-body font-normal text-left"
          >
            {exhibition.curatorStatement}
          </div>
        </div>

        {/* Right Info Panel */}
        <div
          data-pen="Right"
          className="box-border w-[380px] shrink-0 h-fit flex flex-col gap-0 justify-start items-start"
        >
          <div
            data-pen="Dates"
            className="[box-sizing:content-box] w-[380px] h-[75.5px] shrink-0 flex flex-col gap-[6px] p-[18px_0px] justify-start items-start [border-width:1px_0px_0px_0px] [border-style:solid] [border-color:var(--color-line)] [margin:-0.5px_0px_0px_0px]"
          >
            <div
              data-pen="K"
              className="text-[10px]/[normal] box-border text-[var(--color-ink-3)] font-body font-semibold tracking-[1.5px] text-left [white-space:nowrap]"
            >
              DATES
            </div>
            <div
              data-pen="V"
              className="text-[14px]/[22px] box-border w-full text-[var(--color-ink)] font-body font-normal text-left"
            >
              {exhibition.dates}
            </div>
          </div>

          <div
            data-pen="Location"
            className="[box-sizing:content-box] w-[380px] h-[75.5px] shrink-0 flex flex-col gap-[6px] p-[18px_0px] justify-start items-start [border-width:1px_0px_0px_0px] [border-style:solid] [border-color:var(--color-line)] [margin:-0.5px_0px_0px_0px]"
          >
            <div
              data-pen="K"
              className="text-[10px]/[normal] box-border text-[var(--color-ink-3)] font-body font-semibold tracking-[1.5px] text-left [white-space:nowrap]"
            >
              LOCATION
            </div>
            <div
              data-pen="V"
              className="text-[14px]/[22px] box-border w-full text-[var(--color-ink)] font-body font-normal text-left"
            >
              {exhibition.location}
            </div>
          </div>

          <div
            data-pen="Hours"
            className="[box-sizing:content-box] w-[380px] h-[75.5px] shrink-0 flex flex-col gap-[6px] p-[18px_0px] justify-start items-start [border-width:1px_0px_0px_0px] [border-style:solid] [border-color:var(--color-line)] [margin:-0.5px_0px_0px_0px]"
          >
            <div
              data-pen="K"
              className="text-[10px]/[normal] box-border text-[var(--color-ink-3)] font-body font-semibold tracking-[1.5px] text-left [white-space:nowrap]"
            >
              HOURS
            </div>
            <div
              data-pen="V"
              className="text-[14px]/[22px] box-border w-full text-[var(--color-ink)] font-body font-normal text-left"
            >
              Tuesday – Sunday, 10:00 – 18:00
            </div>
          </div>

          <div
            data-pen="Tickets"
            className="[box-sizing:content-box] w-[380px] h-[75.5px] shrink-0 flex flex-col gap-[6px] p-[18px_0px] justify-start items-start [border-width:1px_0px_0px_0px] [border-style:solid] [border-color:var(--color-line)] [margin:-0.5px_0px_0px_0px]"
          >
            <div
              data-pen="K"
              className="text-[10px]/[normal] box-border text-[var(--color-ink-3)] font-body font-semibold tracking-[1.5px] text-left [white-space:nowrap]"
            >
              TICKETS
            </div>
            <div
              data-pen="V"
              className="text-[14px]/[22px] box-border w-full text-[var(--color-ink)] font-body font-normal text-left"
            >
              £18 adults · free for members and under-18s
            </div>
          </div>

          <div
            data-pen="Curator"
            className="[box-sizing:content-box] w-[380px] h-[75.5px] shrink-0 flex flex-col gap-[6px] p-[18px_0px] justify-start items-start [border-width:1px_0px_0px_0px] [border-style:solid] [border-color:var(--color-line)] [margin:-0.5px_0px_0px_0px]"
          >
            <div
              data-pen="K"
              className="text-[10px]/[normal] box-border text-[var(--color-ink-3)] font-body font-semibold tracking-[1.5px] text-left [white-space:nowrap]"
            >
              {exhibition.curatorTitle}
            </div>
            <div
              data-pen="V"
              className="text-[14px]/[22px] box-border w-full text-[var(--color-ink)] font-body font-normal text-left"
            >
              {exhibition.curatorName}
            </div>
          </div>

          <div
            data-pen="Book"
            className="box-border w-fit h-fit shrink-0 flex flex-row gap-0 p-[24px_0px_0px_0px] justify-start items-start"
          >
            <div
              data-pen="BookBtn"
              className="box-border w-fit shrink-0 h-fit flex flex-row gap-[10px] p-[16px_28px] justify-start items-center bg-[var(--color-accent)] rounded-[2px]"
            >
              <div
                data-pen="Label"
                className="text-[11px]/[normal] box-border text-[var(--color-on-dark)] font-body font-semibold tracking-[1.4px] text-left [white-space:nowrap]"
              >
                BOOK TICKETS
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statement */}
      <div
        data-pen="Statement"
        className="box-border w-full h-fit shrink-0 flex flex-row gap-[96px] p-[40px_96px_110px_96px] justify-between items-start"
      >
        <div
          data-pen="Copy"
          className="box-border w-[680px] shrink-0 h-fit flex flex-col gap-[26px] justify-start items-start"
        >
          <div
            data-pen="Eyebrow"
            className="box-border w-fit h-fit shrink-0 flex flex-row gap-[10px] justify-start items-center"
          >
            <div
              data-pen="Dot"
              className="box-border w-[6px] shrink-0 h-[6px] flex flex-row gap-0 justify-start items-start bg-[var(--color-accent)] rounded-[3px]"
            />
            <div
              data-pen="Label"
              className="text-[11px]/[normal] box-border text-[var(--color-ink-2)] font-body font-semibold tracking-[1.6px] text-left [white-space:nowrap]"
            >
              CURATORIAL STATEMENT
            </div>
          </div>
          <div
            data-pen="Lead"
            className="text-[34px]/[46px] box-border w-full text-[var(--color-ink)] font-display font-normal text-left"
          >
            {exhibition.curatorStatement}
          </div>
          <div
            data-pen="Body"
            className="text-[15px]/[29px] box-border w-full text-[var(--color-ink-2)] font-body font-normal text-left"
            style={{ whiteSpace: "pre-line" }}
          >
            {exhibition.curatorBody}
          </div>
        </div>

        {/* Artist */}
        <div
          data-pen="Artist"
          className="box-border w-[420px] shrink-0 h-fit flex flex-col gap-[20px] justify-start items-start"
        >
          <div
            data-pen="Portrait"
            className="box-border w-full h-[340px] shrink-0 flex flex-row gap-0 justify-start items-start bg-no-repeat bg-cover bg-center"
            style={{ backgroundImage: `url('${exhibition.artistPortrait}')` }}
          />
          <div
            data-pen="Name"
            className="text-[28px]/[normal] box-border text-[var(--color-ink)] font-display font-normal text-left [white-space:nowrap]"
          >
            {exhibition.artistName}
          </div>
          <div
            data-pen="Bio"
            className="text-[13px]/[23px] box-border w-full text-[var(--color-ink-2)] font-body font-normal text-left"
          >
            {exhibition.artistBio}
          </div>
        </div>
      </div>
    </div>
  );
}
