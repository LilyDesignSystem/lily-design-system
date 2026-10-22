import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { DropdownMenu } from "./DropdownMenu";

describe("DropdownMenu", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(DropdownMenu);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.dropdown-menu");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(DropdownMenu);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.dropdown-menu");
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

describe("DropdownMenu — roles and roving focus", () => {
  function create(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(DropdownMenu);
    for (const [k, v] of Object.entries({ label: "Actions", open: true, ...inputs })) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const menu = fixture.nativeElement.querySelector("[role='menu']") as HTMLElement;
    menu.innerHTML = ITEMS;
    const items = Array.from(menu.querySelectorAll<HTMLElement>("[role='menuitem']"));
    return { fixture, menu, items };
  }

  test("is a labelled role=menu", () => {
    const { menu } = create();
    expect(menu.getAttribute("role")).toBe("menu");
    expect(menu.getAttribute("aria-label")).toBe("Actions");
  });

  test("ArrowDown moves focus to the next item and wraps from the last to the first", () => {
    const { menu, items } = create();
    items[0].focus();
    expect(key(menu, "ArrowDown").defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(items[1]);
    items[2].focus();
    key(menu, "ArrowDown");
    expect(document.activeElement).toBe(items[0]);
  });

  test("ArrowUp moves to the previous item and wraps from the first to the last", () => {
    const { menu, items } = create();
    items[1].focus();
    key(menu, "ArrowUp");
    expect(document.activeElement).toBe(items[0]);
    key(menu, "ArrowUp");
    expect(document.activeElement).toBe(items[2]);
  });

  test("Home and End jump to the first and last item", () => {
    const { menu, items } = create();
    items[1].focus();
    key(menu, "End");
    expect(document.activeElement).toBe(items[2]);
    key(menu, "Home");
    expect(document.activeElement).toBe(items[0]);
  });

  test("other keys are not intercepted", () => {
    const { menu, items } = create();
    items[0].focus();
    expect(key(menu, "a").defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(items[0]);
  });
});

describe("DropdownMenu — button and open state", () => {
  function create(open: boolean) {
    const fixture = TestBed.createComponent(DropdownMenu);
    fixture.componentRef.setInput("label", "Actions");
    fixture.componentRef.setInput("open", open);
    fixture.detectChanges();
    return { fixture, button: fixture.nativeElement.querySelector("button") as HTMLButtonElement };
  }

  test("the button has aria-haspopup and aria-expanded tracking open", () => {
    const { fixture, button } = create(false);
    expect(button.getAttribute("aria-haspopup")).toBe("true");
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(fixture.nativeElement.querySelector("[role='menu']")).toBeNull();
    fixture.componentRef.setInput("open", true);
    fixture.detectChanges();
    expect(button.getAttribute("aria-expanded")).toBe("true");
  });

  test("clicking the button toggles open", () => {
    const { fixture, button } = create(false);
    button.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.open()).toBe(true);
    button.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.open()).toBe(false);
  });

  test("Escape inside the menu closes it", () => {
    const { fixture } = create(true);
    const menu = fixture.nativeElement.querySelector("[role='menu']") as HTMLElement;
    key(menu, "Escape");
    fixture.detectChanges();
    expect(fixture.componentInstance.open()).toBe(false);
  });
});
