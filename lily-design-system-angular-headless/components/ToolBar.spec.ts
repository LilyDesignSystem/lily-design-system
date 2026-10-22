import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ToolBar } from "./ToolBar";

describe("ToolBar", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(ToolBar);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.tool-bar");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ToolBar);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.tool-bar");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

function key(el: Element, k: string) {
  const event = new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true });
  el.dispatchEvent(event);
  return event;
}

const ITEMS = '<button type="button">One</button><button type="button">Two</button><button type="button">Three</button>';

describe("ToolBar — role and roving focus", () => {
  function create() {
    const fixture = TestBed.createComponent(ToolBar);
    fixture.componentRef.setInput("label", "Label");
    fixture.detectChanges();
    const root = fixture.nativeElement.querySelector("[role='toolbar']") as HTMLElement;
    root.innerHTML = ITEMS;
    return { root, items: Array.from(root.querySelectorAll<HTMLElement>("button")) };
  }

  test("has role=toolbar and its label", () => {
    const { root } = create();
    expect(root.getAttribute("aria-label")).toBe("Label");
  });

  test("ArrowRight moves to the next item and wraps from the last to the first", () => {
    const { root, items } = create();
    items[0].focus();
    expect(key(root, "ArrowRight").defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(items[1]);
    items[2].focus();
    key(root, "ArrowRight");
    expect(document.activeElement).toBe(items[0]);
  });

  test("ArrowLeft moves to the previous item and wraps from the first to the last", () => {
    const { root, items } = create();
    items[1].focus();
    key(root, "ArrowLeft");
    expect(document.activeElement).toBe(items[0]);
    key(root, "ArrowLeft");
    expect(document.activeElement).toBe(items[2]);
  });

  test("Home and End jump to the first and last item", () => {
    const { root, items } = create();
    items[1].focus();
    key(root, "End");
    expect(document.activeElement).toBe(items[2]);
    key(root, "Home");
    expect(document.activeElement).toBe(items[0]);
  });

  test("An unrelated key is not intercepted", () => {
    const { root, items } = create();
    items[0].focus();
    expect(key(root, "a").defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(items[0]);
  });
});
