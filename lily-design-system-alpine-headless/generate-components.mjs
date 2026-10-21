#!/usr/bin/env node
// Generates the pilot slice of components/{slug}.html, .test.js and
// .stories.ts. Static components (no behaviour) are derived from the
// html-headless snippet's markup, which is the same; behavioural ones
// are written here, against the plugin in lily-alpine.js.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const catalog = new Map(
  readFileSync(join(root, "..", "components.tsv"), "utf8")
    .trim().split("\n").map((l) => l.split("\t")).map(([s, n, d]) => [s, { name: n, description: d }]),
);

const pascal = (slug) => catalog.get(slug).name;
// Every html-headless snippet with no embedded <script> is pure markup, so
// the Alpine snippet is the same markup. Snippets with a script need a
// hand-written behaviour (BEHAVIOURAL below) and are added a batch at a time.
const htmlDir = join(root, "..", "lily-design-system-html-headless", "components");
const STATIC = readdirSync(htmlDir)
  .filter((f) => f.endsWith(".html") && !f.includes("fixture"))
  .map((f) => f.slice(0, -5))
  .filter((slug) => catalog.has(slug) && !/<script/.test(readFileSync(join(htmlDir, slug + ".html"), "utf8")))
  .sort();

// slug -> { tag, keyboard, aria, markup, test }
// `test` is the body of the vitest `describe`; helpers: root(), mount, tick, fire.
const BEHAVIOURAL = {
  "toggle-button": {
    tag: "button", keyboard: "Tab to focus, Enter or Space to toggle",
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
  });`, sel: "button.toggle-button",
  },
  "switch-button": {
    tag: "button", keyboard: "Tab to focus, Enter or Space to toggle",
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
  });`, sel: "button.switch-button",
  },
  collapsible: {
    tag: "div", keyboard: "Tab to the trigger, Enter or Space to expand and collapse",
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
  });`, sel: "div.collapsible",
    extra: `const trigger = () => document.querySelector(".collapsible-trigger");
const content = () => document.querySelector(".collapsible-content");`,
  },
  "show-more": {
    tag: "div", keyboard: "Tab to the button, Enter or Space to show more or less",
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
  });`, sel: "div.show-more",
    extra: `const button = () => document.querySelector(".show-more-button");
const content = () => document.querySelector(".show-more-content");`,
  },
  popover: {
    tag: "div", keyboard: "Tab to the trigger, Enter or Space to open, Escape to close and return focus",
    aria: 'aria-haspopup="dialog" and aria-expanded on the trigger',
    markup: `<div class="popover" x-data="lilyPopover(false)" x-bind="root" aria-label="">
  <button class="popover-trigger" x-bind="trigger" aria-controls="popover-panel-1">
    <!-- Consumer provides trigger content -->
  </button>
  <div class="popover-panel" id="popover-panel-1" role="dialog" aria-label="" x-bind="panel">
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
  });`, sel: "div.popover",
    extra: `const trigger = () => document.querySelector(".popover-trigger");
const panel = () => document.querySelector(".popover-panel");`,
  },
  tooltip: {
    tag: "div", keyboard: "Focus the trigger to show, Escape to dismiss",
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
  });`, sel: "div.tooltip",
    extra: `const trigger = () => document.querySelector(".tooltip-trigger");
const tip = () => document.querySelector("div.tooltip");`,
  },
  "clipboard-copy-button": {
    tag: "button", keyboard: "Tab to focus, Enter or Space to copy",
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
  });`, sel: "button.clipboard-copy-button",
  },
  "toggle-group": {
    tag: "div", keyboard: "Tab between buttons, Enter or Space to toggle each",
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
  });`, sel: "div.toggle-group",
    extra: `const items = () => [...document.querySelectorAll(".toggle-group-item")];`,
  },
  "tab-bar": {
    tag: "div", keyboard: "Tab to the selected tab, Arrow Left/Right move and select, Home/End jump",
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
  });`, sel: "div.tab-bar",
    extra: `const tabs = () => [...document.querySelectorAll(".tab-bar-button")];
const panels = () => [...document.querySelectorAll(".tab-panel")];`,
  },
  "tab-bar-button": {
    tag: "button", keyboard: "Part of a TabBar: see tab-bar",
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
  });`, sel: "button.tab-bar-button",
  },
  "tab-panel": {
    tag: "div", keyboard: "Tab moves focus into the panel (tabindex 0)",
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
  });`, sel: "div.tab-panel",
  },
  dialog: {
    tag: "dialog", keyboard: "Tab cycles focus inside, Escape closes",
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
  });`, sel: "dialog.dialog",
  },
};

// One module per behaviour family under families/, merged in here.
for (const f of readdirSync(join(root, "families")).filter((f) => f.endsWith(".mjs")).sort()) {
  Object.assign(BEHAVIOURAL, (await import("./families/" + f)).default);
}

function header(slug, tag, keyboard, aria) {
  const d = catalog.get(slug).description;
  return `<!-- ${slug}.html -->
<!-- ${pascal(slug)} component (Alpine.js) -->
<!--
  Description: ${d}
  HTML tag: <${tag}>
  CSS class: ${slug}
  Keyboard: ${keyboard}
  Accessibility: ${aria}
  Requires: Alpine.js with the Lily plugin (lily-alpine.js)
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
  return `// ${slug}.test.js
// ${pascal(slug)} component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

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

const out = (slug, ext, text) => writeFileSync(join(root, "components", `${slug}.${ext}`), text);

for (const slug of STATIC) {
  const src = readFileSync(join(root, "..", "lily-design-system-html-headless", "components", `${slug}.html`), "utf8");
  const meta = (k) => (src.match(new RegExp(`^  ${k}: (.*)$`, "m")) || [])[1] || "";
  // Drop every leading comment block (some sources carry two headers) and the script.
  let markup = src.replace(/\n*<script>[\s\S]*<\/script>\s*$/, "");
  while (/^\s*<!--/.test(markup)) markup = markup.replace(/^\s*<!--[\s\S]*?-->/, "");
  markup = markup.trim();
  // A radio must carry aria-checked (axe: aria-required-attr); the consumer keeps it current.
  markup = markup.replace(/^(<button\b[^>]*\brole="radio")(?![^>]*aria-checked)/, '$1 aria-checked="false"');
  if (/<script/.test(markup)) throw new Error(`${slug}: script left in markup`);
  const tag = meta("HTML tag").replace(/[<>]/g, "");
  // The element carrying the base class (a snippet may wrap it, e.g. an <li> in an <ol>).
  const host = (markup.match(new RegExp(`<(\\w+)[^>]*class="${slug}[ "]`)) || [])[1];
  if (!host) throw new Error(`${slug}: no element with class ${slug}`);
  out(slug, "html", header(slug, tag, meta("Keyboard"), meta("Accessibility")) + "\n" + markup + "\n");
  out(slug, "stories.ts", story(slug, markup));
  out(slug, "test.js", testFile(slug, `${host}.${slug}`, `
  it("uses the ${host} element", async () => {
    await mount(${JSON.stringify(slug)});
    expect(el().tagName.toLowerCase()).toBe(${JSON.stringify(host)});
  });`));
}

for (const [slug, c] of Object.entries(BEHAVIOURAL)) {
  out(slug, "html", header(slug, c.tag, c.keyboard, c.aria) + "\n" + c.markup + "\n");
  out(slug, "stories.ts", story(slug, c.markup));
  out(slug, "test.js", testFile(slug, c.sel, c.test, c.extra));
}
console.log(`${STATIC.length + Object.keys(BEHAVIOURAL).length} components written`);
