import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { MenuBar } from "./MenuBar";

describe("MenuBar", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(MenuBar);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.menu-bar");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(MenuBar);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.menu-bar");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

const ITEMS = '<button role="menuitem">One</button><button role="menuitem">Two</button><button role="menuitem">Three</button>';

function key(el: Element, k: string) {
  const event = new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true });
  el.dispatchEvent(event);
  return event;
}

describe("MenuBar — roles and roving focus", () => {
  function create() {
    const fixture = TestBed.createComponent(MenuBar);
    fixture.componentRef.setInput("label", "Main");
    fixture.detectChanges();
    const bar = fixture.nativeElement.querySelector("[role='menubar']") as HTMLElement;
    bar.innerHTML = ITEMS;
    return { bar, items: Array.from(bar.querySelectorAll<HTMLElement>("[role='menuitem']")) };
  }

  test("is a labelled role=menubar", () => {
    const { bar } = create();
    expect(bar.getAttribute("aria-label")).toBe("Main");
  });

  test("ArrowRight/ArrowLeft move focus and wrap", () => {
    const { bar, items } = create();
    items[2].focus();
    expect(key(bar, "ArrowRight").defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(items[0]);
    key(bar, "ArrowLeft");
    expect(document.activeElement).toBe(items[2]);
  });

  test("Home and End jump to the first and last item; ArrowDown is left alone", () => {
    const { bar, items } = create();
    items[1].focus();
    key(bar, "End");
    expect(document.activeElement).toBe(items[2]);
    key(bar, "Home");
    expect(document.activeElement).toBe(items[0]);
    expect(key(bar, "ArrowDown").defaultPrevented).toBe(false);
  });
});
