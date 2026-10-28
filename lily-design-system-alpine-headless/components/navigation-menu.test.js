// navigation-menu.test.js
// NavigationMenu component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("nav.navigation-menu");

const items = (n) =>
  Array.from({ length: n }, (_, i) => `<li id="item-${i}"><a href="/${i}"${i === 1 ? ' aria-current="page"' : ""}>Item ${i}</a></li>`).join("");
const overflowMarkup = (n) =>
  `<nav class="navigation-menu" aria-label="Main" data-overflow="true" x-data="lilyNavigationMenu"><ul class="navigation-menu-list">${items(n)}<li class="navigation-menu-more" hidden><button class="navigation-menu-more-button" type="button" aria-expanded="false">More</button><ul class="navigation-menu-more-list" hidden></ul></li></ul></nav>`;
let width = 1000;
let callbacks = [];


describe("NavigationMenu", () => {
  it("renders the element with its base class", async () => {
    await mount("navigation-menu");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("navigation-menu")).toBe(true);
  });

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
  });
});
