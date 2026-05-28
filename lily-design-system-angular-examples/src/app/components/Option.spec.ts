import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Option } from "./Option";

describe("Option", () => {
  test("renders the option root with the base class", () => {
    const fixture = TestBed.createComponent(Option);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("option.option");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Option);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("option.option");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
