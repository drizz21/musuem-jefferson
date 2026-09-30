export default function Collection() {
  return (
    <div
      data-pen="Collection / Gallery"
      className="responsive-page box-border w-full max-w-[1440px] mx-auto relative h-fit flex flex-col gap-0 justify-start items-start bg-[var(--color-bg)] overflow-hidden"
    >
      <div
        data-pen="Header"
        className="box-border w-full h-fit shrink-0 flex flex-row gap-[80px] p-[80px_96px_44px_96px] justify-between items-end"
      >
        {/* Header */}
        <div
          data-pen="Left"
          className="box-border w-[720px] shrink-0 h-fit flex flex-col gap-[20px] justify-start items-start"
        >
          {/* Left */}
          <div
            data-pen="Eyebrow"
            className="box-border w-fit h-fit shrink-0 flex flex-row gap-[10px] justify-start items-center"
          >
            {/* Eyebrow */}
            <div
              data-pen="Dot"
              className="box-border w-[6px] shrink-0 h-[6px] flex flex-row gap-0 justify-start items-start bg-[var(--color-accent)] rounded-[3px]"
            >
              {/* Dot */}
            </div>
            <div
              data-pen="Label"
              className="text-[11px]/[normal] box-border text-[var(--color-ink-2)] font-body font-semibold tracking-[1.6px] text-left [white-space:nowrap]"
            >
              {/* Label */}
              PERMANENT COLLECTION
            </div>
          </div>
          <div
            data-pen="Title"
            className="text-[84px]/[82px] box-border w-full text-[var(--color-ink)] font-display font-normal text-left"
          >
            {/* Title */}
            The Collection
          </div>
        </div>
        <div
          data-pen="Intro"
          className="text-[15px]/[27px] box-border w-[400px] shrink-0 text-[var(--color-ink-2)] font-body font-normal text-left"
        >
          {/* Intro */}
          1,240 works across six centuries. Browse by period, medium or artist
          or simply scroll.
        </div>
      </div>
      <div
        data-pen="Filter Bar"
        className="[box-sizing:content-box] w-[1440px] h-[74px] shrink-0 flex flex-row gap-[14px] p-[22px_72px] justify-start items-center [border-width:1px_0px_1px_0px] [border-style:solid] [border-color:var(--color-line)] [margin:-0.5px_0px_-0.5px_0px]"
      >
        {/* Filter Bar */}
        <div
          data-pen="PERIODLbl"
          className="text-[10px]/[normal] box-border text-[var(--color-ink-3)] font-body font-semibold tracking-[1.5px] text-left [white-space:nowrap]"
        >
          {/* PERIODLbl */}
          PERIOD
        </div>
        <div
          data-pen="All"
          className="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[9px_18px] justify-start items-center bg-[var(--color-surface)] [outline:1px_solid_var(--color-line)] [outline-offset:-0.5px] rounded-[999px]"
        >
          {/* All */}
          <div
            data-pen="Label"
            className="text-[11px]/[normal] box-border text-[var(--color-ink-2)] font-body font-normal tracking-[0.6px] text-left [white-space:nowrap]"
          >
            {/* Label */}
            All
          </div>
        </div>
        <div
          data-pen="1800s"
          className="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[9px_18px] justify-start items-center bg-[var(--color-surface)] [outline:1px_solid_var(--color-line)] [outline-offset:-0.5px] rounded-[999px]"
        >
          {/* 1800s */}
          <div
            data-pen="Label"
            className="text-[11px]/[normal] box-border text-[var(--color-ink-2)] font-body font-normal tracking-[0.6px] text-left [white-space:nowrap]"
          >
            {/* Label */}
            1800s
          </div>
        </div>
        <div
          data-pen="1900s"
          className="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[9px_18px] justify-start items-center bg-[var(--color-surface)] [outline:1px_solid_var(--color-line)] [outline-offset:-0.5px] rounded-[999px]"
        >
          {/* 1900s */}
          <div
            data-pen="Label"
            className="text-[11px]/[normal] box-border text-[var(--color-ink-2)] font-body font-normal tracking-[0.6px] text-left [white-space:nowrap]"
          >
            {/* Label */}
            1900s
          </div>
        </div>
        <div
          data-pen="Divider0"
          className="box-border w-[1px] shrink-0 h-[22px] bg-[var(--color-line)]"
        >
          {/* Divider0 */}
        </div>
        <div
          data-pen="MEDIUMLbl"
          className="text-[10px]/[normal] box-border text-[var(--color-ink-3)] font-body font-semibold tracking-[1.5px] text-left [white-space:nowrap]"
        >
          {/* MEDIUMLbl */}
          MEDIUM
        </div>
        <div
          data-pen="All"
          className="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[9px_18px] justify-start items-center bg-[var(--color-ink)] [outline:1px_solid_var(--color-ink)] [outline-offset:-0.5px] rounded-[999px]"
        >
          {/* All */}
          <div
            data-pen="Label"
            className="text-[11px]/[normal] box-border text-[var(--color-on-dark)] font-body font-normal tracking-[0.6px] text-left [white-space:nowrap]"
          >
            {/* Label */}
            All
          </div>
        </div>
        <div
          data-pen="Oil"
          className="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[9px_18px] justify-start items-center bg-[var(--color-surface)] [outline:1px_solid_var(--color-line)] [outline-offset:-0.5px] rounded-[999px]"
        >
          {/* Oil */}
          <div
            data-pen="Label"
            className="text-[11px]/[normal] box-border text-[var(--color-ink-2)] font-body font-normal tracking-[0.6px] text-left [white-space:nowrap]"
          >
            {/* Label */}
            Oil
          </div>
        </div>
        <div
          data-pen="Ink"
          className="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[9px_18px] justify-start items-center bg-[var(--color-surface)] [outline:1px_solid_var(--color-line)] [outline-offset:-0.5px] rounded-[999px]"
        >
          {/* Ink */}
          <div
            data-pen="Label"
            className="text-[11px]/[normal] box-border text-[var(--color-ink-2)] font-body font-normal tracking-[0.6px] text-left [white-space:nowrap]"
          >
            {/* Label */}
            Ink
          </div>
        </div>
        <div
          data-pen="Sculpture"
          className="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[9px_18px] justify-start items-center bg-[var(--color-surface)] [outline:1px_solid_var(--color-line)] [outline-offset:-0.5px] rounded-[999px]"
        >
          {/* Sculpture */}
          <div
            data-pen="Label"
            className="text-[11px]/[normal] box-border text-[var(--color-ink-2)] font-body font-normal tracking-[0.6px] text-left [white-space:nowrap]"
          >
            {/* Label */}
            Sculpture
          </div>
        </div>
        <div
          data-pen="Divider1"
          className="box-border w-[1px] shrink-0 h-[22px] bg-[var(--color-line)]"
        >
          {/* Divider1 */}
        </div>
        <div
          data-pen="ARTISTLbl"
          className="text-[10px]/[normal] box-border text-[var(--color-ink-3)] font-body font-semibold tracking-[1.5px] text-left [white-space:nowrap]"
        >
          {/* ARTISTLbl */}
          ARTIST
        </div>
        <div
          data-pen="All"
          className="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[9px_18px] justify-start items-center bg-[var(--color-surface)] [outline:1px_solid_var(--color-line)] [outline-offset:-0.5px] rounded-[999px]"
        >
          {/* All */}
          <div
            data-pen="Label"
            className="text-[11px]/[normal] box-border text-[var(--color-ink-2)] font-body font-normal tracking-[0.6px] text-left [white-space:nowrap]"
          >
            {/* Label */}
            All
          </div>
        </div>
        <div
          data-pen="Solveig"
          className="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[9px_18px] justify-start items-center bg-[var(--color-surface)] [outline:1px_solid_var(--color-line)] [outline-offset:-0.5px] rounded-[999px]"
        >
          {/* Solveig */}
          <div
            data-pen="Label"
            className="text-[11px]/[normal] box-border text-[var(--color-ink-2)] font-body font-normal tracking-[0.6px] text-left [white-space:nowrap]"
          >
            {/* Label */}
            Solveig
          </div>
        </div>
        <div
          data-pen="Okada"
          className="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[9px_18px] justify-start items-center bg-[var(--color-surface)] [outline:1px_solid_var(--color-line)] [outline-offset:-0.5px] rounded-[999px]"
        >
          {/* Okada */}
          <div
            data-pen="Label"
            className="text-[11px]/[normal] box-border text-[var(--color-ink-2)] font-body font-normal tracking-[0.6px] text-left [white-space:nowrap]"
          >
            {/* Label */}
            Okada
          </div>
        </div>
        <div
          data-pen="Ruiz"
          className="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[9px_18px] justify-start items-center bg-[var(--color-surface)] [outline:1px_solid_var(--color-line)] [outline-offset:-0.5px] rounded-[999px]"
        >
          {/* Ruiz */}
          <div
            data-pen="Label"
            className="text-[11px]/[normal] box-border text-[var(--color-ink-2)] font-body font-normal tracking-[0.6px] text-left [white-space:nowrap]"
          >
            {/* Label */}
            Ruiz
          </div>
        </div>
        <div
          data-pen="Divider2"
          className="box-border w-[1px] shrink-0 h-[22px] bg-[var(--color-line)]"
        >
          {/* Divider2 */}
        </div>
        <div
          data-pen="Spacer"
          className="box-border [flex:1_1_0] h-[1px] bg-[var(--color-transparent)]"
        >
          {/* Spacer */}
        </div>
        <div
          data-pen="SortLbl"
          className="text-[11px]/[normal] box-border text-[var(--color-ink-3)] font-body font-normal tracking-[0.8px] text-left [white-space:nowrap]"
        >
          {/* SortLbl */}
          SORT
        </div>
        <div
          data-pen="SortVal"
          className="text-[11px]/[normal] box-border text-[var(--color-ink)] font-body font-semibold tracking-[0.8px] text-left [white-space:nowrap]"
        >
          {/* SortVal */}
          RECENTLY ADDED ▾
        </div>
      </div>
      <div
        data-pen="Grid"
        className="box-border w-full h-fit shrink-0 flex flex-col gap-[64px] p-[64px_96px_120px_96px] justify-start items-start"
      >
        {/* Grid */}
        <div
          data-pen="Row 1"
          className="box-border w-full h-fit shrink-0 flex flex-row gap-[28px] justify-start items-start"
        >
          {/* Row 1 */}
          <div
            data-pen="Untitled (Ochre Field)"
            className="box-border [flex:1_1_0] h-fit flex flex-col gap-[14px] justify-start items-start"
          >
            {/* Untitled (Ochre Field) */}
            <div
              data-pen="Plate"
              className="box-border w-full h-[340px] shrink-0 flex flex-row gap-0 justify-start items-start bg-[url('/images/generated-7.png')] bg-no-repeat bg-cover bg-center"
            >
              {/* Plate */}
            </div>
            <div
              data-pen="Meta"
              className="box-border w-full h-fit shrink-0 flex flex-col gap-[5px] justify-start items-start"
            >
              {/* Meta */}
              <div
                data-pen="Title"
                className="text-[20px]/[normal] box-border w-full text-[var(--color-ink)] font-display font-normal text-left"
              >
                {/* Title */}
                Untitled (Ochre Field)
              </div>
              <div
                data-pen="Sub"
                className="text-[12px]/[normal] box-border w-full text-[var(--color-ink-2)] font-body font-normal text-left"
              >
                {/* Sub */}
                Oil on canvas · 1954
              </div>
            </div>
          </div>
          <div
            data-pen="Vessel and Cloth"
            className="box-border [flex:1_1_0] h-fit flex flex-col gap-[14px] justify-start items-start"
          >
            {/* Vessel and Cloth */}
            <div
              data-pen="Plate"
              className="box-border w-full h-[340px] shrink-0 flex flex-row gap-0 justify-start items-start bg-[url('/images/generated-3.png')] bg-no-repeat bg-cover bg-center"
            >
              {/* Plate */}
            </div>
            <div
              data-pen="Meta"
              className="box-border w-full h-fit shrink-0 flex flex-col gap-[5px] justify-start items-start"
            >
              {/* Meta */}
              <div
                data-pen="Title"
                className="text-[20px]/[normal] box-border w-full text-[var(--color-ink)] font-display font-normal text-left"
              >
                {/* Title */}
                Vessel and Cloth
              </div>
              <div
                data-pen="Sub"
                className="text-[12px]/[normal] box-border w-full text-[var(--color-ink-2)] font-body font-normal text-left"
              >
                {/* Sub */}
                Oil on board · 1921
              </div>
            </div>
          </div>
          <div
            data-pen="Woman in Profile"
            className="box-border [flex:1_1_0] h-fit flex flex-col gap-[14px] justify-start items-start"
          >
            {/* Woman in Profile */}
            <div
              data-pen="Plate"
              className="box-border w-full h-[340px] shrink-0 flex flex-row gap-0 justify-start items-start bg-[url('/images/generated-10.png')] bg-no-repeat bg-cover bg-center"
            >
              {/* Plate */}
            </div>
            <div
              data-pen="Meta"
              className="box-border w-full h-fit shrink-0 flex flex-col gap-[5px] justify-start items-start"
            >
              {/* Meta */}
              <div
                data-pen="Title"
                className="text-[20px]/[normal] box-border w-full text-[var(--color-ink)] font-display font-normal text-left"
              >
                {/* Title */}
                Woman in Profile
              </div>
              <div
                data-pen="Sub"
                className="text-[12px]/[normal] box-border w-full text-[var(--color-ink-2)] font-body font-normal text-left"
              >
                {/* Sub */}
                Oil on canvas · 1878
              </div>
            </div>
          </div>
          <div
            data-pen="Ink Branch"
            className="box-border [flex:1_1_0] h-fit flex flex-col gap-[14px] justify-start items-start"
          >
            {/* Ink Branch */}
            <div
              data-pen="Plate"
              className="box-border w-full h-[340px] shrink-0 flex flex-row gap-0 justify-start items-start bg-[url('/images/generated-9.png')] bg-no-repeat bg-cover bg-center"
            >
              {/* Plate */}
            </div>
            <div
              data-pen="Meta"
              className="box-border w-full h-fit shrink-0 flex flex-col gap-[5px] justify-start items-start"
            >
              {/* Meta */}
              <div
                data-pen="Title"
                className="text-[20px]/[normal] box-border w-full text-[var(--color-ink)] font-display font-normal text-left"
              >
                {/* Title */}
                Ink Branch
              </div>
              <div
                data-pen="Sub"
                className="text-[12px]/[normal] box-border w-full text-[var(--color-ink-2)] font-body font-normal text-left"
              >
                {/* Sub */}
                Ink on paper · 1802
              </div>
            </div>
          </div>
        </div>
        <div
          data-pen="Row 2"
          className="box-border w-full h-fit shrink-0 flex flex-row gap-[28px] justify-start items-start"
        >
          {/* Row 2 */}
          <div
            data-pen="Great Wave Study"
            className="box-border [flex:1_1_0] h-fit flex flex-col gap-[14px] justify-start items-start"
          >
            {/* Great Wave Study */}
            <div
              data-pen="Plate"
              className="box-border w-full h-[340px] shrink-0 flex flex-row gap-0 justify-start items-start bg-[url('/images/generated-6.png')] bg-no-repeat bg-cover bg-center"
            >
              {/* Plate */}
            </div>
            <div
              data-pen="Meta"
              className="box-border w-full h-fit shrink-0 flex flex-col gap-[5px] justify-start items-start"
            >
              {/* Meta */}
              <div
                data-pen="Title"
                className="text-[20px]/[normal] box-border w-full text-[var(--color-ink)] font-display font-normal text-left"
              >
                {/* Title */}
                Great Wave Study
              </div>
              <div
                data-pen="Sub"
                className="text-[12px]/[normal] box-border w-full text-[var(--color-ink-2)] font-body font-normal text-left"
              >
                {/* Sub */}
                Woodblock print · 1831
              </div>
            </div>
          </div>
          <div
            data-pen="Nocturne in Blue"
            className="box-border [flex:1_1_0] h-fit flex flex-col gap-[14px] justify-start items-start"
          >
            {/* Nocturne in Blue */}
            <div
              data-pen="Plate"
              className="box-border w-full h-[340px] shrink-0 flex flex-row gap-0 justify-start items-start bg-[url('/images/generated-4.png')] bg-no-repeat bg-cover bg-center"
            >
              {/* Plate */}
            </div>
            <div
              data-pen="Meta"
              className="box-border w-full h-fit shrink-0 flex flex-col gap-[5px] justify-start items-start"
            >
              {/* Meta */}
              <div
                data-pen="Title"
                className="text-[20px]/[normal] box-border w-full text-[var(--color-ink)] font-display font-normal text-left"
              >
                {/* Title */}
                Nocturne in Blue
              </div>
              <div
                data-pen="Sub"
                className="text-[12px]/[normal] box-border w-full text-[var(--color-ink-2)] font-body font-normal text-left"
              >
                {/* Sub */}
                Oil on canvas · 1948
              </div>
            </div>
          </div>
          <div
            data-pen="Tulips and Peonies"
            className="box-border [flex:1_1_0] h-fit flex flex-col gap-[14px] justify-start items-start"
          >
            {/* Tulips and Peonies */}
            <div
              data-pen="Plate"
              className="box-border w-full h-[340px] shrink-0 flex flex-row gap-0 justify-start items-start bg-[url('/images/generated-1.png')] bg-no-repeat bg-cover bg-center"
            >
              {/* Plate */}
            </div>
            <div
              data-pen="Meta"
              className="box-border w-full h-fit shrink-0 flex flex-col gap-[5px] justify-start items-start"
            >
              {/* Meta */}
              <div
                data-pen="Title"
                className="text-[20px]/[normal] box-border w-full text-[var(--color-ink)] font-display font-normal text-left"
              >
                {/* Title */}
                Tulips and Peonies
              </div>
              <div
                data-pen="Sub"
                className="text-[12px]/[normal] box-border w-full text-[var(--color-ink-2)] font-body font-normal text-left"
              >
                {/* Sub */}
                Oil on canvas · 1899
              </div>
            </div>
          </div>
          <div
            data-pen="Marble Torso"
            className="box-border [flex:1_1_0] h-fit flex flex-col gap-[14px] justify-start items-start"
          >
            {/* Marble Torso */}
            <div
              data-pen="Plate"
              className="box-border w-full h-[340px] shrink-0 flex flex-row gap-0 justify-start items-start bg-[url('/images/generated.png')] bg-no-repeat bg-cover bg-center"
            >
              {/* Plate */}
            </div>
            <div
              data-pen="Meta"
              className="box-border w-full h-fit shrink-0 flex flex-col gap-[5px] justify-start items-start"
            >
              {/* Meta */}
              <div
                data-pen="Title"
                className="text-[20px]/[normal] box-border w-full text-[var(--color-ink)] font-display font-normal text-left"
              >
                {/* Title */}
                Marble Torso
              </div>
              <div
                data-pen="Sub"
                className="text-[12px]/[normal] box-border w-full text-[var(--color-ink-2)] font-body font-normal text-left"
              >
                {/* Sub */}
                Marble · c. 150
              </div>
            </div>
          </div>
        </div>
        <div
          data-pen="Row 3"
          className="box-border w-full h-fit shrink-0 flex flex-row gap-[28px] justify-start items-start"
        >
          {/* Row 3 */}
          <div
            data-pen="Field of Sienna"
            className="box-border [flex:1_1_0] h-fit flex flex-col gap-[14px] justify-start items-start"
          >
            {/* Field of Sienna */}
            <div
              data-pen="Plate"
              className="box-border w-full h-[340px] shrink-0 flex flex-row gap-0 justify-start items-start bg-[url('/images/generated-2.png')] bg-no-repeat bg-cover bg-center"
            >
              {/* Plate */}
            </div>
            <div
              data-pen="Meta"
              className="box-border w-full h-fit shrink-0 flex flex-col gap-[5px] justify-start items-start"
            >
              {/* Meta */}
              <div
                data-pen="Title"
                className="text-[20px]/[normal] box-border w-full text-[var(--color-ink)] font-display font-normal text-left"
              >
                {/* Title */}
                Field of Sienna
              </div>
              <div
                data-pen="Sub"
                className="text-[12px]/[normal] box-border w-full text-[var(--color-ink-2)] font-body font-normal text-left"
              >
                {/* Sub */}
                Oil on canvas · 1951
              </div>
            </div>
          </div>
          <div
            data-pen="Dawn Ridge"
            className="box-border [flex:1_1_0] h-fit flex flex-col gap-[14px] justify-start items-start"
          >
            {/* Dawn Ridge */}
            <div
              data-pen="Plate"
              className="box-border w-full h-[340px] shrink-0 flex flex-row gap-0 justify-start items-start bg-[url('/images/generated-11.png')] bg-no-repeat bg-cover bg-center"
            >
              {/* Plate */}
            </div>
            <div
              data-pen="Meta"
              className="box-border w-full h-fit shrink-0 flex flex-col gap-[5px] justify-start items-start"
            >
              {/* Meta */}
              <div
                data-pen="Title"
                className="text-[20px]/[normal] box-border w-full text-[var(--color-ink)] font-display font-normal text-left"
              >
                {/* Title */}
                Dawn Ridge
              </div>
              <div
                data-pen="Sub"
                className="text-[12px]/[normal] box-border w-full text-[var(--color-ink-2)] font-body font-normal text-left"
              >
                {/* Sub */}
                Oil on canvas · 1884
              </div>
            </div>
          </div>
          <div
            data-pen="Fresco Fragment"
            className="box-border [flex:1_1_0] h-fit flex flex-col gap-[14px] justify-start items-start"
          >
            {/* Fresco Fragment */}
            <div
              data-pen="Plate"
              className="box-border w-full h-[340px] shrink-0 flex flex-row gap-0 justify-start items-start bg-[url('/images/generated-2.png')] bg-no-repeat bg-cover bg-center"
            >
              {/* Plate */}
            </div>
            <div
              data-pen="Meta"
              className="box-border w-full h-fit shrink-0 flex flex-col gap-[5px] justify-start items-start"
            >
              {/* Meta */}
              <div
                data-pen="Title"
                className="text-[20px]/[normal] box-border w-full text-[var(--color-ink)] font-display font-normal text-left"
              >
                {/* Title */}
                Fresco Fragment
              </div>
              <div
                data-pen="Sub"
                className="text-[12px]/[normal] box-border w-full text-[var(--color-ink-2)] font-body font-normal text-left"
              >
                {/* Sub */}
                Pigment on plaster · c. 1320
              </div>
            </div>
          </div>
          <div
            data-pen="Still Life, Grey Jug"
            className="box-border [flex:1_1_0] h-fit flex flex-col gap-[14px] justify-start items-start"
          >
            {/* Still Life, Grey Jug */}
            <div
              data-pen="Plate"
              className="box-border w-full h-[340px] shrink-0 flex flex-row gap-0 justify-start items-start bg-[url('/images/generated-3.png')] bg-no-repeat bg-cover bg-center"
            >
              {/* Plate */}
            </div>
            <div
              data-pen="Meta"
              className="box-border w-full h-fit shrink-0 flex flex-col gap-[5px] justify-start items-start"
            >
              {/* Meta */}
              <div
                data-pen="Title"
                className="text-[20px]/[normal] box-border w-full text-[var(--color-ink)] font-display font-normal text-left"
              >
                {/* Title */}
                Still Life, Grey Jug
              </div>
              <div
                data-pen="Sub"
                className="text-[12px]/[normal] box-border w-full text-[var(--color-ink-2)] font-body font-normal text-left"
              >
                {/* Sub */}
                Oil on board · 1924
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        data-pen="Hover Detail Demo"
        className="box-border w-full h-fit shrink-0 flex flex-row gap-[64px] p-[0px_96px_110px_96px] justify-start items-center"
      >
        {/* Hover Detail Demo */}
        <div
          data-pen="Card"
          className="box-border w-[520px] shrink-0 h-fit flex flex-col gap-0 justify-start items-start"
        >
          {/* Card */}
          <div
            data-pen="Plate"
            className="box-border w-full h-[460px] shrink-0 flex flex-row gap-0 justify-start items-start bg-[url('/images/generated-7.png')] bg-no-repeat bg-cover bg-center"
          >
            {/* Plate */}
          </div>
          <div
            data-pen="Overlay"
            className="box-border w-full h-fit shrink-0 flex flex-row gap-[16px] p-[22px_24px] justify-between items-center bg-[var(--color-ink)]"
          >
            {/* Overlay */}
            <div
              data-pen="L"
              className="box-border w-fit shrink-0 h-fit flex flex-col gap-[4px] justify-start items-start"
            >
              {/* L */}
              <div
                data-pen="T"
                className="text-[22px]/[normal] box-border text-[var(--color-on-dark)] font-display font-normal text-left [white-space:nowrap]"
              >
                {/* T */}
                Untitled (Ochre Field)
              </div>
              <div
                data-pen="S"
                className="text-[12px]/[normal] box-border text-[var(--color-on-dark-2)] font-body font-normal text-left [white-space:nowrap]"
              >
                {/* S */}
                Marta Solveig · Oil on canvas · 1954
              </div>
            </div>
            <svg
              data-pen="Arrow"
              data-icon-name="arrow-up-right"
              data-icon-set="lucide"
              viewBox="0 0 13.99993896484375 14"
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
              className="box-border w-[22px] shrink-0 h-[22px]"
            >
              <path
                d="M3.94775 3.51367q-0.14014 0.04102-0.25976 0.15381-0.11963 0.11279-0.16065 0.25293-0.05469 0.19482 0.02735 0.39307 0.08545 0.19482 0.25293 0.29394 0.08545 0.02734 0.19482 0.04102 0.1709 0.01367 0.65967 0.02734l3.83496 0-2.45068 2.45068q-1.65088 1.65088-2.05762 2.07129-0.40332 0.42041-0.43408 0.4751-0.10938 0.23926-0.01367 0.46485 0.09912 0.22217 0.32128 0.32128 0.22559 0.0957 0.46485-0.01367 0.05469-0.03076 0.4751-0.43408 0.42041-0.40674 2.07129-2.05762l2.45068-2.45068 0 2.21143q0 2.2251 0.02734 2.31054 0.02734 0.18115 0.15381 0.29395 0.19824 0.19482 0.46143 0.17431 0.2666-0.02051 0.42041-0.24609l0.02734-0.02734q0.04443-0.05469 0.05811-0.18116 0.01367-0.15381 0.02734-0.68701l0-5.37646-0.04102-0.09571q-0.02734-0.11279-0.12646-0.21191-0.09912-0.09912-0.21192-0.12646l-0.0957-0.04102-3.01123 0q-2.99414 0-3.06592 0.01367z"
                fill="var(--color-on-dark)"
              ></path>
            </svg>
          </div>
        </div>
        <div
          data-pen="Explain"
          className="box-border w-[560px] shrink-0 h-fit flex flex-col gap-[20px] justify-center items-start"
        >
          {/* Explain */}
          <div
            data-pen="Eyebrow"
            className="box-border w-fit h-fit shrink-0 flex flex-row gap-[10px] justify-start items-center"
          >
            {/* Eyebrow */}
            <div
              data-pen="Dot"
              className="box-border w-[6px] shrink-0 h-[6px] flex flex-row gap-0 justify-start items-start bg-[var(--color-accent)] rounded-[3px]"
            >
              {/* Dot */}
            </div>
            <div
              data-pen="Label"
              className="text-[11px]/[normal] box-border text-[var(--color-ink-2)] font-body font-semibold tracking-[1.6px] text-left [white-space:nowrap]"
            >
              {/* Label */}
              HOVER TREATMENT
            </div>
          </div>
          <div
            data-pen="Title"
            className="text-[40px]/[45px] box-border w-full text-[var(--color-ink)] font-display font-normal text-left"
          >
            {/* Title */}
            Every plate carries its label.
          </div>
          <div
            data-pen="Body"
            className="text-[15px]/[27px] box-border w-full text-[var(--color-ink-2)] font-body font-normal text-left"
          >
            {/* Body */}
            Resting state is the work alone. On hover the caption band rises:
            title, artist, medium and date never more than a glance’s worth of
            information.
          </div>
        </div>
      </div>
    </div>
  );
}
