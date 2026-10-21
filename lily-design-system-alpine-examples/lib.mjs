// Pure helpers shared by build.mjs and the tests (no esbuild here: it cannot load inside a jsdom test environment).
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

export const here = dirname(fileURLToPath(import.meta.url));
export const top = join(here, "..");
export const REPO = "https://github.com/LilyDesignSystem/lily-design-system/tree/main";


export const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** The catalog: [{ slug, name, description }] from components.tsv, in file order. */
export function catalog() {
  return readFileSync(join(top, "components.tsv"), "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [slug, name, description] = line.split("\t");
      return { slug, name, description };
    });
}

/** The snippet's markup: the file without its leading comment blocks. */
export function markupOf(source) {
  let s = source;
  while (/^\s*<!--/.test(s)) s = s.replace(/^\s*<!--[\s\S]*?-->/, "");
  return s.trim();
}

export function snippet(slug) {
  return markupOf(readFileSync(join(top, "lily-design-system-alpine-headless", "components", `${slug}.html`), "utf8"));
}

// What a component needs around it to be valid on its own page: a list for an item, a menu for a menu item, a select for an option.
const WRAPS = {
  "menu-item": ['<div role="menu" aria-label="Menu">', "</div>"],
  "menu-bar-button": ['<div role="menubar" aria-label="Menu bar">', "</div>"],
  "context-menu-item": ['<div role="menu" aria-label="Context menu">', "</div>"],
  option: ['<select aria-label="Option">', "</select>"],
  "theme-select-option": ['<select aria-label="Theme">', "</select>"],
};
const INNER = {
  "emoji-character-picker": '<div role="row"><span role="gridcell">😀</span><span role="gridcell">🙂</span></div>',
};

/** The markup as a demo needs it: an orphan list item inside a list, a menu item inside a menu, and so on. */
function fitDemo(slug, markup) {
  if (INNER[slug]) markup = markup.replace(/<!--[\s\S]*?-->/, INNER[slug]);
  if (WRAPS[slug]) return WRAPS[slug][0] + markup + WRAPS[slug][1];
  if (/^<li\b/.test(markup)) return `<ul>${markup}</ul>`;
  return markup;
}

// Elements that may carry an accessible name without a role.
const NAMEABLE = new Set(["A", "BUTTON", "INPUT", "SELECT", "TEXTAREA", "NAV", "SECTION", "FORM", "ASIDE", "MAIN", "HEADER", "FOOTER", "DIALOG", "TABLE", "FIELDSET", "FIGURE", "DETAILS", "SUMMARY", "IMG", "SVG", "METER", "PROGRESS", "OUTPUT", "IFRAME", "AUDIO", "VIDEO", "CANVAS", "AREA", "OBJECT"]);

// Elements where text is not allowed as a child, so a "Consumer provides …" comment stays a comment there.
const NO_TEXT = new Set(["TABLE", "THEAD", "TBODY", "TFOOT", "TR", "UL", "OL", "DL", "SELECT", "COLGROUP", "OPTGROUP", "DATALIST", "TEMPLATE"]);

/**
 * The live demo for a component: its snippet with every empty `aria-label` given the component's name and each
 * "Consumer provides X" comment turned into visible text "X" where the parent may hold text. A demo, not a design:
 * a real app supplies its own text.
 */
export function demoOf(name, markup, slug = "") {
  markup = fitDemo(slug, markup);
  // lilyEditable names itself from its third argument, so the demo passes one (and a starting value to show).
  markup = markup.replace("lilyEditable('', false, '')", `lilyEditable(${JSON.stringify(name).replace(/"/g, "'")}, false, ${JSON.stringify(name).replace(/"/g, "'")})`);
  const dom = new JSDOM(`<!doctype html><body><template>${markup}</template></body>`);
  const document = dom.window.document;
  const root = document.querySelector("template").content;
  // An empty aria-label is the snippet's hole for the consumer's name. Fill it where the element can be named; on a
  // generic element with no role (a bare span or div) a name is prohibited, so the hole is dropped instead.
  for (const el of root.querySelectorAll("[aria-label]")) {
    if (el.getAttribute("aria-label") !== "") continue;
    // x-bind elements get their role from the Alpine behaviour at runtime (a dial, a listbox, ...).
    if (NAMEABLE.has(el.tagName) || el.hasAttribute("role") || el.hasAttribute("x-bind")) el.setAttribute("aria-label", name);
    else el.removeAttribute("aria-label");
  }
  const walker = document.createTreeWalker(root, dom.window.NodeFilter.SHOW_COMMENT);
  const comments = [];
  while (walker.nextNode()) comments.push(walker.currentNode);
  for (const comment of comments) {
    const text = comment.data.trim().replace(/^Consumer provides\s+/i, "").replace(/\s*\(optional\)\s*/i, "");
    const parent = comment.parentNode;
    if (/^Consumer provides/i.test(comment.data.trim()) && parent.nodeType === 1 && !NO_TEXT.has(parent.tagName)) {
      comment.replaceWith(document.createTextNode(text));
    }
  }
  // A value or content component that is empty by design (a *-view span) shows its own name as sample text.
  for (const el of root.querySelectorAll("span[aria-label], p[aria-label], li[aria-label], div[aria-label]")) {
    if (el.childNodes.length === 0) el.textContent = el.getAttribute("aria-label");
  }
  const holder = document.createElement("div");
  holder.append(root.cloneNode(true));
  return holder.innerHTML;
}

