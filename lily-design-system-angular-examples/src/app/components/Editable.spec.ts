import { describe, expect, test } from "vitest";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Editable } from "./Editable";

describe("Editable", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(Editable);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.editable");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Editable);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.editable");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

function key(el: Element, k: string, init: KeyboardEventInit = {}) {
  const event = new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true, ...init });
  el.dispatchEvent(event);
  return event;
}

describe("Editable — display button and text field", () => {
  function create(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(Editable);
    for (const [k, v] of Object.entries({ label: "Title", value: "Hello", ...inputs })) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    return fixture;
  }
  const span = (f: ComponentFixture<Editable>) => f.nativeElement.querySelector("span.editable") as HTMLElement;
  const field = (f: ComponentFixture<Editable>) => f.nativeElement.querySelector("input.editable") as HTMLInputElement;

  test("shows the value as a button named \"value, label\"", () => {
    const f = create();
    expect(span(f).getAttribute("role")).toBe("button");
    expect(span(f).getAttribute("tabindex")).toBe("0");
    expect(span(f).getAttribute("aria-label")).toBe("Hello, Title");
    expect(span(f).textContent?.trim()).toBe("Hello");
  });

  test("with an empty value the name is just the label", () => {
    expect(span(create({ value: "" })).getAttribute("aria-label")).toBe("Title");
  });

  test("click, Enter and Space start editing with the value as the draft", () => {
    for (const how of ["click", "Enter", " "]) {
      const f = create();
      if (how === "click") span(f).click();
      else expect(key(span(f), how).defaultPrevented).toBe(true);
      f.detectChanges();
      expect(f.componentInstance.editing()).toBe(true);
      expect(field(f).value).toBe("Hello");
      expect(field(f).getAttribute("aria-label")).toBe("Title");
    }
  });

  test("Enter in the field commits the draft and leaves editing", () => {
    const f = create();
    span(f).click();
    f.detectChanges();
    field(f).value = "World";
    field(f).dispatchEvent(new Event("input", { bubbles: true }));
    expect(key(field(f), "Enter").defaultPrevented).toBe(true);
    f.detectChanges();
    expect(f.componentInstance.value()).toBe("World");
    expect(f.componentInstance.editing()).toBe(false);
    expect(span(f).textContent?.trim()).toBe("World");
  });

  test("Escape discards the draft and keeps the old value", () => {
    const f = create();
    span(f).click();
    f.detectChanges();
    field(f).value = "Nope";
    field(f).dispatchEvent(new Event("input", { bubbles: true }));
    key(field(f), "Escape");
    f.detectChanges();
    expect(f.componentInstance.value()).toBe("Hello");
    expect(f.componentInstance.editing()).toBe(false);
  });

  test("disabled: out of the tab order, aria-disabled, cannot start editing", () => {
    const f = create({ disabled: true });
    expect(span(f).getAttribute("tabindex")).toBe("-1");
    expect(span(f).getAttribute("aria-disabled")).toBe("true");
    span(f).click();
    key(span(f), "Enter");
    f.detectChanges();
    expect(f.componentInstance.editing()).toBe(false);
  });
});
