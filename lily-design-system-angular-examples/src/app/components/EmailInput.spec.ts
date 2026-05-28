import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { EmailInput } from "./EmailInput";

describe("EmailInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(EmailInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.email-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(EmailInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.email-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
