import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { FeatureCard } from "./FeatureCard";

describe("FeatureCard", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(FeatureCard);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.feature-card");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(FeatureCard);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.feature-card");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
