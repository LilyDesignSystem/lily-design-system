import { afterEach, describe, expect, test, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { LinkPicker, linkId, nextLinkPickerId, type LinkItem } from "./link-picker.js";

if (typeof customElements !== "undefined" && !customElements.get("lily-link-picker")) {
  customElements.define("lily-link-picker", LinkPicker);
}

const LINKS: LinkItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about/" },
  { label: "Contact Us", href: "/contact/" },
  { label: "Privacy Policy", href: "/privacy/" },
];

afterEach(() => {
  document.body.innerHTML = "";
});

const flush = () => new Promise((r) => setTimeout(r, 0));

function mount(links: LinkItem[] = LINKS, attrs: Record<string, string> = {}): LinkPicker {
  const el = document.createElement("lily-link-picker") as LinkPicker;
  el.setAttribute("label", "Pages");
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  el.links = links;
  document.body.appendChild(el);
  return el;
}
const button = (el: LinkPicker) => el.querySelector("button.link-picker-button") as HTMLButtonElement;
const list = (el: LinkPicker) => el.querySelector("ul.link-picker-list") as HTMLUListElement;
const links = (el: LinkPicker) => Array.from(el.querySelectorAll<HTMLAnchorElement>(".link-picker-link"));
const key = (target: Element, k: string) => target.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true }));
const click = (target: Element, init: MouseEventInit = {}) => {
  const ev = new MouseEvent("click", { bubbles: true, cancelable: true, composed: true, button: 0, ...init });
  target.dispatchEvent(ev);
  return ev;
};

describe("lily-link-picker", () => {
  test("7.1 renders the root, button, tooltip and a hidden list", () => {
    const el = mount();
    expect(el.querySelector("div.link-picker")).toBeTruthy();
    expect(button(el)).toBeTruthy();
    expect(el.querySelector(".link-picker-tooltip")).toBeTruthy();
    expect(list(el).hasAttribute("hidden")).toBe(true);
  });

  test("7.2 the button is named by label with aria-expanded and aria-controls", () => {
    const el = mount();
    expect(button(el).getAttribute("aria-label")).toBe("Pages");
    expect(button(el).getAttribute("aria-expanded")).toBe("false");
    expect(button(el).getAttribute("aria-controls")).toBe(list(el).id);
  });

  test("7.3 the default icon is an aria-hidden 16x16 svg", () => {
    const svg = mount().querySelector("svg.link-picker-icon") as SVGElement;
    expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(svg.getAttribute("viewBox")).toBe("0 0 16 16");
  });

  test("7.4 one real link per entry, in order", () => {
    expect(links(mount()).map((a) => [a.textContent, a.getAttribute("href")])).toEqual([
      ["Home", "/"],
      ["About Us", "/about/"],
      ["Contact Us", "/contact/"],
      ["Privacy Policy", "/privacy/"],
    ]);
  });

  test("7.5 no links are invented", () => {
    expect(links(mount([]))).toHaveLength(0);
  });

  test("7.6 the list is named with label", () => {
    expect(list(mount()).getAttribute("aria-label")).toBe("Pages");
  });

  test("7.7 click opens the list and focuses the first link", () => {
    const el = mount();
    button(el).click();
    expect(list(el).hasAttribute("hidden")).toBe(false);
    expect(button(el).getAttribute("aria-expanded")).toBe("true");
    expect(document.activeElement).toBe(links(el)[0]);
  });

  test("7.8 a second click closes", () => {
    const el = mount();
    button(el).click();
    button(el).click();
    expect(list(el).hasAttribute("hidden")).toBe(true);
  });

  test("7.9 ArrowDown opens at the first link, ArrowUp at the last", () => {
    const a = mount();
    key(button(a), "ArrowDown");
    expect(document.activeElement).toBe(links(a)[0]);
    document.body.innerHTML = "";
    const b = mount();
    key(button(b), "ArrowUp");
    expect(document.activeElement).toBe(links(b)[3]);
  });

  test("7.10 arrows move and clamp; Home and End jump", () => {
    const el = mount();
    button(el).click();
    key(list(el), "ArrowUp");
    expect(document.activeElement).toBe(links(el)[0]);
    key(list(el), "ArrowDown");
    expect(document.activeElement).toBe(links(el)[1]);
    key(list(el), "End");
    expect(document.activeElement).toBe(links(el)[3]);
    key(list(el), "ArrowDown");
    expect(document.activeElement).toBe(links(el)[3]);
    key(list(el), "Home");
    expect(document.activeElement).toBe(links(el)[0]);
  });

  test("7.11 Escape closes and returns focus to the button", () => {
    const el = mount();
    button(el).click();
    key(list(el), "Escape");
    expect(list(el).hasAttribute("hidden")).toBe(true);
    expect(document.activeElement).toBe(button(el));
  });

  test("7.12 Tab closes without sending focus to the document top", () => {
    const el = mount();
    button(el).click();
    key(list(el), "Tab");
    expect(list(el).hasAttribute("hidden")).toBe(true);
    expect(document.activeElement).toBe(button(el));
  });

  test("7.13 clicking outside closes", () => {
    const el = mount();
    button(el).click();
    click(document.body);
    expect(list(el).hasAttribute("hidden")).toBe(true);
  });

  test("7.14 current marks only that link aria-current=page", () => {
    const el = mount([LINKS[0], { ...LINKS[1], current: true }, LINKS[2]]);
    expect(links(el).map((a) => a.getAttribute("aria-current"))).toEqual([null, "page", null]);
  });

  test("7.15 newTab adds target and rel", () => {
    const el = mount([{ label: "Docs", href: "https://example.test/", newTab: true }, LINKS[0]]);
    expect(links(el)[0].getAttribute("target")).toBe("_blank");
    expect(links(el)[0].getAttribute("rel")).toBe("noopener noreferrer");
    expect(links(el)[1].hasAttribute("target")).toBe(false);
  });

  test("7.16 onNavigate and the navigate event report the id, else the href", () => {
    const onNavigate = vi.fn();
    const events: unknown[] = [];
    const el = mount([{ id: "about", label: "About Us", href: "/about/" }, LINKS[0]]);
    el.onNavigate = onNavigate;
    el.addEventListener("navigate", (e) => {
      events.push((e as CustomEvent).detail);
      e.preventDefault();
    });
    button(el).click();
    click(links(el)[0]);
    button(el).click();
    click(links(el)[1]);
    expect(onNavigate.mock.calls).toEqual([["about", "/about/"], ["/", "/"]]);
    expect(events).toEqual([{ id: "about", href: "/about/" }, { id: "/", href: "/" }]);
    expect(linkId({ label: "x", href: "/y" })).toBe("/y");
  });

  test("7.17 a plain click's navigate event is cancelable, and cancelling stops the page load", () => {
    const el = mount();
    el.addEventListener("navigate", (e) => e.preventDefault());
    button(el).click();
    expect(click(links(el)[1]).defaultPrevented).toBe(true);
  });

  test("7.18 a modified click and a newTab link are never offered for interception", () => {
    const el = mount([{ label: "Docs", href: "https://example.test/", newTab: true }, LINKS[1]]);
    const cancelable: boolean[] = [];
    el.addEventListener("navigate", (e) => cancelable.push(e.cancelable));
    button(el).click();
    click(links(el)[0]);
    button(el).click();
    click(links(el)[1], { ctrlKey: true });
    expect(cancelable).toEqual([false, false]);
  });

  test("7.19 without a handler a click is left to the browser", () => {
    const el = mount();
    button(el).click();
    expect(click(links(el)[0]).defaultPrevented).toBe(false);
  });

  test("7.20 the tooltip is a hidden role=tooltip holding the label", () => {
    const tip = mount().querySelector(".link-picker-tooltip") as HTMLElement;
    expect(tip.getAttribute("role")).toBe("tooltip");
    expect(tip.textContent).toBe("Pages");
    expect(tip.hasAttribute("hidden")).toBe(true);
  });

  test("7.21 the tooltip shows on hover, hides on Escape, and never shows while open", () => {
    const el = mount();
    const tip = el.querySelector(".link-picker-tooltip") as HTMLElement;
    button(el).dispatchEvent(new MouseEvent("mouseenter"));
    expect(tip.hasAttribute("hidden")).toBe(false);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(tip.hasAttribute("hidden")).toBe(true);
    button(el).dispatchEvent(new MouseEvent("mouseleave"));
    button(el).dispatchEvent(new MouseEvent("mouseenter"));
    expect(tip.hasAttribute("hidden")).toBe(false);
    button(el).click();
    expect(tip.hasAttribute("hidden")).toBe(true);
  });

  test("7.22 the tooltip is not wired with aria-describedby", () => {
    expect(button(mount()).hasAttribute("aria-describedby")).toBe(false);
  });

  test("7.23 the links attribute accepts JSON; the class attribute is appended to the root", () => {
    const el = document.createElement("lily-link-picker") as LinkPicker;
    el.setAttribute("label", "Pages");
    el.setAttribute("class", "extra");
    el.setAttribute("links", JSON.stringify(LINKS.slice(0, 2)));
    document.body.appendChild(el);
    expect(links(el)).toHaveLength(2);
    expect(el.querySelector(".link-picker")!.classList.contains("extra")).toBe(true);
  });

  test("7.24 two instances get distinct ids", () => {
    expect(nextLinkPickerId()).not.toBe(nextLinkPickerId());
    const a = mount();
    const b = mount();
    expect(list(a).id).not.toBe(list(b).id);
  });

  test("7.25 the source ships no stylesheet, inline style, English default or route", () => {
    const src = readFileSync(resolve(__dirname, "link-picker.ts"), "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/^\s*\/\/.*$/gm, "");
    expect(src).not.toMatch(/<style|\.style\b|setAttribute\("style"/);
    expect(src).not.toMatch(/(label|href):\s*["'`]/);
  });

  test("7.26 renderButtonContent can be overridden", () => {
    class Custom extends LinkPicker {
      renderButtonContent(): Node {
        const s = document.createElement("span");
        s.className = "mine";
        s.textContent = "x";
        return s;
      }
    }
    customElements.define("custom-lily-link-picker", Custom);
    const el = document.createElement("custom-lily-link-picker") as LinkPicker;
    el.setAttribute("label", "Pages");
    el.links = LINKS;
    document.body.appendChild(el);
    expect(el.querySelector(".mine")).toBeTruthy();
    expect(links(el)).toHaveLength(4);
  });
});
