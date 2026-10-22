import { describe, expect, test, vi } from "vitest";
import { TestBed } from "@angular/core/testing";

import { HorizontalScroller } from "./HorizontalScroller";

describe("HorizontalScroller", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(HorizontalScroller);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.horizontal-scroller");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(HorizontalScroller);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.horizontal-scroller");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

function key(el: Element, k: string, init: KeyboardEventInit = {}) {
  const event = new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true, ...init });
  el.dispatchEvent(event);
  return event;
}

describe("HorizontalScroller — region and scrolling keys", () => {
  function create(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(HorizontalScroller);
    for (const [k, v] of Object.entries({ label: "Gallery", ...inputs })) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.horizontal-scroller") as HTMLElement;
    const scrollBy = vi.fn();
    const scrollTo = vi.fn();
    (el as any).scrollBy = scrollBy;
    (el as any).scrollTo = scrollTo;
    Object.defineProperty(el, "scrollWidth", { value: 900 });
    return { el, scrollBy, scrollTo };
  }

  test("is a labelled, focusable region", () => {
    const { el } = create();
    expect(el.getAttribute("role")).toBe("region");
    expect(el.getAttribute("aria-label")).toBe("Gallery");
    expect(el.getAttribute("tabindex")).toBe("0");
  });

  test("ArrowRight/ArrowLeft scroll by step (default 100)", () => {
    const { el, scrollBy } = create();
    expect(key(el, "ArrowRight").defaultPrevented).toBe(true);
    expect(scrollBy).toHaveBeenLastCalledWith({ left: 100, behavior: "smooth" });
    key(el, "ArrowLeft");
    expect(scrollBy).toHaveBeenLastCalledWith({ left: -100, behavior: "smooth" });
  });

  test("the step input changes the distance", () => {
    const { el, scrollBy } = create({ step: 40 });
    key(el, "ArrowRight");
    expect(scrollBy).toHaveBeenLastCalledWith({ left: 40, behavior: "smooth" });
  });

  test("Home scrolls to the start and End to the far edge", () => {
    const { el, scrollTo } = create();
    key(el, "Home");
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 0, behavior: "smooth" });
    key(el, "End");
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 900, behavior: "smooth" });
  });

  test("other keys are not intercepted", () => {
    const { el, scrollBy } = create();
    expect(key(el, "ArrowDown").defaultPrevented).toBe(false);
    expect(scrollBy).not.toHaveBeenCalled();
  });
});
