import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { WheelPicker } from "./WheelPicker";

const months = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April", disabled: true },
  { value: "5", label: "May" },
];

function make(inputs: Record<string, unknown> = {}) {
  const fixture = TestBed.createComponent(WheelPicker);
  fixture.componentRef.setInput("label", "Month");
  fixture.componentRef.setInput("options", months);
  fixture.componentRef.setInput("value", "2");
  for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
  fixture.detectChanges();
  return fixture;
}
const list = (f: any): HTMLElement => f.nativeElement.querySelector(".wheel-picker-list");
const selected = (f: any): string | undefined => f.nativeElement.querySelector('[role="option"][aria-selected="true"]')?.textContent;
const key = (f: any, k: string): KeyboardEvent => {
  const event = new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true });
  list(f).dispatchEvent(event);
  f.detectChanges();
  return event;
};
const click = (f: any, text: string): void => {
  const option = Array.from<HTMLElement>(f.nativeElement.querySelectorAll('[role="option"]')).find((o) => o.textContent === text)!;
  option.click();
  f.detectChanges();
};

describe("WheelPicker", () => {
  test("renders a div with the base class and the consumer class, and a vertical listbox inside", () => {
    const f = make({ className: "mine" });
    const root = f.nativeElement.querySelector("div.wheel-picker");
    expect(root.classList.contains("wheel-picker")).toBe(true);
    expect(root.classList.contains("mine")).toBe(true);
    expect(list(f).getAttribute("role")).toBe("listbox");
    expect(list(f).getAttribute("aria-orientation")).toBe("vertical");
    expect(list(f).getAttribute("aria-label")).toBe("Month");
    expect(list(f).className).toBe("wheel-picker-list");
  });

  test("renders one option per entry and marks only the selected one", () => {
    const f = make();
    expect(f.nativeElement.querySelectorAll('[role="option"]')).toHaveLength(5);
    expect(selected(f)).toBe("February");
    expect(f.nativeElement.querySelectorAll('[aria-selected="true"]')).toHaveLength(1);
  });

  test("points aria-activedescendant at the selected option and keeps focus on the list", () => {
    const f = make();
    const id = list(f).getAttribute("aria-activedescendant")!;
    expect(f.nativeElement.querySelector(`[id="${id}"]`).textContent).toBe("February");
    expect(list(f).getAttribute("tabindex")).toBe("0");
  });

  test("selects nothing, and has no activedescendant, for an unknown value", () => {
    const f = make({ value: "" });
    expect(selected(f)).toBeUndefined();
    expect(list(f).hasAttribute("aria-activedescendant")).toBe(false);
  });

  test("ArrowDown selects the next enabled option, skipping a disabled one", () => {
    const f = make({ value: "3" });
    key(f, "ArrowDown");
    expect(selected(f)).toBe("May");
    expect(f.componentInstance.value()).toBe("5");
  });

  test("ArrowUp, Home and End move the selection", () => {
    const f = make();
    key(f, "ArrowUp");
    expect(selected(f)).toBe("January");
    key(f, "End");
    expect(selected(f)).toBe("May");
    key(f, "Home");
    expect(selected(f)).toBe("January");
  });

  test("stops at the ends unless loop is set", () => {
    const first = make({ value: "1" });
    key(first, "ArrowUp");
    expect(selected(first)).toBe("January");
    const looped = make({ value: "1", loop: true });
    key(looped, "ArrowUp");
    expect(selected(looped)).toBe("May");
  });

  test("PageDown moves by pageSize", () => {
    const f = make({ value: "1", pageSize: 2 });
    key(f, "PageDown");
    expect(selected(f)).toBe("March");
  });

  test("type-ahead selects the option starting with the typed letter", () => {
    const f = make({ value: "1" });
    key(f, "m");
    expect(selected(f)).toBe("March");
  });

  test("prevents the page scroll for the keys it handles", () => {
    expect(key(make(), "ArrowDown").defaultPrevented).toBe(true);
  });

  test("clicking an enabled option selects it and a disabled one does nothing", () => {
    const f = make();
    click(f, "May");
    expect(selected(f)).toBe("May");
    click(f, "April");
    expect(selected(f)).toBe("May");
  });

  test("marks disabled options with aria-disabled", () => {
    const f = make();
    const april = Array.from<HTMLElement>(f.nativeElement.querySelectorAll('[role="option"]')).find((o) => o.textContent === "April")!;
    expect(april.getAttribute("aria-disabled")).toBe("true");
  });

  test("when disabled: not focusable, ignores keys and clicks", () => {
    const f = make({ disabled: true });
    expect(list(f).getAttribute("tabindex")).toBe("-1");
    expect(list(f).getAttribute("aria-disabled")).toBe("true");
    key(f, "ArrowDown");
    click(f, "May");
    expect(selected(f)).toBe("February");
  });

  test("renders a hidden input only when a name is given, carrying the value", () => {
    expect(make().nativeElement.querySelector("input")).toBeNull();
    const named = make({ name: "month" });
    const input = named.nativeElement.querySelector("input[type=hidden]") as HTMLInputElement;
    expect(input.getAttribute("name")).toBe("month");
    expect(input.value).toBe("2");
  });
});
