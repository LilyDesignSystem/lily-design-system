import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { DoList } from "./DoList";

describe("DoList", () => {
  test("renders the ul root with the base class", () => {
    const fixture = TestBed.createComponent(DoList);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("ul.do-list");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(DoList);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("ul.do-list");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
