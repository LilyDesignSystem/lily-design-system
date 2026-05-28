import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TableFoot } from "./TableFoot";

describe("TableFoot", () => {
  test("renders the tfoot root with the base class", () => {
    const fixture = TestBed.createComponent(TableFoot);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("tfoot.table-foot");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(TableFoot);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("tfoot.table-foot");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
