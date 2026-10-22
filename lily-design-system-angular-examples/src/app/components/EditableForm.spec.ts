import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { EditableForm } from "./EditableForm";

describe("EditableForm", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(EditableForm);
    fixture.componentRef.setInput("editing", true);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("form.editable-form");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(EditableForm);
    fixture.componentRef.setInput("editing", true);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("form.editable-form");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

function key(el: Element, k: string, init: KeyboardEventInit = {}) {
  const event = new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true, ...init });
  el.dispatchEvent(event);
  return event;
}

describe("EditableForm — submit and cancel", () => {
  function create(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(EditableForm);
    fixture.componentRef.setInput("label", "Edit profile");
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    return fixture;
  }
  const form = (f: { nativeElement: HTMLElement }) => f.nativeElement.querySelector("form.editable-form") as HTMLFormElement | null;

  test("renders nothing while not editing", () => {
    expect(form(create())).toBeNull();
  });

  test("is a labelled, focusable form while editing", () => {
    const el = form(create({ editing: true }))!;
    expect(el.getAttribute("aria-label")).toBe("Edit profile");
    expect(el.getAttribute("tabindex")).toBe("-1");
  });

  test("submit is prevented, closes the form and emits submitted", () => {
    const f = create({ editing: true });
    let submitted = 0;
    f.componentInstance.submitted.subscribe(() => submitted++);
    const event = new Event("submit", { bubbles: true, cancelable: true });
    form(f)!.dispatchEvent(event);
    f.detectChanges();
    expect(event.defaultPrevented).toBe(true);
    expect(submitted).toBe(1);
    expect(f.componentInstance.editing()).toBe(false);
    expect(form(f)).toBeNull();
  });

  test("Escape closes the form and emits cancelled; other keys do not", () => {
    const f = create({ editing: true });
    let cancelled = 0;
    f.componentInstance.cancelled.subscribe(() => cancelled++);
    key(form(f)!, "Enter");
    expect(cancelled).toBe(0);
    expect(key(form(f)!, "Escape").defaultPrevented).toBe(true);
    f.detectChanges();
    expect(cancelled).toBe(1);
    expect(f.componentInstance.editing()).toBe(false);
  });
});
