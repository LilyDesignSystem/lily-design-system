import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { MisrAlRaqmAlQawmiView } from "./MisrAlRaqmAlQawmiView";

describe("MisrAlRaqmAlQawmiView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(MisrAlRaqmAlQawmiView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.misr-al-raqm-al-qawmi-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(MisrAlRaqmAlQawmiView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.misr-al-raqm-al-qawmi-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
