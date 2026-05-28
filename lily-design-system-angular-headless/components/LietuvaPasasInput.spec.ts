import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { LietuvaPasasInput } from "./LietuvaPasasInput";

describe("LietuvaPasasInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(LietuvaPasasInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.lietuva-pasas-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(LietuvaPasasInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.lietuva-pasas-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
