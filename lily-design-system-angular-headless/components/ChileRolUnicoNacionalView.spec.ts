import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ChileRolUnicoNacionalView } from "./ChileRolUnicoNacionalView";

describe("ChileRolUnicoNacionalView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(ChileRolUnicoNacionalView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.chile-rol-unico-nacional-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ChileRolUnicoNacionalView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.chile-rol-unico-nacional-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
