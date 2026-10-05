import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { OneTimePasswordInput } from "./OneTimePasswordInput";

function make(inputs: Record<string, unknown> = {}) {
  const fixture = TestBed.createComponent(OneTimePasswordInput);
  fixture.componentRef.setInput("label", "Verification code");
  fixture.componentRef.setInput("length", 6);
  for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
  fixture.detectChanges();
  const el = fixture.nativeElement.querySelector("input") as HTMLInputElement;
  return { fixture, el };
}

describe("OneTimePasswordInput", () => {
  test("renders ONE native text input with the base class", () => {
    const { fixture, el } = make({ className: "extra" });
    expect(fixture.nativeElement.querySelectorAll("input")).toHaveLength(1);
    expect(el.type).toBe("text");
    expect(el.classList.contains("one-time-password-input")).toBe(true);
    expect(el.classList.contains("extra")).toBe(true);
  });

  test("has aria-label from label", () => {
    expect(make().el.getAttribute("aria-label")).toBe("Verification code");
  });

  test("is autofill-ready: one-time-code, numeric keypad", () => {
    const { el } = make();
    expect(el.getAttribute("autocomplete")).toBe("one-time-code");
    expect(el.getAttribute("inputmode")).toBe("numeric");
  });

  test("inputMode is overridable", () => {
    expect(make({ inputMode: "text" }).el.getAttribute("inputmode")).toBe("text");
  });

  test("maxlength and data-length follow length", () => {
    const { el } = make({ length: 8 });
    expect(el.getAttribute("maxlength")).toBe("8");
    expect(el.getAttribute("data-length")).toBe("8");
  });

  test("default pattern is digits, overridable", () => {
    expect(make().el.getAttribute("pattern")).toBe("[0-9]*");
    expect(make({ pattern: "[A-Za-z0-9]*" }).el.getAttribute("pattern")).toBe("[A-Za-z0-9]*");
  });

  test("disables spellcheck and autocapitalize", () => {
    const { el } = make();
    expect(el.getAttribute("spellcheck")).toBe("false");
    expect(el.getAttribute("autocapitalize")).toBe("off");
  });

  test("initial value is shown and typing updates the model", () => {
    const { fixture, el } = make({ value: "123" });
    expect(el.value).toBe("123");
    el.value = "456789";
    el.dispatchEvent(new Event("input"));
    expect(fixture.componentInstance.value()).toBe("456789");
  });

  test("supports name, required and disabled", () => {
    const { el } = make({ name: "otp", required: true, disabled: true });
    expect(el.getAttribute("name")).toBe("otp");
    expect(el.required).toBe(true);
    expect(el.disabled).toBe(true);
  });

  test("omits name when not given", () => {
    expect(make().el.hasAttribute("name")).toBe(false);
  });
});
