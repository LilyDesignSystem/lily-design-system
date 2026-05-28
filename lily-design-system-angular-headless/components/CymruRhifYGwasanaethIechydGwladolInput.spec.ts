import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { CymruRhifYGwasanaethIechydGwladolInput } from "./CymruRhifYGwasanaethIechydGwladolInput";

describe("CymruRhifYGwasanaethIechydGwladolInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(CymruRhifYGwasanaethIechydGwladolInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.cymru-rhif-y-gwasanaeth-iechyd-gwladol-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(CymruRhifYGwasanaethIechydGwladolInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.cymru-rhif-y-gwasanaeth-iechyd-gwladol-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
