import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ColorPicker } from "./ColorPicker";

describe("ColorPicker", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(ColorPicker);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.color-picker");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ColorPicker);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.color-picker");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

function key(el: Element, k: string, init: KeyboardEventInit = {}) {
  const event = new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true, ...init });
  el.dispatchEvent(event);
  return event;
}

describe("ColorPicker — slider semantics and keys", () => {
  function create(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(ColorPicker);
    for (const [k, v] of Object.entries({ label: "Colour", ...inputs })) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    return { fixture, el: fixture.nativeElement.querySelector("div.color-picker") as HTMLElement };
  }

  test("is a labelled slider in the tab order with 0-100 range and x/y data attributes", () => {
    const { el } = create({ x: 20, y: 30 });
    expect(el.getAttribute("role")).toBe("slider");
    expect(el.getAttribute("aria-label")).toBe("Colour");
    expect(el.getAttribute("tabindex")).toBe("0");
    expect(el.getAttribute("aria-valuenow")).toBe("20");
    expect(el.getAttribute("aria-valuemin")).toBe("0");
    expect(el.getAttribute("aria-valuemax")).toBe("100");
    expect(el.getAttribute("data-x")).toBe("20");
    expect(el.getAttribute("data-y")).toBe("30");
  });

  test("Arrow keys move x and y by 1, by 10 with Shift, clamped to 0-100", () => {
    const { fixture, el } = create({ x: 50, y: 50 });
    const c = fixture.componentInstance;
    expect(key(el, "ArrowRight").defaultPrevented).toBe(true);
    expect(c.x()).toBe(51);
    key(el, "ArrowLeft", { shiftKey: true });
    expect(c.x()).toBe(41);
    key(el, "ArrowUp");
    expect(c.y()).toBe(49);
    key(el, "ArrowDown", { shiftKey: true });
    expect(c.y()).toBe(59);
  });

  test("clamps at the ends; Home sets x to 0 and End to 100", () => {
    const { fixture, el } = create({ x: 99, y: 1 });
    const c = fixture.componentInstance;
    key(el, "ArrowRight", { shiftKey: true });
    expect(c.x()).toBe(100);
    key(el, "ArrowUp", { shiftKey: true });
    expect(c.y()).toBe(0);
    key(el, "Home");
    expect(c.x()).toBe(0);
    key(el, "End");
    expect(c.x()).toBe(100);
  });

  test("disabled: out of the tab order, aria-disabled, keys ignored", () => {
    const { fixture, el } = create({ disabled: true, x: 10 });
    expect(el.getAttribute("tabindex")).toBe("-1");
    expect(el.getAttribute("aria-disabled")).toBe("true");
    expect(key(el, "ArrowRight").defaultPrevented).toBe(false);
    expect(fixture.componentInstance.x()).toBe(10);
  });

  test("other keys are not intercepted", () => {
    const { el } = create();
    expect(key(el, "a").defaultPrevented).toBe(false);
  });
});
