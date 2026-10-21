import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Dialog } from "./Dialog";

describe("Dialog", () => {
  test("renders the dialog root with the base class", () => {
    const fixture = TestBed.createComponent(Dialog);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("dialog.dialog");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Dialog);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("dialog.dialog");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

describe("Dialog — keyboard and ARIA contract", () => {
  function create(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(Dialog);
    for (const [key, value] of Object.entries(inputs)) fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return { fixture, el: fixture.nativeElement.querySelector("dialog") as HTMLDialogElement };
  }

  test("is focusable (tabindex=-1) and labelled", () => {
    const { el } = create({ label: "Settings", open: true });
    expect(el.getAttribute("tabindex")).toBe("-1");
    expect(el.getAttribute("aria-label")).toBe("Settings");
  });

  test("aria-modal is set by default and omitted when modal is false", () => {
    expect(create({ open: true }).el.getAttribute("aria-modal")).toBe("true");
    expect(create({ open: true, modal: false }).el.hasAttribute("aria-modal")).toBe(false);
  });

  test("Escape closes the dialog (open becomes false) and is default-prevented", () => {
    const { fixture, el } = create({ open: true });
    expect(el.open).toBe(true);
    const event = new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true });
    el.dispatchEvent(event);
    fixture.detectChanges();
    expect(fixture.componentInstance.open()).toBe(false);
    expect(el.open).toBe(false);
    expect(event.defaultPrevented).toBe(true);
  });

  test("other keys leave the dialog open", () => {
    const { fixture, el } = create({ open: true });
    el.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.open()).toBe(true);
  });
});
