import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { LietuvaPasasView } from "./LietuvaPasasView";

describe("LietuvaPasasView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(LietuvaPasasView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.lietuva-pasas-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(LietuvaPasasView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.lietuva-pasas-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
