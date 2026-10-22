import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { SlideOutDrawer } from "./SlideOutDrawer";

describe("SlideOutDrawer", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(SlideOutDrawer);
    fixture.componentRef.setInput("open", true);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.slide-out-drawer");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(SlideOutDrawer);
    fixture.componentRef.setInput("open", true);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.slide-out-drawer");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

function key(el: Element, k: string) {
  const event = new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true });
  el.dispatchEvent(event);
  return event;
}

describe("SlideOutDrawer — dialog contract and Escape", () => {
  function create(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(SlideOutDrawer);
    for (const [k, v] of Object.entries({ label: "Panel", open: true, ...inputs })) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    return { fixture, el: fixture.nativeElement.querySelector("div.slide-out-drawer") as HTMLElement };
  }

  test("is a labelled modal dialog that can take focus", () => {
    const { el } = create();
    expect(el.getAttribute("role")).toBe("dialog");
    expect(el.getAttribute("aria-modal")).toBe("true");
    expect(el.getAttribute("aria-label")).toBe("Panel");
    expect(el.getAttribute("tabindex")).toBe("-1");
  });

  test("renders nothing while closed", () => {
    const fixture = TestBed.createComponent(SlideOutDrawer);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("div.slide-out-drawer")).toBeNull();
  });

  test("Escape closes the panel (open becomes false) and other keys do not", () => {
    const { fixture, el } = create();
    key(el, "Enter");
    fixture.detectChanges();
    expect(fixture.componentInstance.open()).toBe(true);
    expect(key(el, "Escape").defaultPrevented).toBe(true);
    fixture.detectChanges();
    expect(fixture.componentInstance.open()).toBe(false);
    expect(fixture.nativeElement.querySelector("div.slide-out-drawer")).toBeNull();
  });
});
