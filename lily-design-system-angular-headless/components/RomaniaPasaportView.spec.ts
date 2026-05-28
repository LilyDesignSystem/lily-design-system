import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { RomaniaPasaportView } from "./RomaniaPasaportView";

describe("RomaniaPasaportView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(RomaniaPasaportView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.romania-pasaport-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(RomaniaPasaportView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.romania-pasaport-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
