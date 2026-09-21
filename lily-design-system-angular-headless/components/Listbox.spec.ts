import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Listbox } from "./Listbox";

describe("Listbox", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(Listbox);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.listbox");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Listbox);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.listbox");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });

  test("the host tag is display: contents", () => {
    const fixture = TestBed.createComponent(Listbox);
    fixture.detectChanges();
    expect(fixture.nativeElement.style.display).toBe("contents");
  });

  test("baseClass replaces the default class token outright", () => {
    const fixture = TestBed.createComponent(Listbox);
    fixture.componentRef.setInput("baseClass", "theme-picker-list");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div");
    expect(el.className.trim()).toBe("theme-picker-list");
  });

  test("elementId sets the real inner element's id; hidden sets hidden on it", () => {
    const fixture = TestBed.createComponent(Listbox);
    fixture.componentRef.setInput("elementId", "my-list");
    fixture.componentRef.setInput("hidden", true);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div");
    expect(el.id).toBe("my-list");
    expect(el.hidden).toBe(true);
  });
});

function optionsHtml(count: number): string {
  return Array.from({ length: count }, (_, i) => `<div role="option" id="opt-${i}">Option ${i}</div>`).join("");
}

/**
 * Render with `count` options already present (matching real usage: the
 * `*ngFor`/`@for` options are always in the DOM, only `hidden` toggles
 * visibility — activeIndex changes afterward, never before the options
 * exist), then set `navigation`/other inputs and return the fixture +
 * root element.
 */
function createWithOptions(count: number, inputs: Record<string, unknown> = {}) {
  const fixture = TestBed.createComponent(Listbox);
  fixture.detectChanges();
  fixture.nativeElement.querySelector("div").innerHTML = optionsHtml(count);
  for (const [key, value] of Object.entries({ navigation: "active-descendant", ...inputs })) {
    fixture.componentRef.setInput(key, value);
  }
  fixture.detectChanges();
  return { fixture, el: fixture.nativeElement.querySelector("div") as HTMLElement };
}

describe("Listbox — active-descendant mode (opt-in, additive)", () => {
  test("default mode ('roving-focus') is unaffected: no tabindex/aria-activedescendant", () => {
    const fixture = TestBed.createComponent(Listbox);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.listbox");
    expect(el.hasAttribute("tabindex")).toBe(false);
    expect(el.hasAttribute("aria-activedescendant")).toBe(false);
  });

  test("root carries tabindex=-1 and aria-activedescendant tracking activeIndex", () => {
    const { el } = createWithOptions(3, { activeIndex: 1 });
    expect(el.getAttribute("tabindex")).toBe("-1");
    expect(el.getAttribute("aria-activedescendant")).toBe("opt-1");
  });

  test("ArrowDown/ArrowUp move the cursor and clamp when clamp is set", () => {
    const { fixture, el } = createWithOptions(3, { clamp: true, activeIndex: 2 });
    el.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    fixture.detectChanges();
    expect(el.getAttribute("aria-activedescendant")).toBe("opt-2");
  });

  test("ArrowDown wraps when clamp is not set", () => {
    const { fixture, el } = createWithOptions(3, { activeIndex: 2 });
    el.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    fixture.detectChanges();
    expect(el.getAttribute("aria-activedescendant")).toBe("opt-0");
  });

  test("Enter emits activate with the active index", () => {
    const { fixture, el } = createWithOptions(3, { activeIndex: 1 });
    let activated: number | undefined;
    fixture.componentInstance.activate.subscribe((i: number) => (activated = i));
    fixture.nativeElement
      .querySelector("div")
      .dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    expect(activated).toBe(1);
  });

  test("Escape emits escape", () => {
    const fixture = TestBed.createComponent(Listbox);
    fixture.componentRef.setInput("navigation", "active-descendant");
    fixture.detectChanges();
    let escaped = false;
    fixture.componentInstance.escape.subscribe(() => (escaped = true));
    fixture.nativeElement
      .querySelector("div")
      .dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    expect(escaped).toBe(true);
  });

  test("Tab emits tabOut and is not prevented", () => {
    const fixture = TestBed.createComponent(Listbox);
    fixture.componentRef.setInput("navigation", "active-descendant");
    fixture.detectChanges();
    let tabbed = false;
    fixture.componentInstance.tabOut.subscribe(() => (tabbed = true));
    const event = new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true });
    fixture.nativeElement.querySelector("div").dispatchEvent(event);
    expect(tabbed).toBe(true);
    expect(event.defaultPrevented).toBe(false);
  });

  test("typeahead moves to the next option starting with the typed character, only when enabled", () => {
    const fixture = TestBed.createComponent(Listbox);
    fixture.detectChanges();
    fixture.nativeElement.querySelector("div").innerHTML =
      '<div role="option" id="opt-0">Apple</div><div role="option" id="opt-1">Banana</div>';
    fixture.componentRef.setInput("navigation", "active-descendant");
    fixture.componentRef.setInput("typeahead", true);
    fixture.componentRef.setInput("activeIndex", 0);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div");
    el.dispatchEvent(new KeyboardEvent("keydown", { key: "b", bubbles: true }));
    fixture.detectChanges();
    expect(el.getAttribute("aria-activedescendant")).toBe("opt-1");
  });

  test("PageDown/PageUp move by pageSize, clamped", () => {
    const { fixture, el } = createWithOptions(3, { clamp: true, pageSize: 1, activeIndex: 0 });
    el.dispatchEvent(new KeyboardEvent("keydown", { key: "PageDown", bubbles: true }));
    fixture.detectChanges();
    expect(el.getAttribute("aria-activedescendant")).toBe("opt-1");
    el.dispatchEvent(new KeyboardEvent("keydown", { key: "PageDown", bubbles: true }));
    el.dispatchEvent(new KeyboardEvent("keydown", { key: "PageDown", bubbles: true }));
    fixture.detectChanges();
    expect(el.getAttribute("aria-activedescendant")).toBe("opt-2");
  });

  test("focus() focuses the root", () => {
    const fixture = TestBed.createComponent(Listbox);
    fixture.componentRef.setInput("navigation", "active-descendant");
    fixture.detectChanges();
    document.body.appendChild(fixture.nativeElement);
    fixture.componentInstance.focus();
    expect(document.activeElement).toBe(fixture.nativeElement.querySelector("div"));
    fixture.nativeElement.remove();
  });
});
