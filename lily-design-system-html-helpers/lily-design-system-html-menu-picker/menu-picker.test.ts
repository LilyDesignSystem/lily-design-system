import { afterEach, describe, expect, test, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { MenuPicker, nextMenuPickerId } from "./menu-picker.js";

if (typeof customElements !== "undefined" && !customElements.get("menu-picker")) {
  customElements.define("menu-picker", MenuPicker);
}

afterEach(() => {
  document.body.innerHTML = "";
});

const flush = () => new Promise((r) => setTimeout(r, 0));

const CONTENT =
  `<a href="/a/">Alpha</a><button type="button" class="b">Beta</button>` +
  `<div data-menu-picker-keep-open><button type="button" class="keep">Keep</button></div>` +
  `<button type="button" class="closer">Closer</button>`;

function mount(attrs: Record<string, string> = {}, content: string = CONTENT): MenuPicker {
  const el = document.createElement("menu-picker") as MenuPicker;
  el.setAttribute("label", "Menu");
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  el.innerHTML = content;
  document.body.appendChild(el);
  return el;
}
const button = (el: MenuPicker) => el.querySelector("button.menu-picker-button") as HTMLButtonElement;
const panel = (el: MenuPicker) => el.querySelector("div.menu-picker-panel") as HTMLDivElement;
const key = (target: Element, k: string) => target.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true }));
const click = (target: Element, init: MouseEventInit = {}) => {
  const ev = new MouseEvent("click", { bubbles: true, cancelable: true, composed: true, button: 0, ...init });
  target.dispatchEvent(ev);
  return ev;
};

describe("menu-picker", () => {
  test("7.1 renders the root, button, tooltip and a hidden panel", () => {
    const el = mount();
    expect(el.querySelector("div.menu-picker")).toBeTruthy();
    expect(button(el)).toBeTruthy();
    expect(el.querySelector(".menu-picker-tooltip")).toBeTruthy();
    expect(panel(el).hasAttribute("hidden")).toBe(true);
  });

  test("7.2 the button is named by label with aria-expanded and aria-controls", () => {
    const el = mount();
    expect(button(el).getAttribute("aria-label")).toBe("Menu");
    expect(button(el).getAttribute("aria-expanded")).toBe("false");
    expect(button(el).getAttribute("aria-controls")).toBe(panel(el).id);
  });

  test("7.3 the default icon is an aria-hidden 16x16 svg; renderButtonContent replaces it", () => {
    const svg = mount().querySelector("svg.menu-picker-icon") as SVGElement;
    expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(svg.getAttribute("viewBox")).toBe("0 0 16 16");
    class Custom extends MenuPicker {
      override renderButtonContent(): Node {
        const s = document.createElement("span");
        s.className = "mine";
        return s;
      }
    }
    customElements.define("custom-menu-picker", Custom);
    const el = document.createElement("custom-menu-picker") as MenuPicker;
    el.setAttribute("label", "Menu");
    document.body.appendChild(el);
    expect(el.querySelector(".mine")).toBeTruthy();
    expect(el.querySelector("svg.menu-picker-icon")).toBeNull();
  });

  test("7.4 the panel is a role=group named with label", () => {
    const el = mount();
    expect(panel(el).getAttribute("role")).toBe("group");
    expect(panel(el).getAttribute("aria-label")).toBe("Menu");
  });

  test("7.5 the app's content renders inside; with none the panel is empty", () => {
    const el = mount();
    expect(panel(el).querySelector("a")?.textContent).toBe("Alpha");
    document.body.innerHTML = "";
    expect(panel(mount({}, "")).textContent?.trim()).toBe("");
  });

  test("7.5b content written in markup survives parsing and in-place upgrade", () => {
    document.body.innerHTML = `<menu-picker label="Menu"><a href="/a/">Alpha</a></menu-picker>`;
    const el = document.querySelector("menu-picker") as MenuPicker;
    expect(el.querySelectorAll(".menu-picker")).toHaveLength(1);
    expect(panel(el).querySelector(".menu-picker")).toBeNull();
    expect(panel(el).querySelector("a")?.textContent).toBe("Alpha");
    // Defined AFTER the markup exists: the upgrade renders from attributeChangedCallback first.
    document.body.innerHTML = `<late-menu-picker label="Late"><a href="/b/">Beta</a></late-menu-picker>`;
    customElements.define("late-menu-picker", class extends MenuPicker {});
    const late = document.querySelector("late-menu-picker") as MenuPicker;
    expect(late.querySelectorAll(".menu-picker")).toHaveLength(1);
    expect(panel(late).querySelector("a")?.textContent).toBe("Beta");
  });

  test("7.6 click opens and leaves focus on the button", async () => {
    const el = mount();
    button(el).focus();
    click(button(el));
    await flush();
    expect(panel(el).hasAttribute("hidden")).toBe(false);
    expect(button(el).getAttribute("aria-expanded")).toBe("true");
    expect(document.activeElement).toBe(button(el));
  });

  test("7.7 a second click closes", () => {
    const el = mount();
    click(button(el));
    click(button(el));
    expect(panel(el).hasAttribute("hidden")).toBe(true);
  });

  test("7.8 ArrowDown opens at the first focusable, ArrowUp at the last", () => {
    const el = mount();
    key(button(el), "ArrowDown");
    expect(panel(el).hasAttribute("hidden")).toBe(false);
    expect(document.activeElement).toBe(panel(el).querySelector("a"));
    const el2 = mount();
    key(button(el2), "ArrowUp");
    expect(document.activeElement).toBe(panel(el2).querySelector(".closer"));
  });

  test("7.9 Escape closes and returns focus to the button", () => {
    const el = mount();
    key(button(el), "ArrowDown");
    key(panel(el), "Escape");
    expect(panel(el).hasAttribute("hidden")).toBe(true);
    expect(document.activeElement).toBe(button(el));
  });

  test("7.10 Tab closes without sending focus to the document top", () => {
    const el = mount();
    key(button(el), "ArrowDown");
    key(panel(el), "Tab");
    expect(panel(el).hasAttribute("hidden")).toBe(true);
    expect(document.activeElement).toBe(button(el));
  });

  test("7.11 clicking outside closes", () => {
    const el = mount();
    click(button(el));
    click(document.body);
    expect(panel(el).hasAttribute("hidden")).toBe(true);
  });

  test("7.12 focus leaving the picker closes", async () => {
    const el = mount();
    click(button(el));
    button(el).focus();
    const outside = document.createElement("button");
    document.body.appendChild(outside);
    outside.focus();
    await flush();
    expect(panel(el).hasAttribute("hidden")).toBe(true);
  });

  test("7.13 activating a link or button closes; keep-open and close-on-select=false do not", () => {
    const el = mount();
    click(button(el));
    panel(el).querySelector("a")!.addEventListener("click", (e) => e.preventDefault());
    click(panel(el).querySelector("a")!);
    expect(panel(el).hasAttribute("hidden")).toBe(true);
    expect(document.activeElement).toBe(button(el));
    click(button(el));
    click(panel(el).querySelector(".b")!);
    expect(panel(el).hasAttribute("hidden")).toBe(true);
    click(button(el));
    click(panel(el).querySelector(".keep")!);
    expect(panel(el).hasAttribute("hidden")).toBe(false);
    const el2 = mount({ "close-on-select": "false" });
    click(button(el2));
    click(panel(el2).querySelector(".b")!);
    expect(panel(el2).hasAttribute("hidden")).toBe(false);
  });

  test("7.14 the content can call close()", () => {
    const el = mount({ "close-on-select": "false" });
    panel(el).querySelector(".closer")!.addEventListener("click", () => el.close());
    click(button(el));
    click(panel(el).querySelector(".closer")!);
    expect(panel(el).hasAttribute("hidden")).toBe(true);
  });

  test("7.15 the open attribute is reflected and openchange fires once per actual change", () => {
    const el = mount();
    const seen: boolean[] = [];
    el.addEventListener("openchange", (e) => seen.push((e as CustomEvent).detail.open));
    click(button(el));
    expect(el.hasAttribute("open")).toBe(true);
    expect(el.open).toBe(true);
    click(button(el));
    click(document.body);
    expect(el.hasAttribute("open")).toBe(false);
    expect(seen).toEqual([true, false]);
    const pre = mount({ open: "" });
    expect(panel(pre).hasAttribute("hidden")).toBe(false);
  });

  test("7.16 the tooltip is a hidden role=tooltip holding the label", () => {
    const tip = mount().querySelector(".menu-picker-tooltip") as HTMLElement;
    expect(tip.getAttribute("role")).toBe("tooltip");
    expect(tip.textContent).toBe("Menu");
    expect(tip.hasAttribute("hidden")).toBe(true);
  });

  test("7.17 the tooltip shows on hover, hides on Escape, and never shows while open", () => {
    const el = mount();
    const tip = el.querySelector(".menu-picker-tooltip") as HTMLElement;
    button(el).dispatchEvent(new MouseEvent("mouseenter"));
    expect(tip.hasAttribute("hidden")).toBe(false);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(tip.hasAttribute("hidden")).toBe(true);
    button(el).dispatchEvent(new MouseEvent("mouseleave"));
    button(el).dispatchEvent(new MouseEvent("mouseenter"));
    expect(tip.hasAttribute("hidden")).toBe(false);
    click(button(el));
    expect(tip.hasAttribute("hidden")).toBe(true);
  });

  test("7.18 the tooltip is not wired with aria-describedby", () => {
    expect(button(mount()).hasAttribute("aria-describedby")).toBe(false);
  });

  test("7.19 the class attribute is appended to the root", () => {
    const el = mount({ class: "extra" });
    expect(el.querySelector(".menu-picker")!.classList.contains("extra")).toBe(true);
  });

  test("7.20 two instances get distinct ids", () => {
    expect(nextMenuPickerId()).not.toBe(nextMenuPickerId());
    expect(panel(mount()).id).not.toBe(panel(mount()).id);
  });

  test("7.21 the source ships no stylesheet, inline style or English default", () => {
    const src = readFileSync(resolve(__dirname, "menu-picker.ts"), "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/^\s*\/\/.*$/gm, "");
    expect(src).not.toMatch(/<style|\.style\.|setAttribute\("style"/);
    expect(src).not.toMatch(/(label|href):\s*["'`]/);
  });
});
