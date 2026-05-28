import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ContainerWithFluidWidth } from "./ContainerWithFluidWidth";

describe("ContainerWithFluidWidth", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(ContainerWithFluidWidth);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.container-with-fluid-width");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ContainerWithFluidWidth);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.container-with-fluid-width");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
