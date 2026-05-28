import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { BelgiqueNumeroDeRegistreNationalView } from "./BelgiqueNumeroDeRegistreNationalView";

describe("BelgiqueNumeroDeRegistreNationalView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(BelgiqueNumeroDeRegistreNationalView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.belgique-numero-de-registre-national-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(BelgiqueNumeroDeRegistreNationalView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.belgique-numero-de-registre-national-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
