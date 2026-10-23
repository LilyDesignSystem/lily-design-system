// middle-truncation.test.js
// MiddleTruncation component test (vitest + jsdom + Alpine)
import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

// jsdom has no layout and no canvas: stub a width and a monospace metric (one unit per character).
let width = 8;
let observers = [];

beforeEach(() => {
  width = 8;
  observers = [];
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(() => width);
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(() => ({
    font: "",
    measureText: (s) => ({ width: [...s].length }),
  }));
  vi.stubGlobal("ResizeObserver", class {
    constructor(cb) { observers.push(cb); }
    observe() {}
    disconnect() {}
  });
  vi.stubGlobal("requestAnimationFrame", (cb) => { cb(); return 1; });
  vi.stubGlobal("cancelAnimationFrame", () => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

const text = "abcdefghijklmnopqrstuvwxyz";
const html = (opts) => `<span class="middle-truncation" x-data="lilyMiddleTruncation(${opts})" x-bind="root"><span class="middle-truncation-visual" aria-hidden="true" x-bind="visual"></span><span class="middle-truncation-full" x-bind="full"></span></span>`;
const root = () => document.querySelector("span.middle-truncation");
const visual = () => document.querySelector(".middle-truncation-visual").textContent;
const full = () => document.querySelector(".middle-truncation-full");

describe("MiddleTruncation", () => {
  it("renders the element with its base class", async () => {
    await mount("middle-truncation");
    expect(root()).not.toBeNull();
    expect(root().classList.contains("middle-truncation")).toBe(true);
  });

  it("shortens the visual text to the measured width", async () => {
    await mount("m", html(`{ text: '${text}', ellipsis: '…' }`));
    await tick();
    expect(visual()).toBe("abc…wxyz");
  });

  it("keeps the full text in the accessibility tree and hides the shortened copy from it", async () => {
    await mount("m", html(`{ text: '${text}', ellipsis: '…' }`));
    await tick();
    expect(document.querySelector(".middle-truncation-visual").getAttribute("aria-hidden")).toBe("true");
    expect(full().textContent).toBe(text);
    expect(full().closest("[aria-hidden]")).toBeNull();
  });

  it("shows the full text when it fits, and sets no data-truncated", async () => {
    width = 100;
    await mount("m", html(`{ text: '${text}', ellipsis: '…' }`));
    await tick();
    expect(visual()).toBe(text);
    expect(root().hasAttribute("data-truncated")).toBe(false);
  });

  it("sets data-truncated and data-strategy", async () => {
    await mount("m", html(`{ text: '${text}', ellipsis: '…', strategy: 'fixed-end', end: 4 }`));
    await tick();
    expect(root().hasAttribute("data-truncated")).toBe(true);
    expect(root().getAttribute("data-strategy")).toBe("fixed-end");
  });

  it("uses the consumer's ellipsis, with no default of its own", async () => {
    await mount("m", html(`{ text: '${text}', ellipsis: '[...]' }`));
    await tick();
    expect(visual()).toBe("a[...]yz");
  });

  it("keeps `end` characters at the end for fixed-end", async () => {
    width = 12;
    await mount("m", html(`{ text: '${text}', ellipsis: '…', strategy: 'fixed-end', end: 4 }`));
    await tick();
    expect(visual()).toBe("abcdefg…wxyz");
  });

  it("re-measures when the container resizes, changing only the visual string", async () => {
    await mount("m", html(`{ text: '${text}', ellipsis: '…' }`));
    await tick();
    expect(visual()).toBe("abc…wxyz");
    width = 12;
    observers.forEach((cb) => cb());
    await tick();
    expect(visual()).toBe("abcde…uvwxyz");
    expect(full().textContent).toBe(text);
  });

  it("shows the full text when there is no layout width", async () => {
    width = 0;
    await mount("m", html(`{ text: '${text}', ellipsis: '…' }`));
    await tick();
    expect(visual()).toBe(text);
  });
});
