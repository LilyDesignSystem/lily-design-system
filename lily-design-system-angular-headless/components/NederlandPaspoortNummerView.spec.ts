import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { NederlandPaspoortNummerView } from "./NederlandPaspoortNummerView";

describe("NederlandPaspoortNummerView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(NederlandPaspoortNummerView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.nederland-paspoort-nummer-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(NederlandPaspoortNummerView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.nederland-paspoort-nummer-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
