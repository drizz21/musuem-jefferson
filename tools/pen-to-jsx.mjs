/**
 * pen-to-jsx.mjs
 *
 * Converts pen.dev `html-tailwind` exports into React (TSX) components.
 *
 * WHY THIS APPROACH
 * pen.dev's own html-tailwind exporter emits the exact Tailwind utility
 * classes that reproduce the design (identical px values, font weights and
 * letter-spacing). Converting that output mechanically guarantees layout,
 * typography and colour survive 1:1 — far more accurate than re-authoring
 * the design by hand from screenshots.
 *
 * The converter rewrites only:
 *   1. hex colours       -> CSS custom properties (design tokens)
 *   2. font stacks       -> .font-display / .font-body utility classes
 *   3. empty icon divs   -> lucide-react components
 *   4. SVG attr names    -> JSX camelCase
 *   5. canvas artboard positioning -> dropped (left/top/absolute)
 * and lifts the repeated Nav / Footer subtrees into shared components.
 */
import fs from "node:fs";
import path from "node:path";

const SRC = "C:/Users/M S I/_pen-probe";
const OUT = "src/pages";
const COMP = "src/components";

/* ---------------------------------------------------------------- tokens */
// exact values from GetVariables() in the .pen file
const COLOR = {
  "#FAF8F5": "var(--color-bg)",
  "#FFFFFF": "var(--color-surface)",
  "#14110F": "var(--color-ink)",
  "#6B6560": "var(--color-ink-2)",
  "#9A928A": "var(--color-ink-3)",
  "#E3DDD5": "var(--color-line)",
  "#6E1E28": "var(--color-accent)",
  "#F3E8E6": "var(--color-accent-soft)",
  "#241F1B": "var(--color-dark-2)",
  "#F6F3EE": "var(--color-on-dark)",
  "#9E958C": "var(--color-on-dark-2)",
};

// 8-digit (alpha) hex must be rewritten BEFORE the 6-digit pass, otherwise
// "#14110FE6" would lose its alpha channel and become var(--color-ink)E6.
const ALPHA = {
  "#14110FE6": "var(--color-scrim-90)",
  "#14110F99": "var(--color-scrim-60)",
  "#14110F00": "var(--color-scrim-00)",
  "#00000000": "var(--color-transparent)",
};

// secondary shades that appear in the design but are not top-level variables
const COLOR_EXTRA = {
  "#3A332E": "var(--color-line-dark)",
  "#CFC8BF": "var(--color-on-dark-3)",
  "#B8B0A6": "var(--color-on-dark-4)",
  "#4A1219": "var(--color-accent-press)",
  "#EDE7DF": "var(--color-surface-warm)",
  "#E5DFD6": "var(--color-map-block)",
  "#EFEAE3": "var(--color-map-ground)",
  "#DCE3E6": "var(--color-map-water)",
  "#DFE4D6": "var(--color-map-park)",
  "#8A9AA0": "var(--color-map-water-label)",
  "#8A9A80": "var(--color-map-park-label)",
};

const FONT = [
  [/font-\['Cormorant_Garamond',system-ui,sans-serif\]/g, "font-display"],
  [/font-\[Inter,system-ui,sans-serif\]/g, "font-body"],
];

/* ----------------------------------------------------------------- icons */
// pencil icon id -> [lucide export, width, colour token, height?]
const ICONS = {
  GAOi4: ["ArrowUpRight", 22, "on-dark"],
  wT5EK: ["MapPin", 30, "accent"],
  mfFhW: ["TrainFront", 28, "accent"],
  K1RXj: ["Bus", 28, "accent"],
  ifQdh: ["Bike", 28, "accent"],
  QsmIb: ["ArrowUpRight", 20, "ink-3"],
  A5cJZ7: ["ArrowUpRight", 20, "ink-3"],
  JZXx1: ["ArrowUpRight", 20, "ink-3"],
  n9i4VH: ["ArrowUpRight", 20, "ink-3"],
  WGPLV: ["ArrowUpRight", 20, "ink-3"],
  Vr0Xj: ["ArrowUpRight", 20, "ink-3"],
  NG4kt: ["Menu", 22, "ink"],
  bdVND: ["ArrowUpRight", 18, "ink-3"],
  mwEXV: ["ArrowUpRight", 18, "ink-3"],
  OJ1d5: ["ArrowUpRight", 18, "ink-3"],
  tnP8M: ["Plus", 16, "on-dark-2"],
  FxOV8: ["Plus", 16, "on-dark-2"],
  x3zQ3: ["Plus", 16, "on-dark-2"],
  I6F7NE: ["ArrowRight", 36, "accent", 14],
  j7y7c: ["ArrowRight", 36, "accent", 14],
  p1C3e: ["ArrowRight", 36, "accent", 14],
  GqjDq: ["ArrowRight", 36, "accent", 14],
  ZfHcE: ["ArrowRight", 36, "accent", 14],
  DvVYx: ["ArrowRight", 36, "accent", 14],
  LN2ze: ["ArrowRight", 36, "accent", 14],
};

/* ------------------------------------------------------------- utilities */
const SVG_ATTR = {
  "stroke-width": "strokeWidth",
  "stroke-linecap": "strokeLinecap",
  "stroke-linejoin": "strokeLinejoin",
  "stroke-miterlimit": "strokeMiterlimit",
  "fill-rule": "fillRule",
  "clip-rule": "clipRule",
  "clip-path": "clipPath",
  "fill-opacity": "fillOpacity",
  "stroke-opacity": "strokeOpacity",
};

const ENTITIES = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&nbsp;": "\u00A0",
  "&mdash;": "\u2014",
  "&ndash;": "\u2013",
  "&hellip;": "\u2026",
  "&rsquo;": "\u2019",
  "&lsquo;": "\u2018",
  "&ldquo;": "\u201C",
  "&rdquo;": "\u201D",
};

const decode = (s) => s.replace(/&[a-zA-Z#0-9]+;/g, (e) => ENTITIES[e] ?? e);
const escapeText = (s) => decode(s).replace(/[{}]/g, (c) => "\\" + c);

const rewriteClasses = (cls) => {
  let out = cls;
  // alpha hex first, then opaque tokens, then secondary shades
  for (const [hex, token] of Object.entries(ALPHA)) out = out.split(hex).join(token);
  for (const [hex, token] of Object.entries(COLOR_EXTRA)) out = out.split(hex).join(token);
  for (const [hex, token] of Object.entries(COLOR)) out = out.split(hex).join(token);
  for (const [re, rep] of FONT) out = out.replace(re, rep);
  // The exporter writes image URLs relative to the HTML file; in the Vite app
  // the assets live in /public, so they must be root-absolute.
  out = out.replace(/url\('images\//g, "url('/images/");
  return out;
};

/* rewrite a bare hex colour value (SVG fill/stroke attributes) */
const rewriteColorValue = (value) => {
  let out = value;
  for (const [hex, token] of Object.entries(ALPHA)) out = out.split(hex).join(token);
  for (const [hex, token] of Object.entries(COLOR_EXTRA)) out = out.split(hex).join(token);
  for (const [hex, token] of Object.entries(COLOR)) out = out.split(hex).join(token);
  return out;
};

function attrsToJsx(raw, dropPosition) {
  const attrs = [];
  const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*"([^"]*)"/g;
  let m;
  while ((m = re.exec(raw))) {
    let [, name, value] = m;
    if (name === "class") name = "className";
    else if (SVG_ATTR[name]) name = SVG_ATTR[name];
    else if (name === "style") continue;
    else if (name === "data-pencil-id") continue; // noise in production JSX
    else if (name === "data-pencil-name") name = "data-pen";

    if (name === "className") {
      value = rewriteClasses(value);
      if (dropPosition)
        value = value
          .replace(/\babsolute\s+/g, "")
          .replace(/\bleft-\[[^\]]*\]\s*/g, "")
          .replace(/\btop-\[[^\]]*\]\s*/g, "")
          .replace(/\s+/g, " ")
          .trim();
    } else if (name === "fill" || name === "stroke" || name === "color") {
      // SVG presentation attributes accept CSS custom properties
      value = rewriteColorValue(value);
    }
    attrs.push([name, value]);
  }
  return attrs;
}

const renderAttrs = (attrs) =>
  attrs.map(([n, v]) => ` ${n}="${v.replace(/"/g, "&quot;")}"`).join("");

const iconJsx = (id) => {
  const [name, w, token, h] = ICONS[id];
  return `<${name} className="w-[${w}px] h-[${h ?? w}px] text-[var(--color-${token})]" />`;
};

/* balanced <div> matcher — returns end index (exclusive) */
function matchDiv(html, start) {
  const re = /<div\b[^>]*>|<\/div>/g;
  re.lastIndex = start;
  let depth = 0;
  let m;
  while ((m = re.exec(html))) {
    if (m[0].startsWith("</")) {
      depth--;
      if (depth === 0) return re.lastIndex;
    } else depth++;
  }
  return -1;
}

/* find a top-level (depth-1) child of the page frame by layer name */
function findTopLevel(html, pageId, layerName) {
  const frameIdx = html.indexOf(`data-pencil-id="${pageId}"`);
  if (frameIdx < 0) return null;
  const bodyStart = html.indexOf(">", frameIdx) + 1;

  const re = /<div\b[^>]*>|<\/div>/g;
  re.lastIndex = bodyStart;
  let depth = 0;
  let m;
  while ((m = re.exec(html))) {
    if (m[0].startsWith("</")) {
      depth--;
      if (depth < 0) return null;
      continue;
    }
    depth++;
    if (depth === 1 && m[0].includes(`data-pencil-name="${layerName}"`)) {
      const end = matchDiv(html, m.index);
      return { start: m.index, end, html: html.slice(m.index, end) };
    }
  }
  return null;
}

/* --------------------------------------------------------------- convert */
function convert(inner, pageId, shared) {
  const lucide = new Set();
  const lines = [];
  let depth = -1;
  let last = 0;
  let m;

  const push = (indent, text) => lines.push("  ".repeat(Math.max(indent, 0)) + text);

  const tagRe =
    /<!--[\s\S]*?-->|<\/?([a-zA-Z][a-zA-Z0-9]*)((?:"[^"]*"|[^>"])*)\/?>/g;

  while ((m = tagRe.exec(inner))) {
    const text = inner.slice(last, m.index);
    last = tagRe.lastIndex;

    if (text.trim() && depth >= 0) {
      const t = text.trim();
      const sharedHit = Object.entries(shared).find(([, marker]) => t === marker);
      if (sharedHit) push(depth, `<${sharedHit[0]} />`);
      else push(depth, escapeText(t));
    }

    if (m[0].startsWith("<!--")) continue;

    const name = (m[1] || "").toLowerCase();
    const rawAttrs = m[2] || "";
    const selfClosing = m[0].endsWith("/>");

    if (m[0].startsWith("</")) {
      if (depth < 0) continue;
      depth--;
      if (depth < 0) break;
      push(depth, `</${name}>`);
      // the page frame just closed — stop, ignore the exporter's artboard
      // wrapper (it only exists so the canvas can position the frame)
      if (depth === 0) break;
      continue;
    }

    if (depth < 0) {
      const id = /data-pencil-id="([^"]*)"/.exec(rawAttrs)?.[1];
      if (id !== pageId) continue;
      const attrs = attrsToJsx(rawAttrs, true);
      // The artboard is a fixed width (1440px desktop, 390px mobile) and is
      // positioned on the canvas. In the app it must instead be centred, keep
      // that width as a max, and stay `relative` so the absolutely-positioned
      // children inside it (hero artwork, scrim, map) keep their containing
      // block — without `relative` they would escape to the viewport.
      const cls = attrs.find(([n]) => n === "className");
      if (cls) {
        const w = /w-\[(\d+)px\]/.exec(cls[1])?.[1];
        cls[1] = cls[1]
          .replace(/w-\[\d+px\]/, `w-full max-w-[${w ?? 1440}px] mx-auto relative`)
          .replace(/\s+/g, " ")
          .trim();
      }
      push(0, `<div${renderAttrs(attrs)}>`);
      depth = 1;
      continue;
    }

    if (name === "br") {
      push(depth, "<br />");
      continue;
    }

    if (name === "div") {
      const id = /data-pencil-id="([^"]*)"/.exec(rawAttrs)?.[1];
      const nm = /data-pencil-name="([^"]*)"/.exec(rawAttrs)?.[1] || "";
      const rest = inner.slice(tagRe.lastIndex);
      const empty = selfClosing || /^\s*<\/div>/.test(rest);

      if (id && ICONS[id] && empty) {
        push(depth, iconJsx(id));
        lucide.add(ICONS[id][0]);
        // consume the matching close tag
        const closeAt = rest.indexOf("</div>");
        tagRe.lastIndex = tagRe.lastIndex + closeAt + "</div>".length;
        last = tagRe.lastIndex;
        continue;
      }

      const attrs = attrsToJsx(rawAttrs, false);
      push(depth, `<div${renderAttrs(attrs)}>${nm ? `{/* ${nm} */}` : ""}`);
      depth++;
      continue;
    }

    const attrs = attrsToJsx(rawAttrs, false);
    push(depth, `<${name}${renderAttrs(attrs)}${selfClosing ? " /" : ""}>`);
    if (!selfClosing) depth++;
  }

  const imports = [...lucide].sort().join(", ");
  return { lines, imports };
}

function emit(name, lines, imports, extraImport = "") {
  const imp = imports ? `import { ${imports} } from "lucide-react";\n` : "";
  return `${imp}${extraImport}
export default function ${name}() {
  return (
${lines.join("\n")}
  );
}
`;
}

/* ------------------------------------------------------------------ main */
const PAGES = [
  ["home", "Home", "K5LTN"],
  ["exhibitions", "Exhibitions", "op38N"],
  ["exhibition-detail", "ExhibitionDetail", "pD5Mf"],
  ["collection", "Collection", "Hpbck"],
  ["visit", "Visit", "ZieDQ"],
  ["about", "About", "OMkcH"],
  ["home-mobile", "HomeMobile", "gdSGY"],
];

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(COMP, { recursive: true });

// --- 1. lift the repeated Nav / Footer into shared components -------------
const home = fs.readFileSync(path.join(SRC, "home.html"), "utf8");
const navBlock = findTopLevel(home, "K5LTN", "Nav");
const footerBlock = findTopLevel(home, "K5LTN", "Footer");
console.log("nav block:", navBlock ? navBlock.html.length + " chars" : "NOT FOUND");
console.log("footer block:", footerBlock ? footerBlock.html.length + " chars" : "NOT FOUND");

const MARK_NAV = "@@SHARED:NAVBAR@@";
const MARK_FOOTER = "@@SHARED:FOOTER@@";
const shared = { NavBar: MARK_NAV, Footer: MARK_FOOTER };

for (const [file, name, id] of PAGES) {
  let html = fs.readFileSync(path.join(SRC, `${file}.html`), "utf8");

  const nav = findTopLevel(html, id, "Nav");
  const foot = findTopLevel(html, id, "Footer");

  // verify the shared blocks really are identical across pages
  // (only data-pencil-id differs — those are per-instance ids)
  const strip = (s) =>
    s.replace(/data-pencil-id="[^"]*"/g, "").replace(/\s+/g, " ").trim();
  if (nav && navBlock && strip(nav.html) !== strip(navBlock.html))
    console.log(`  ! nav content differs on ${name}`);
  if (foot && footerBlock && strip(foot.html) !== strip(footerBlock.html))
    console.log(`  ! footer content differs on ${name}`);

  // Remove nav/footer from the page body — they are rendered once by the
  // app shell so the site has a single source of truth for both.
  // Delete from the end so earlier offsets stay valid.
  if (foot) html = html.slice(0, foot.start) + html.slice(foot.end);
  if (nav) html = html.slice(0, nav.start) + html.slice(nav.end);

  const body = html.slice(html.indexOf("<body"));
  const inner = body.slice(body.indexOf(">") + 1);

  const { lines, imports } = convert(inner, id, shared);
  fs.writeFileSync(path.join(OUT, `${name}.tsx`), emit(name, lines, imports), "utf8");
  console.log(`wrote src/pages/${name}.tsx`);
}

// --- 2. shared components -------------------------------------------------
// NavBar and Footer are hand-maintained (they carry the router links and the
// hover states), so only emit them when they do not exist yet. Delete the
// file and re-run to regenerate a plain, design-exact starting point.
for (const [block, compName] of [
  [navBlock, "NavBar"],
  [footerBlock, "Footer"],
]) {
  if (!block) continue;
  const dest = path.join(COMP, `${compName}.tsx`);
  if (fs.existsSync(dest)) {
    console.log(`kept existing src/components/${compName}.tsx`);
    continue;
  }
  const rootId = /data-pencil-id="([^"]*)"/.exec(block.html)?.[1];
  const { lines, imports } = convert(block.html, rootId, {});
  fs.writeFileSync(dest, emit(compName, lines, imports), "utf8");
  console.log(`wrote src/components/${compName}.tsx (${lines.length} lines)`);
}
