import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { DateTimeLocalInput } from "./DateTimeLocalInput";

describe("DateTimeLocalInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(DateTimeLocalInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.date-time-local-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(DateTimeLocalInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.date-time-local-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
