import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Editable } from "./Editable";

describe("Editable", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(Editable);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.editable");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Editable);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.editable");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
