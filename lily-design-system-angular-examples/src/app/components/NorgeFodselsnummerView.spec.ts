import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { NorgeFodselsnummerView } from "./NorgeFodselsnummerView";

describe("NorgeFodselsnummerView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(NorgeFodselsnummerView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.norge-fodselsnummer-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(NorgeFodselsnummerView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.norge-fodselsnummer-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
