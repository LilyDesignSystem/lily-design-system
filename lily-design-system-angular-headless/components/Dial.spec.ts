import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Dial } from "./Dial";

describe("Dial", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(Dial);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.dial");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Dial);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.dial");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

function key(el: Element, k: string, init: KeyboardEventInit = {}) {
  const event = new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true, ...init });
  el.dispatchEvent(event);
  return event;
}

describe("Dial — slider semantics and keys", () => {
  function create(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(Dial);
    for (const [k, v] of Object.entries({ label: "Volume", ...inputs })) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    return { fixture, el: fixture.nativeElement.querySelector("div.dial") as HTMLElement };
  }

  test("is a labelled slider exposing value, min and max", () => {
    const { el } = create({ value: 5, min: 2, max: 9 });
    expect(el.getAttribute("role")).toBe("slider");
    expect(el.getAttribute("aria-valuenow")).toBe("5");
    expect(el.getAttribute("aria-valuemin")).toBe("2");
    expect(el.getAttribute("aria-valuemax")).toBe("9");
    expect(el.getAttribute("tabindex")).toBe("0");
  });

  test("Right/Up increase and Left/Down decrease by step, by 10 steps with Shift", () => {
    const { fixture, el } = create({ value: 50, step: 2 });
    const c = fixture.componentInstance;
    expect(key(el, "ArrowRight").defaultPrevented).toBe(true);
    expect(c.value()).toBe(52);
    key(el, "ArrowUp");
    expect(c.value()).toBe(54);
    key(el, "ArrowLeft");
    key(el, "ArrowDown");
    expect(c.value()).toBe(50);
    key(el, "ArrowRight", { shiftKey: true });
    expect(c.value()).toBe(70);
  });

  test("clamps to min/max; Home and End jump to them", () => {
    const { fixture, el } = create({ value: 98, min: 0, max: 100 });
    const c = fixture.componentInstance;
    key(el, "ArrowRight", { shiftKey: true });
    expect(c.value()).toBe(100);
    key(el, "Home");
    expect(c.value()).toBe(0);
    key(el, "ArrowDown");
    expect(c.value()).toBe(0);
    key(el, "End");
    expect(c.value()).toBe(100);
  });

  test("disabled ignores keys and leaves the tab order", () => {
    const { fixture, el } = create({ disabled: true, value: 3 });
    expect(el.getAttribute("tabindex")).toBe("-1");
    expect(key(el, "ArrowRight").defaultPrevented).toBe(false);
    expect(fixture.componentInstance.value()).toBe(3);
  });
});
