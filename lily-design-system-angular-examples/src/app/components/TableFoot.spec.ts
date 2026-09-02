import { Component } from "@angular/core";
import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TableFoot } from "./TableFoot";

// TableFoot is an attribute-selector component (`tfoot[lily-table-foot]`): its host is the
// native <tfoot> the consumer writes, not a wrapper element, so tests mount it via a
// small host template rather than `TestBed.createComponent(TableFoot)` directly (the
// latter has no <tfoot> to attach to and falls back to a bare <div>).
@Component({
  standalone: true,
  imports: [TableFoot],
  template: `<tfoot lily-table-foot [className]="className"></tfoot>`,
})
class TestHost {
  className = "";
}

describe("TableFoot", () => {
  test("the host is the tfoot itself — no wrapper element — with the base class", () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("tfoot");
    expect(el.tagName).toBe("TFOOT");
    expect(el.classList.contains("table-foot")).toBe(true);
  });

  test("appends the className input to the host class list", () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.componentInstance.className = "extra";
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("tfoot");
    expect(el.classList.contains("extra")).toBe(true);
  });
});
