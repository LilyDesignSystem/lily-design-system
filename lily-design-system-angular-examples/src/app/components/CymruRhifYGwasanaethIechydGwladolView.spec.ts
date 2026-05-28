import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { CymruRhifYGwasanaethIechydGwladolView } from "./CymruRhifYGwasanaethIechydGwladolView";

describe("CymruRhifYGwasanaethIechydGwladolView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(CymruRhifYGwasanaethIechydGwladolView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.cymru-rhif-y-gwasanaeth-iechyd-gwladol-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(CymruRhifYGwasanaethIechydGwladolView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.cymru-rhif-y-gwasanaeth-iechyd-gwladol-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
