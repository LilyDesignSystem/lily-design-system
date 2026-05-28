import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { SuomiHenkilotunnusView } from "./SuomiHenkilotunnusView";

describe("SuomiHenkilotunnusView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(SuomiHenkilotunnusView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.suomi-henkilotunnus-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(SuomiHenkilotunnusView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.suomi-henkilotunnus-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
