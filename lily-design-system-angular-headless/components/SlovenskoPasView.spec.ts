import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { SlovenskoPasView } from "./SlovenskoPasView";

describe("SlovenskoPasView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(SlovenskoPasView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.slovensko-pas-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(SlovenskoPasView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.slovensko-pas-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
