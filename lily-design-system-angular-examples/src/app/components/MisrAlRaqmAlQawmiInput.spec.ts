import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { MisrAlRaqmAlQawmiInput } from "./MisrAlRaqmAlQawmiInput";

describe("MisrAlRaqmAlQawmiInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(MisrAlRaqmAlQawmiInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.misr-al-raqm-al-qawmi-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(MisrAlRaqmAlQawmiInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.misr-al-raqm-al-qawmi-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
