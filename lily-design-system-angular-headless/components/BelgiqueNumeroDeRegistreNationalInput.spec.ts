import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { BelgiqueNumeroDeRegistreNationalInput } from "./BelgiqueNumeroDeRegistreNationalInput";

describe("BelgiqueNumeroDeRegistreNationalInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(BelgiqueNumeroDeRegistreNationalInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.belgique-numero-de-registre-national-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(BelgiqueNumeroDeRegistreNationalInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.belgique-numero-de-registre-national-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
