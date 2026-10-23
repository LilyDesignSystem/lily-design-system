import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { TestBed } from "@angular/core/testing";

import { MiddleTruncation } from "./MiddleTruncation";

// jsdom has no layout and no canvas: stub a width and a monospace metric (one unit per character).
let width = 8;
let observers: Array<() => void> = [];

beforeEach(() => {
  width = 8;
  observers = [];
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(() => width);
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation((() => ({
    font: "",
    measureText: (s: string) => ({ width: [...s].length }),
  })) as never);
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(cb: () => void) {
        observers.push(cb);
      }
      observe() {}
      disconnect() {}
    },
  );
  vi.stubGlobal("requestAnimationFrame", (cb: () => void) => {
    cb();
    return 1;
  });
  vi.stubGlobal("cancelAnimationFrame", () => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

const text = "abcdefghijklmnopqrstuvwxyz";

function make(inputs: Record<string, unknown> = {}) {
  const fixture = TestBed.createComponent(MiddleTruncation);
  fixture.componentRef.setInput("text", text);
  fixture.componentRef.setInput("ellipsis", "…");
  for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
  fixture.detectChanges();
  TestBed.tick();
  fixture.detectChanges();
  return fixture;
}
const root = (f: any): HTMLElement => f.nativeElement.querySelector(".middle-truncation");
const visual = (f: any): string => f.nativeElement.querySelector(".middle-truncation-visual").textContent;
const full = (f: any): HTMLElement => f.nativeElement.querySelector(".middle-truncation-full");

describe("MiddleTruncation", () => {
  test("renders a <span> with the base class first, then the consumer class", () => {
    const f = make({ className: "mine" });
    expect(root(f).tagName).toBe("SPAN");
    expect(root(f).getAttribute("class")).toBe("middle-truncation mine");
  });

  test("shortens the visual text to the measured width", () => {
    expect(visual(make())).toBe("abc…wxyz");
  });

  test("keeps the full text in the accessibility tree and hides the shortened copy from it", () => {
    const f = make();
    expect(f.nativeElement.querySelector(".middle-truncation-visual").getAttribute("aria-hidden")).toBe("true");
    expect(full(f).textContent).toBe(text);
    expect(full(f).closest("[aria-hidden]")).toBeNull();
  });

  test("shows the full text when it fits, and sets no data-truncated", () => {
    width = 100;
    const f = make();
    expect(visual(f)).toBe(text);
    expect(root(f).hasAttribute("data-truncated")).toBe(false);
  });

  test("sets data-truncated and data-strategy", () => {
    const f = make({ strategy: "fixed-end", end: 4 });
    expect(root(f).hasAttribute("data-truncated")).toBe(true);
    expect(root(f).getAttribute("data-strategy")).toBe("fixed-end");
  });

  test("uses the consumer's ellipsis, with no default of its own", () => {
    expect(visual(make({ ellipsis: "[...]" }))).toBe("a[...]yz");
  });

  test("keeps `end` characters at the end for fixed-end", () => {
    width = 12;
    expect(visual(make({ strategy: "fixed-end", end: 4 }))).toBe("abcdefg…wxyz");
  });

  test("re-measures when the container resizes, changing only the visual string", () => {
    const f = make();
    expect(visual(f)).toBe("abc…wxyz");
    width = 12;
    observers.forEach((cb) => cb());
    f.detectChanges();
    expect(visual(f)).toBe("abcde…uvwxyz");
    expect(full(f).textContent).toBe(text);
  });

  test("shows the full text when there is no layout width", () => {
    width = 0;
    expect(visual(make())).toBe(text);
  });
});
