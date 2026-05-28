import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ErrorMessage } from "./ErrorMessage";

describe("ErrorMessage", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(ErrorMessage);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.error-message");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ErrorMessage);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.error-message");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
