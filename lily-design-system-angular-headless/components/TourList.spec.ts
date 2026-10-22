import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TourList } from "./TourList";

describe("TourList", () => {
  test("renders the ol root with the base class", () => {
    const fixture = TestBed.createComponent(TourList);
    fixture.componentRef.setInput("active", true);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("ol.tour-list");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(TourList);
    fixture.componentRef.setInput("active", true);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("ol.tour-list");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

function key(el: Element, k: string, init: KeyboardEventInit = {}) {
  const event = new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true, ...init });
  el.dispatchEvent(event);
  return event;
}

describe("TourList — dialog contract and Escape", () => {
  function create(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(TourList);
    for (const [k, v] of Object.entries({ label: "Welcome tour", active: true, ...inputs })) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    return { fixture, el: fixture.nativeElement.querySelector("ol.tour-list") as HTMLElement };
  }

  test("is a labelled modal dialog that can take focus", () => {
    const { el } = create();
    expect(el.getAttribute("role")).toBe("dialog");
    expect(el.getAttribute("aria-modal")).toBe("true");
    expect(el.getAttribute("aria-label")).toBe("Welcome tour");
    expect(el.getAttribute("tabindex")).toBe("-1");
  });

  test("renders nothing while inactive", () => {
    const fixture = TestBed.createComponent(TourList);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("ol.tour-list")).toBeNull();
  });

  test("Escape ends the tour (active becomes false); other keys do not", () => {
    const { fixture, el } = create();
    key(el, "Enter");
    fixture.detectChanges();
    expect(fixture.componentInstance.active()).toBe(true);
    key(el, "Escape");
    fixture.detectChanges();
    expect(fixture.componentInstance.active()).toBe(false);
    expect(fixture.nativeElement.querySelector("ol.tour-list")).toBeNull();
  });
});
