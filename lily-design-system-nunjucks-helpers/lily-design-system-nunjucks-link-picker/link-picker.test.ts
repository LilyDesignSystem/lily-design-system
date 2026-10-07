// @vitest-environment jsdom
import { afterEach, describe, expect, test, vi } from "vitest";
import nunjucks from "nunjucks";
import * as path from "node:path";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { autoInit, initLinkPicker, linkId, nextLinkPickerId } from "./link-picker.client.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = nunjucks.configure(__dirname, {
  autoescape: true,
  throwOnUndefined: false,
  trimBlocks: true,
  lstripBlocks: true,
});

const LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about/" },
  { label: "Contact Us", href: "/contact/" },
  { label: "Privacy Policy", href: "/privacy/" },
];

function renderMacro(opts: Record<string, unknown>): string {
  return env.renderString(`{% from "./link-picker.njk" import linkPicker %}{{ linkPicker(opts) }}`, { opts });
}

function setup(opts: Record<string, unknown> = {}, init: Record<string, unknown> = {}) {
  document.body.innerHTML = renderMacro({ label: "Pages", links: LINKS, ...opts });
  const root = document.body.querySelector("[data-lily-link-picker-root]") as HTMLElement;
  const api = initLinkPicker(root, init);
  return {
    root,
    api,
    trigger: root.querySelector(".link-picker-button") as HTMLButtonElement,
    list: root.querySelector(".link-picker-list") as HTMLElement,
    links: () => Array.from(root.querySelectorAll<HTMLAnchorElement>(".link-picker-link")),
  };
}

const key = (el: Element, k: string) => el.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true }));
const click = (el: Element, init: MouseEventInit = {}) => {
  const ev = new MouseEvent("click", { bubbles: true, cancelable: true, button: 0, ...init });
  el.dispatchEvent(ev);
  return ev;
};

afterEach(() => {
  document.body.innerHTML = "";
});

describe("link-picker (Nunjucks)", () => {
  test("7.1 renders the root, button, tooltip and a hidden list", () => {
    const { root, list } = setup();
    expect(root.matches("div.link-picker")).toBe(true);
    expect(root.querySelector("button.link-picker-button")).toBeTruthy();
    expect(root.querySelector(".link-picker-tooltip")).toBeTruthy();
    expect(list.hidden).toBe(true);
  });

  test("7.2 the button is named by label with aria-expanded and aria-controls", () => {
    const { trigger, list } = setup();
    expect(trigger.getAttribute("aria-label")).toBe("Pages");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(trigger.getAttribute("aria-controls")).toBe(list.id);
  });

  test("7.3 the default icon is an aria-hidden svg; a {% call %} body replaces it", () => {
    const { root } = setup();
    const svg = root.querySelector("svg.link-picker-icon")!;
    expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(svg.getAttribute("viewBox")).toBe("0 0 16 16");
    const html = env.renderString(
      `{% from "./link-picker.njk" import linkPicker %}{% call linkPicker(opts) %}<span class="mine">x</span>{% endcall %}`,
      { opts: { label: "Pages", links: LINKS } },
    );
    document.body.innerHTML = html;
    expect(document.querySelector(".mine")).toBeTruthy();
    expect(document.querySelector("svg.link-picker-icon")).toBeNull();
  });

  test("7.4 one real link per entry, in order, rendered server-side", () => {
    const { links } = setup();
    expect(links().map((a) => [a.textContent, a.getAttribute("href")])).toEqual([
      ["Home", "/"],
      ["About Us", "/about/"],
      ["Contact Us", "/contact/"],
      ["Privacy Policy", "/privacy/"],
    ]);
  });

  test("7.5 no links are invented", () => {
    expect(setup({ links: [] }).links()).toHaveLength(0);
    expect(setup({ links: undefined }).links()).toHaveLength(0);
  });

  test("7.6 the list is named with label", () => {
    expect(setup().list.getAttribute("aria-label")).toBe("Pages");
  });

  test("7.7 click opens the list and focuses the first link", () => {
    const { trigger, list, links } = setup();
    trigger.click();
    expect(list.hidden).toBe(false);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(document.activeElement).toBe(links()[0]);
  });

  test("7.8 a second click closes", () => {
    const { trigger, list } = setup();
    trigger.click();
    trigger.click();
    expect(list.hidden).toBe(true);
  });

  test("7.9 ArrowDown opens at the first link, ArrowUp at the last", () => {
    const a = setup();
    key(a.trigger, "ArrowDown");
    expect(document.activeElement).toBe(a.links()[0]);
    const b = setup();
    key(b.trigger, "ArrowUp");
    expect(document.activeElement).toBe(b.links()[3]);
  });

  test("7.10 arrows move and clamp; Home and End jump", () => {
    const { trigger, list, links } = setup();
    trigger.click();
    key(list, "ArrowUp");
    expect(document.activeElement).toBe(links()[0]);
    key(list, "ArrowDown");
    expect(document.activeElement).toBe(links()[1]);
    key(list, "End");
    expect(document.activeElement).toBe(links()[3]);
    key(list, "ArrowDown");
    expect(document.activeElement).toBe(links()[3]);
    key(list, "Home");
    expect(document.activeElement).toBe(links()[0]);
  });

  test("7.11 Escape closes and returns focus to the button", () => {
    const { trigger, list } = setup();
    trigger.click();
    key(list, "Escape");
    expect(list.hidden).toBe(true);
    expect(document.activeElement).toBe(trigger);
  });

  test("7.12 Tab closes without sending focus to the document top", () => {
    const { trigger, list } = setup();
    trigger.click();
    key(list, "Tab");
    expect(list.hidden).toBe(true);
    expect(document.activeElement).toBe(trigger);
  });

  test("7.13 clicking outside closes", () => {
    const { trigger, list } = setup();
    trigger.click();
    click(document.body);
    expect(list.hidden).toBe(true);
  });

  test("7.14 current marks only that link aria-current=page", () => {
    const { links } = setup({ links: [LINKS[0], { ...LINKS[1], current: true }, LINKS[2]] });
    expect(links().map((a) => a.getAttribute("aria-current"))).toEqual([null, "page", null]);
  });

  test("7.15 newTab adds target and rel", () => {
    const { links } = setup({ links: [{ label: "Docs", href: "https://example.test/", newTab: true }, LINKS[0]] });
    expect(links()[0].getAttribute("target")).toBe("_blank");
    expect(links()[0].getAttribute("rel")).toBe("noopener noreferrer");
    expect(links()[1].hasAttribute("target")).toBe(false);
  });

  test("7.16 onNavigate reports the id, else the href", () => {
    const onNavigate = vi.fn();
    const { trigger, links } = setup({ links: [{ id: "about", label: "About Us", href: "/about/" }, LINKS[0]] }, { onNavigate });
    for (const a of links()) a.addEventListener("click", (e) => e.preventDefault());
    trigger.click();
    click(links()[0]);
    trigger.click();
    click(links()[1]);
    expect(onNavigate.mock.calls).toEqual([["about", "/about/"], ["/", "/"]]);
    expect(linkId({ label: "x", href: "/y" })).toBe("/y");
  });

  test("7.17 navigate handles a plain left click only", () => {
    const navigate = vi.fn();
    const { trigger, links } = setup(
      { links: [LINKS[1], { label: "Docs", href: "https://example.test/", newTab: true }] },
      { navigate },
    );
    trigger.click();
    const plain = click(links()[0]);
    expect(navigate).toHaveBeenCalledWith("/about/");
    expect(plain.defaultPrevented).toBe(true);
    navigate.mockClear();
    trigger.click();
    const ctrl = click(links()[0], { ctrlKey: true });
    expect(navigate).not.toHaveBeenCalled();
    expect(ctrl.defaultPrevented).toBe(false);
    trigger.click();
    const tab = click(links()[1]);
    expect(navigate).not.toHaveBeenCalled();
    expect(tab.defaultPrevented).toBe(false);
  });

  test("7.18 without navigate a click is left to the browser", () => {
    const { trigger, links } = setup();
    trigger.click();
    expect(click(links()[0]).defaultPrevented).toBe(false);
  });

  test("7.19 the tooltip is a hidden role=tooltip holding the label", () => {
    const tip = setup().root.querySelector(".link-picker-tooltip") as HTMLElement;
    expect(tip.getAttribute("role")).toBe("tooltip");
    expect(tip.textContent).toBe("Pages");
    expect(tip.hidden).toBe(true);
  });

  test("7.20 the tooltip shows on hover, hides on Escape, and never shows while open", () => {
    const { root, trigger } = setup();
    const tip = root.querySelector(".link-picker-tooltip") as HTMLElement;
    trigger.dispatchEvent(new MouseEvent("mouseenter"));
    expect(tip.hidden).toBe(false);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(tip.hidden).toBe(true);
    trigger.dispatchEvent(new MouseEvent("mouseleave"));
    trigger.dispatchEvent(new MouseEvent("mouseenter"));
    expect(tip.hidden).toBe(false);
    trigger.click();
    return Promise.resolve().then(() => expect(tip.hidden).toBe(true));
  });

  test("7.21 the tooltip is not wired with aria-describedby", () => {
    expect(setup().trigger.hasAttribute("aria-describedby")).toBe(false);
  });

  test("7.22 classes and attributes reach the root; ids derive from name or id", () => {
    const { root, list } = setup({ classes: "extra", attributes: { "data-x": "1" }, name: "nav" });
    expect(root.classList.contains("extra")).toBe(true);
    expect(root.getAttribute("data-x")).toBe("1");
    expect(list.id).toBe("link-picker-nav-list");
    expect(setup({ id: "custom" }).list.id).toBe("custom-list");
  });

  test("7.23 nextLinkPickerId mints distinct ids; autoInit wires every root", () => {
    expect(nextLinkPickerId()).not.toBe(nextLinkPickerId());
    document.body.innerHTML = renderMacro({ label: "A", links: LINKS, name: "a" }) + renderMacro({ label: "B", links: LINKS, name: "b" });
    const apis = autoInit();
    expect(apis).toHaveLength(2);
    (document.querySelector("#link-picker-a-list")!.parentElement!.querySelector("button") as HTMLButtonElement).click();
    expect((document.querySelector("#link-picker-a-list") as HTMLElement).hidden).toBe(false);
    expect((document.querySelector("#link-picker-b-list") as HTMLElement).hidden).toBe(true);
  });

  test("7.24 the sources ship no stylesheet, inline style, English default or route", () => {
    for (const f of ["link-picker.njk", "link-picker.client.js"]) {
      const src = readFileSync(path.join(__dirname, f), "utf8")
        .replace(/\{#[\s\S]*?#\}/g, "")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/^\s*\/\/.*$/gm, "");
      expect(src, f).not.toMatch(/<style|\sstyle=/);
      expect(src, f).not.toMatch(/(label|href):\s*["'`]/);
      expect(src, f).not.toMatch(/href="\//);
    }
  });

  test("7.25 the links work without JavaScript: the macro output has real hrefs and a hidden list", () => {
    const html = renderMacro({ label: "Pages", links: LINKS });
    expect(html).toContain('href="/about/"');
    expect(html).toMatch(/<ul[^>]* hidden/);
  });
});
