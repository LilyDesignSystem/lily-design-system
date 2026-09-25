import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { PrathetThaiLekPrajamTuaPrachachonView } from "./PrathetThaiLekPrajamTuaPrachachonView";

describe("PrathetThaiLekPrajamTuaPrachachonView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(PrathetThaiLekPrajamTuaPrachachonView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.prathet-thai-lek-prajam-tua-prachachon-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(PrathetThaiLekPrajamTuaPrachachonView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.prathet-thai-lek-prajam-tua-prachachon-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
