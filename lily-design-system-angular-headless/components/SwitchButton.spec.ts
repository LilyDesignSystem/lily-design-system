import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { SwitchButton } from "./SwitchButton";

describe("SwitchButton", () => {
  test("renders the button root with the base class", () => {
    const fixture = TestBed.createComponent(SwitchButton);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("button.switch-button");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(SwitchButton);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("button.switch-button");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

describe("SwitchButton — switch semantics", () => {
  function create(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(SwitchButton);
    for (const [k, v] of Object.entries({ label: "Dark mode", ...inputs })) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    return { fixture, button: fixture.nativeElement.querySelector("button") as HTMLButtonElement };
  }

  test("is a button with role=switch, a name and aria-checked=false by default", () => {
    const { button } = create();
    expect(button.getAttribute("type")).toBe("button");
    expect(button.getAttribute("role")).toBe("switch");
    expect(button.getAttribute("aria-label")).toBe("Dark mode");
    expect(button.getAttribute("aria-checked")).toBe("false");
  });

  test("click toggles aria-checked and the bound model", () => {
    const { fixture, button } = create();
    button.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.checked()).toBe(true);
    expect(button.getAttribute("aria-checked")).toBe("true");
    button.click();
    fixture.detectChanges();
    expect(button.getAttribute("aria-checked")).toBe("false");
  });

  test("a disabled switch cannot be toggled", () => {
    const { fixture, button } = create({ disabled: true });
    expect(button.disabled).toBe(true);
    button.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.checked()).toBe(false);
  });

  test("is natively keyboard-operable: a real <button>, in the tab order", () => {
    const { button } = create();
    expect(button.tagName).toBe("BUTTON");
    expect(button.tabIndex).toBe(0);
  });
});
