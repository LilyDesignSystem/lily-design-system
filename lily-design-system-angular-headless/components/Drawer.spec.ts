import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Drawer } from "./Drawer";

describe("Drawer", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(Drawer);
    fixture.componentRef.setInput("open", true);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.drawer");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Drawer);
    fixture.componentRef.setInput("open", true);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.drawer");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

function key(el: Element, k: string) {
  const event = new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true });
  el.dispatchEvent(event);
  return event;
}

describe("Drawer — dialog contract and Escape", () => {
  function create(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(Drawer);
    for (const [k, v] of Object.entries({ label: "Panel", open: true, ...inputs })) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    return { fixture, el: fixture.nativeElement.querySelector("div.drawer") as HTMLElement };
  }

  test("is a labelled modal dialog that can take focus", () => {
    const { el } = create();
    expect(el.getAttribute("role")).toBe("dialog");
    expect(el.getAttribute("aria-modal")).toBe("true");
    expect(el.getAttribute("aria-label")).toBe("Panel");
    expect(el.getAttribute("tabindex")).toBe("-1");
  });

  test("data-side defaults to left and follows the side input", () => {
    expect(create().el.getAttribute("data-side")).toBe("left");
    expect(create({ side: "bottom" }).el.getAttribute("data-side")).toBe("bottom");
  });

  test("renders nothing while closed", () => {
    const fixture = TestBed.createComponent(Drawer);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("div.drawer")).toBeNull();
  });

  test("Escape closes the panel (open becomes false) and other keys do not", () => {
    const { fixture, el } = create();
    key(el, "Enter");
    fixture.detectChanges();
    expect(fixture.componentInstance.open()).toBe(true);
    expect(key(el, "Escape").defaultPrevented).toBe(true);
    fixture.detectChanges();
    expect(fixture.componentInstance.open()).toBe(false);
    expect(fixture.nativeElement.querySelector("div.drawer")).toBeNull();
  });
});
