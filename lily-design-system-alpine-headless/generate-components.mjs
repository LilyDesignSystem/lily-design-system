#!/usr/bin/env node
// Generates the pilot slice of components/{slug}.html, .test.js and
// .stories.ts. Static components (no behaviour) are derived from the
// html-headless snippet's markup, which is the same; behavioural ones
// are written here, against the plugin in lily-alpine.js.
import { existsSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { basename, dirname, join } from "node:path";
import {
    popoverNotes,
    popoverTests,
    popoverTriggerAttributes,
} from "./families/shared/popover-api.mjs";
import STATIC_EXTRAS from "./families/shared/static-extras.mjs";

const root = dirname(fileURLToPath(import.meta.url));
const catalog = new Map(
    readFileSync(join(root, "..", "components.tsv"), "utf8")
        .trim()
        .split("\n")
        .map((l) => l.split("\t"))
        .map(([s, n, d]) => [s, { name: n, description: d }]),
);

const pascal = (slug) => catalog.get(slug).name;
// Every html-headless snippet with no embedded <script> is pure markup, so
// the Alpine snippet is the same markup. Snippets with a script need a
// hand-written behaviour (BEHAVIOURAL below) and are added a batch at a time.
const htmlDir = join(root, "..", "lily-design-system-html-headless", "components");
// Written by hand, not by this generator: each wraps a pure module of its own (middle-truncation.js, wheel-picker.js)
// with tests written alongside it. --check fails on any other component it does not write.
const HAND_WRITTEN = new Set(["middle-truncation", "wheel-picker"]);
const STATIC = readdirSync(htmlDir)
    .filter((f) => f.endsWith(".html") && !f.includes("fixture"))
    .map((f) => f.slice(0, -5))
    .filter(
        (slug) =>
            catalog.has(slug) &&
            !/<script/.test(readFileSync(join(htmlDir, slug + ".html"), "utf8")),
    )
    .sort();

// slug -> { tag, keyboard, aria, markup, test }
// `test` is the body of the vitest `describe`; helpers: root(), mount, tick, fire.
const BEHAVIOURAL = {
    "navigation-menu": {
        tag: "nav",
        keyboard:
            "Links use Tab and Enter; in overflow mode Enter or Space toggle the More button, Escape closes the list and returns focus to the button, a click outside closes it",
        aria: "nav landmark named by aria-label; overflow mode: the More button carries aria-expanded and aria-controls, the opened list is in normal flow (never covers content), and the More item is hidden until something overflows. Without JavaScript the links simply wrap.",
        markup: `<nav class="navigation-menu" aria-label="" data-overflow="true" x-data="lilyNavigationMenu">
  <ul class="navigation-menu-list">
    <!-- Consumer provides <li> items -->
    <li class="navigation-menu-more" hidden>
      <button class="navigation-menu-more-button" type="button" aria-expanded="false">
        <!-- Consumer provides the More label -->
      </button>
      <ul class="navigation-menu-more-list" hidden></ul>
    </li>
  </ul>
</nav>`,
        extra: `
const items = (n) =>
  Array.from({ length: n }, (_, i) => \`<li id="item-\${i}"><a href="/\${i}"\${i === 1 ? ' aria-current="page"' : ""}>Item \${i}</a></li>\`).join("");
const overflowMarkup = (n) =>
  \`<nav class="navigation-menu" aria-label="Main" data-overflow="true" x-data="lilyNavigationMenu"><ul class="navigation-menu-list">\${items(n)}<li class="navigation-menu-more" hidden><button class="navigation-menu-more-button" type="button" aria-expanded="false">More</button><ul class="navigation-menu-more-list" hidden></ul></li></ul></nav>\`;
let width = 1000;
let callbacks = [];
`,
        test: `
  beforeEach(() => {
    width = 1000;
    callbacks = [];
    vi.stubGlobal("ResizeObserver", class {
      constructor(cb) { callbacks.push(cb); }
      observe() {}
      disconnect() {}
    });
    Object.defineProperty(HTMLElement.prototype, "clientWidth", { configurable: true, get: () => width });
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      get() { return this.hidden ? 0 : this.classList.contains("navigation-menu-more") ? 40 : 100; },
    });
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    delete HTMLElement.prototype.clientWidth;
    delete HTMLElement.prototype.offsetWidth;
  });
  it("uses the nav element", async () => {
    await mount("navigation-menu");
    expect(el().tagName.toLowerCase()).toBe("nav");
  });
  it("without x-data (overflow unset) a plain nav is left alone", async () => {
    await mount("navigation-menu", '<nav class="navigation-menu" aria-label="Main"><a href="/">Home</a></nav>');
    expect(el().hasAttribute("data-overflow")).toBe(false);
    expect(document.querySelector(".navigation-menu-more")).toBeNull();
  });
  it("wide: nothing moves and More stays hidden", async () => {
    await mount("navigation-menu", overflowMarkup(5));
    expect(document.querySelector(".navigation-menu-more").hidden).toBe(true);
    expect(document.querySelector(".navigation-menu-more-list").children.length).toBe(0);
  });
  it("narrow: extra items move in order and More is unhidden", async () => {
    width = 300;
    await mount("navigation-menu", overflowMarkup(5));
    expect(document.querySelector(".navigation-menu-more").hidden).toBe(false);
    const moved = [...document.querySelector(".navigation-menu-more-list").children].map((c) => c.id);
    expect(moved).toEqual(["item-2", "item-3", "item-4"]);
    expect(document.querySelector('[aria-current="page"]').getAttribute("href")).toBe("/1");
  });
  it("the button toggles aria-expanded; Escape closes and refocuses", async () => {
    width = 300;
    await mount("navigation-menu", overflowMarkup(5));
    const button = document.querySelector(".navigation-menu-more-button");
    const list = document.querySelector(".navigation-menu-more-list");
    button.click(); await tick();
    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(list.hidden).toBe(false);
    const link = list.querySelector("a");
    link.focus();
    link.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(list.hidden).toBe(true);
    expect(document.activeElement).toBe(button);
  });
  it("widening moves the items back and hides More", async () => {
    width = 300;
    await mount("navigation-menu", overflowMarkup(5));
    width = 1000;
    callbacks.forEach((cb) => cb());
    expect(document.querySelector(".navigation-menu-more").hidden).toBe(true);
    expect(document.querySelector(".navigation-menu-more-list").children.length).toBe(0);
  });`,
        sel: "nav.navigation-menu",
    },
    "toggle-button": {
        tag: "button",
        keyboard: "Tab to focus, Enter or Space to toggle",
        aria: "aria-pressed reflects the state; aria-label names the button",
        markup: `<button
  class="toggle-button"
  x-data="lilyToggleButton(false)"
  x-bind="button"
  aria-label=""
>
  <!-- Consumer provides button content -->
</button>`,
        test: `
  it("starts unpressed", async () => {
    await mount("toggle-button");
    expect(el().getAttribute("aria-pressed")).toBe("false");
  });
  it("toggles aria-pressed on click", async () => {
    await mount("toggle-button");
    el().click(); await tick();
    expect(el().getAttribute("aria-pressed")).toBe("true");
    el().click(); await tick();
    expect(el().getAttribute("aria-pressed")).toBe("false");
  });`,
        sel: "button.toggle-button",
    },
    "switch-button": {
        tag: "button",
        keyboard: "Tab to focus, Enter or Space to toggle",
        aria: 'role="switch", aria-checked reflects the state',
        markup: `<button
  class="switch-button"
  x-data="lilySwitchButton(false)"
  x-bind="button"
  aria-label=""
>
  <!-- Consumer provides button content -->
</button>`,
        test: `
  it('has role="switch" and starts unchecked', async () => {
    await mount("switch-button");
    expect(el().getAttribute("role")).toBe("switch");
    expect(el().getAttribute("aria-checked")).toBe("false");
  });
  it("toggles aria-checked on click", async () => {
    await mount("switch-button");
    el().click(); await tick();
    expect(el().getAttribute("aria-checked")).toBe("true");
  });`,
        sel: "button.switch-button",
    },
    collapsible: {
        tag: "div",
        keyboard: "Tab to the trigger, Enter or Space to expand and collapse",
        aria: "aria-expanded on the trigger; the content is hidden while collapsed",
        markup: `<div class="collapsible" x-data="lilyCollapsible(false)" x-bind="root" aria-label="">
  <button class="collapsible-trigger" x-bind="trigger" aria-controls="collapsible-content-1">
    <!-- Consumer provides trigger label -->
  </button>
  <div class="collapsible-content" id="collapsible-content-1" x-bind="content">
    <!-- Consumer provides content -->
  </div>
</div>`,
        test: `
  it("starts collapsed with hidden content", async () => {
    await mount("collapsible");
    expect(trigger().getAttribute("aria-expanded")).toBe("false");
    expect(content().hidden).toBe(true);
    expect(el().getAttribute("data-expanded")).toBe("false");
  });
  it("expands and collapses", async () => {
    await mount("collapsible");
    trigger().click(); await tick();
    expect(trigger().getAttribute("aria-expanded")).toBe("true");
    expect(content().hidden).toBe(false);
    trigger().click(); await tick();
    expect(content().hidden).toBe(true);
  });
  it("the trigger controls the content", async () => {
    await mount("collapsible");
    expect(trigger().getAttribute("aria-controls")).toBe(content().id);
  });`,
        sel: "div.collapsible",
        extra: `const trigger = () => document.querySelector(".collapsible-trigger");
const content = () => document.querySelector(".collapsible-content");`,
    },
    "show-more": {
        tag: "div",
        keyboard: "Tab to the button, Enter or Space to show more or less",
        aria: "aria-expanded and aria-controls on the button; the button text is the consumer's",
        markup: `<div class="show-more" x-data="lilyShowMore(false)" x-bind="root">
  <div class="show-more-content" id="show-more-content-1" x-bind="content">
    <!-- Consumer provides long content; CSS clamps it while data-expanded is false -->
  </div>
  <button class="show-more-button" x-bind="button" aria-controls="show-more-content-1">
    <!-- Consumer provides the label, e.g. via x-text="expanded ? lessLabel : moreLabel" -->
  </button>
</div>`,
        test: `
  it("starts collapsed", async () => {
    await mount("show-more");
    expect(button().getAttribute("aria-expanded")).toBe("false");
    expect(content().getAttribute("data-expanded")).toBe("false");
  });
  it("expands on click and mirrors the state on the content", async () => {
    await mount("show-more");
    button().click(); await tick();
    expect(button().getAttribute("aria-expanded")).toBe("true");
    expect(content().getAttribute("data-expanded")).toBe("true");
  });`,
        sel: "div.show-more",
        extra: `const button = () => document.querySelector(".show-more-button");
const content = () => document.querySelector(".show-more-content");`,
    },
    popover: {
        tag: "div",
        keyboard: "Tab to the trigger, Enter or Space to open, Escape to close and return focus",
        aria: 'aria-haspopup="dialog" and aria-expanded on the trigger; the panel is role="dialog"',
        notes: popoverNotes("panel"),
        markup: `<div class="popover" x-data="lilyPopover(false)" x-bind="root" aria-label="">
  <button class="popover-trigger" x-bind="trigger" aria-controls="popover-panel-1"${popoverTriggerAttributes("popover-panel-1")}>
    <!-- Consumer provides trigger content -->
  </button>
  <div class="popover-panel" id="popover-panel-1" role="dialog" aria-label="" popover="auto" x-bind="panel">
    <!-- Consumer provides content -->
  </div>
</div>`,
        test: `
  it("starts closed", async () => {
    await mount("popover");
    expect(trigger().getAttribute("aria-expanded")).toBe("false");
    expect(panel().hidden).toBe(true);
  });
  it("opens on click", async () => {
    await mount("popover");
    trigger().click(); await tick();
    expect(trigger().getAttribute("aria-expanded")).toBe("true");
    expect(panel().hidden).toBe(false);
  });
  it("closes on Escape and returns focus to the trigger", async () => {
    await mount("popover");
    trigger().click(); await tick();
    panel().dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await tick();
    expect(panel().hidden).toBe(true);
    expect(document.activeElement).toBe(trigger());
  });
  it("closes on an outside click", async () => {
    await mount("popover");
    trigger().click(); await tick();
    document.body.click(); await tick();
    expect(panel().hidden).toBe(true);
  });${popoverTests("popover", ".popover-trigger", ".popover-panel")}`,
        sel: "div.popover",
        extra: `const trigger = () => document.querySelector(".popover-trigger");
const panel = () => document.querySelector(".popover-panel");`,
    },
    tooltip: {
        tag: "div",
        keyboard: "Focus the trigger to show, Escape to dismiss",
        aria: 'role="tooltip"; hoverable and dismissable (WCAG 1.4.13); the trigger is linked with aria-describedby',
        markup: `<span class="tooltip-wrapper" x-data="lilyTooltip()">
  <button class="tooltip-trigger" x-bind="trigger" aria-describedby="tooltip-1">
    <!-- Consumer provides trigger content -->
  </button>
  <div class="tooltip" id="tooltip-1" x-bind="tooltip">
    <!-- Consumer provides content -->
  </div>
</span>`,
        test: `
  it("is hidden until the trigger is focused", async () => {
    await mount("tooltip");
    expect(tip().hidden).toBe(true);
    expect(tip().getAttribute("role")).toBe("tooltip");
    trigger().dispatchEvent(new FocusEvent("focus")); await tick();
    expect(tip().hidden).toBe(false);
    expect(tip().getAttribute("aria-hidden")).toBe("false");
  });
  it("shows on hover and stays while the pointer is on the tooltip", async () => {
    await mount("tooltip");
    trigger().dispatchEvent(new MouseEvent("mouseenter")); await tick();
    expect(tip().hidden).toBe(false);
    trigger().dispatchEvent(new MouseEvent("mouseleave"));
    tip().dispatchEvent(new MouseEvent("mouseenter")); await tick();
    expect(tip().hidden).toBe(false);
  });
  it("is dismissed by Escape without moving focus", async () => {
    await mount("tooltip");
    trigger().focus();
    trigger().dispatchEvent(new FocusEvent("focus")); await tick();
    trigger().dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })); await tick();
    expect(tip().hidden).toBe(true);
    expect(document.activeElement).toBe(trigger());
  });`,
        sel: "div.tooltip",
        extra: `const trigger = () => document.querySelector(".tooltip-trigger");
const tip = () => document.querySelector("div.tooltip");`,
    },
    "clipboard-copy-button": {
        tag: "button",
        keyboard: "Tab to focus, Enter or Space to copy",
        aria: "aria-label names the button; data-copied is for consumer CSS and announcements",
        markup: `<button
  class="clipboard-copy-button"
  x-data="lilyClipboardCopy('text to copy')"
  x-bind="button"
  aria-label=""
>
  <!-- Consumer provides button content -->
</button>`,
        test: `
  it("copies the text and sets data-copied", async () => {
    const writeText = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    await mount("clipboard-copy-button");
    expect(el().getAttribute("data-copied")).toBe("false");
    el().click(); await tick(); await tick();
    expect(writeText).toHaveBeenCalledWith("text to copy");
    expect(el().getAttribute("data-copied")).toBe("true");
  });`,
        sel: "button.clipboard-copy-button",
    },
    "toggle-group": {
        tag: "div",
        keyboard: "Tab between buttons, Enter or Space to toggle each",
        aria: 'role="group" with aria-label; each button carries aria-pressed',
        markup: `<div class="toggle-group" role="group" aria-label="" x-data="lilyToggleGroup([])">
  <button class="toggle-group-item" x-bind="item('one')"><!-- Consumer provides content --></button>
  <button class="toggle-group-item" x-bind="item('two')"><!-- Consumer provides content --></button>
</div>`,
        test: `
  it("has role=group and unpressed items", async () => {
    await mount("toggle-group");
    expect(el().getAttribute("role")).toBe("group");
    for (const b of items()) expect(b.getAttribute("aria-pressed")).toBe("false");
  });
  it("toggles each item independently", async () => {
    await mount("toggle-group");
    items()[0].click(); items()[1].click(); await tick();
    expect(items().map((b) => b.getAttribute("aria-pressed"))).toEqual(["true", "true"]);
    items()[0].click(); await tick();
    expect(items().map((b) => b.getAttribute("aria-pressed"))).toEqual(["false", "true"]);
  });`,
        sel: "div.toggle-group",
        extra: `const items = () => [...document.querySelectorAll(".toggle-group-item")];`,
    },
    "tab-bar": {
        tag: "div",
        keyboard: "Tab to the selected tab, Arrow Left/Right move and select, Home/End jump",
        aria: 'role="tablist" with aria-label; tabs have role="tab", aria-selected, aria-controls; roving tabindex',
        markup: `<div class="tabs" x-data="lilyTabs('one')">
  <div class="tab-bar" role="tablist" aria-label="" x-bind="tablist">
    <button class="tab-bar-button" x-bind="tab('one')"><!-- Consumer provides tab label --></button>
    <button class="tab-bar-button" x-bind="tab('two')"><!-- Consumer provides tab label --></button>
    <button class="tab-bar-button" x-bind="tab('three')"><!-- Consumer provides tab label --></button>
  </div>
  <div class="tab-panel" x-bind="panel('one')"><!-- Consumer provides panel content --></div>
  <div class="tab-panel" x-bind="panel('two')"><!-- Consumer provides panel content --></div>
  <div class="tab-panel" x-bind="panel('three')"><!-- Consumer provides panel content --></div>
</div>`,
        test: `
  it("is a tablist with one tabbable tab", async () => {
    await mount("tab-bar");
    expect(el().getAttribute("role")).toBe("tablist");
    expect(tabs().map((t) => t.getAttribute("tabindex"))).toEqual(["0", "-1", "-1"]);
    expect(tabs().map((t) => t.getAttribute("aria-selected"))).toEqual(["true", "false", "false"]);
  });
  it("shows only the selected panel, linked both ways", async () => {
    await mount("tab-bar");
    expect(panels().map((p) => p.hidden)).toEqual([false, true, true]);
    expect(tabs()[0].getAttribute("aria-controls")).toBe(panels()[0].id);
    expect(panels()[0].getAttribute("aria-labelledby")).toBe(tabs()[0].id);
  });
  it("selects on click", async () => {
    await mount("tab-bar");
    tabs()[1].click(); await tick();
    expect(tabs()[1].getAttribute("aria-selected")).toBe("true");
    expect(panels().map((p) => p.hidden)).toEqual([true, false, true]);
  });
  it("moves with arrow keys, wrapping, and Home/End", async () => {
    await mount("tab-bar");
    const press = async (key) => {
      document.activeElement.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
      await tick();
    };
    tabs()[0].focus();
    await press("ArrowLeft");
    expect(document.activeElement).toBe(tabs()[2]);
    expect(tabs()[2].getAttribute("aria-selected")).toBe("true");
    await press("ArrowRight");
    expect(document.activeElement).toBe(tabs()[0]);
    await press("End");
    expect(document.activeElement).toBe(tabs()[2]);
    await press("Home");
    expect(document.activeElement).toBe(tabs()[0]);
  });`,
        sel: "div.tab-bar",
        extra: `const tabs = () => [...document.querySelectorAll(".tab-bar-button")];
const panels = () => [...document.querySelectorAll(".tab-panel")];`,
    },
    "tab-bar-button": {
        tag: "button",
        keyboard: "Part of a TabBar: see tab-bar",
        aria: 'role="tab", aria-selected, aria-controls and roving tabindex, all from x-bind="tab(id)"',
        markup: `<!-- Always inside a lilyTabs scope: see tab-bar.html -->
<div x-data="lilyTabs('one')">
  <div role="tablist" aria-label="" x-bind="tablist">
    <button class="tab-bar-button" x-bind="tab('one')"><!-- Consumer provides tab label --></button>
  </div>
  <div x-bind="panel('one')"></div>
</div>`,
        test: `
  it('is a role="tab" button with aria-selected', async () => {
    await mount("tab-bar-button");
    expect(el().getAttribute("role")).toBe("tab");
    expect(el().getAttribute("aria-selected")).toBe("true");
    expect(el().getAttribute("tabindex")).toBe("0");
  });`,
        sel: "button.tab-bar-button",
    },
    "tab-panel": {
        tag: "div",
        keyboard: "Tab moves focus into the panel (tabindex 0)",
        aria: 'role="tabpanel", aria-labelledby the tab, data-selected for CSS; hidden while not selected',
        markup: `<!-- Always inside a lilyTabs scope: see tab-bar.html -->
<div x-data="lilyTabs('one')">
  <div role="tablist" aria-label="" x-bind="tablist">
    <button x-bind="tab('one')"><!-- Consumer provides tab label --></button>
    <button x-bind="tab('two')"><!-- Consumer provides tab label --></button>
  </div>
  <div class="tab-panel" x-bind="panel('one')"><!-- Consumer provides panel content --></div>
  <div class="tab-panel" x-bind="panel('two')"><!-- Consumer provides panel content --></div>
</div>`,
        test: `
  it('is role="tabpanel", visible only when selected', async () => {
    await mount("tab-panel");
    const [a, b] = [...document.querySelectorAll(".tab-panel")];
    expect(a.getAttribute("role")).toBe("tabpanel");
    expect(a.hidden).toBe(false);
    expect(a.getAttribute("data-selected")).toBe("true");
    expect(b.hidden).toBe(true);
    expect(b.getAttribute("data-selected")).toBe("false");
  });`,
        sel: "div.tab-panel",
    },
    dialog: {
        tag: "dialog",
        keyboard: "Tab cycles focus inside, Escape closes",
        aria: 'native <dialog> opened with showModal(); aria-label names it; aria-modal="true"',
        markup: `<div x-data="lilyDialog(false)">
  <button class="dialog-trigger" x-bind="trigger">
    <!-- Consumer provides trigger content -->
  </button>
  <dialog class="dialog" aria-label="" x-bind="dialog">
    <!-- Consumer provides dialog content -->
    <button class="dialog-close" x-bind="closer"><!-- Consumer provides label --></button>
  </dialog>
</div>`,
        test: `
  it("is closed until the trigger is activated", async () => {
    await mount("dialog");
    expect(el().open).toBe(false);
    expect(el().getAttribute("aria-modal")).toBe("true");
  });
  it("opens on the trigger and closes on the close button", async () => {
    await mount("dialog");
    document.querySelector(".dialog-trigger").click(); await tick();
    expect(el().open).toBe(true);
    document.querySelector(".dialog-close").click(); await tick();
    expect(el().open).toBe(false);
  });
  it("closes on Escape", async () => {
    await mount("dialog");
    document.querySelector(".dialog-trigger").click(); await tick();
    el().dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })); await tick();
    expect(el().open).toBe(false);
  });`,
        sel: "dialog.dialog",
    },
};

// One module per behaviour family under families/, merged in here.
for (const f of readdirSync(join(root, "families"))
    .filter((f) => f.endsWith(".mjs"))
    .sort()) {
    Object.assign(BEHAVIOURAL, (await import("./families/" + f)).default);
}

// `notes` are extra header lines, written after "Accessibility:".
function header(slug, tag, keyboard, aria, notes = []) {
    const d = catalog.get(slug).description;
    const extra = notes.map((l) => (l ? `  ${l}\n` : "\n")).join("");
    return `<!-- ${slug}.html -->
<!-- ${pascal(slug)} component (Alpine.js) -->
<!--
  Description: ${d}
  HTML tag: <${tag}>
  CSS class: ${slug}
  Keyboard: ${keyboard}
  Accessibility: ${aria}
${extra}  Requires: Alpine.js with the Lily plugin (lily-alpine.js)
-->
`;
}

function story(slug, markup) {
    const title = pascal(slug).replace(/([a-z])([A-Z])/g, "$1 $2");
    return `import type { Meta, StoryObj } from '@storybook/html-vite';

const html = ${JSON.stringify(markup)};

const meta = {
  title: 'Headless/${title}',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
`;
}

function testFile(slug, sel, body, extra = "") {
    // beforeEach / afterEach are imported only by the tests that use them.
    const hooks = /\b(beforeEach|afterEach)\b/.test(body + extra);
    const vitest = [
        "describe",
        "it",
        "expect",
        "vi",
        ...(hooks ? ["beforeEach", "afterEach"] : []),
    ];
    const harness = ["mount", "tick"];
    return `// ${slug}.test.js
// ${pascal(slug)} component test (vitest + jsdom + Alpine)
import { ${vitest.join(", ")} } from "vitest";
import { ${harness.join(", ")} } from "../test/mount.js";

const el = () => document.querySelector(${JSON.stringify(sel)});
${extra}

describe(${JSON.stringify(pascal(slug))}, () => {
  it("renders the element with its base class", async () => {
    await mount(${JSON.stringify(slug)});
    expect(el()).not.toBeNull();
    expect(el().classList.contains(${JSON.stringify(slug)})).toBe(true);
  });
${body}
});
`;
}

// Every output is collected, formatted with the repository's Prettier config, then written, or with --check compared
// with what is on disk (tasks.md P12-T5b): a hand edit to a generated file is drift, and so is a generator change
// that was never run.
const outputs = new Map();
const out = (slug, ext, text) => outputs.set(join(root, "components", `${slug}.${ext}`), text);

for (const slug of STATIC) {
    const src = readFileSync(
        join(root, "..", "lily-design-system-html-headless", "components", `${slug}.html`),
        "utf8",
    );
    const meta = (k) => (src.match(new RegExp(`^  ${k}: (.*)$`, "m")) || [])[1] || "";
    // Drop every leading comment block (some sources carry two headers) and the script.
    let markup = src.replace(/\n*<script>[\s\S]*<\/script>\s*$/, "");
    while (/^\s*<!--/.test(markup)) markup = markup.replace(/^\s*<!--[\s\S]*?-->/, "");
    markup = markup.trim();
    // A radio must carry aria-checked (axe: aria-required-attr); the consumer keeps it current.
    markup = markup.replace(
        /^(<button\b[^>]*\brole="radio")(?![^>]*aria-checked)/,
        '$1 aria-checked="false"',
    );
    if (/<script/.test(markup)) throw new Error(`${slug}: script left in markup`);
    const tag = meta("HTML tag").replace(/[<>]/g, "");
    // The element carrying the base class (a snippet may wrap it, e.g. an <li> in an <ol>).
    const host = (markup.match(new RegExp(`<(\\w+)[^>]*class="${slug}[ "]`)) || [])[1];
    if (!host) throw new Error(`${slug}: no element with class ${slug}`);
    const x = STATIC_EXTRAS[slug] ?? {};
    out(
        slug,
        "html",
        header(
            slug,
            tag,
            x.keyboard ?? meta("Keyboard"),
            x.aria ?? meta("Accessibility"),
            x.notes,
        ) +
            "\n" +
            markup +
            "\n",
    );
    out(slug, "stories.ts", story(slug, markup));
    out(
        slug,
        "test.js",
        testFile(
            slug,
            `${host}.${slug}`,
            `
  it("uses the ${host} element", async () => {
    await mount(${JSON.stringify(slug)});
    expect(el().tagName.toLowerCase()).toBe(${JSON.stringify(host)});
  });${x.test ?? ""}`,
        ),
    );
}

for (const slug of Object.keys(STATIC_EXTRAS)) {
    if (!STATIC.includes(slug))
        throw new Error(`static-extras.mjs: ${slug} is not a static component`);
}

for (const [slug, c] of Object.entries(BEHAVIOURAL)) {
    out(slug, "html", header(slug, c.tag, c.keyboard, c.aria, c.notes) + "\n" + c.markup + "\n");
    out(slug, "stories.ts", story(slug, c.markup));
    out(slug, "test.js", testFile(slug, c.sel, c.test, c.extra));
}
const check = process.argv.includes("--check");
if (process.argv.includes("--list")) {
    for (const file of outputs.keys())
        if (file.endsWith(".html")) console.log(basename(file, ".html"));
    process.exit(0);
}
const prettier = createRequire(join(root, "..", "package.json"))("prettier");
const drift = [];
for (const [file, text] of outputs) {
    const options = { ...(await prettier.resolveConfig(file)), filepath: file };
    let formatted;
    try {
        formatted = await prettier.format(text, options);
    } catch (error) {
        throw new Error(`components/${basename(file)}: ${error.message.split("\n")[0]}`);
    }
    const current = existsSync(file) ? readFileSync(file, "utf8") : null;
    if (current === formatted) continue;
    drift.push(file);
    if (!check) writeFileSync(file, formatted);
}
const written = new Set(
    [...outputs.keys()].filter((f) => f.endsWith(".html")).map((f) => basename(f, ".html")),
);
const count = written.size;
for (const slug of catalog.keys()) {
    if (written.has(slug) === HAND_WRITTEN.has(slug)) {
        drift.push(slug);
        console.log(
            written.has(slug)
                ? `${slug}: listed as hand-written but also generated`
                : `${slug}: in the catalog but neither generated nor listed as hand-written`,
        );
    }
}
if (check) {
    for (const file of drift) console.log(`drift: components/${basename(file)}`);
    if (drift.length) {
        console.log(
            `${drift.length} file(s) differ from the generator; fix families/ or the generator, then run it`,
        );
        process.exit(1);
    }
    console.log(`checked: ${count} components, ${outputs.size} files, no drift`);
} else {
    console.log(`${count} components, ${drift.length} of ${outputs.size} files written`);
}
