import { Component } from "@angular/core";
import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { DataTableRow } from "./DataTableRow";

// DataTableRow is an attribute-selector component (`tr[lily-data-table-row]`): its host is the
// native <tr> the consumer writes, not a wrapper element, so tests mount it via a
// small host template rather than `TestBed.createComponent(DataTableRow)` directly (the
// latter has no <tr> to attach to and falls back to a bare <div>).
@Component({
  standalone: true,
  imports: [DataTableRow],
  template: `<tr lily-data-table-row [className]="className"></tr>`,
})
class TestHost {
  className = "";
}

describe("DataTableRow", () => {
  test("the host is the tr itself — no wrapper element — with the base class", () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("tr");
    expect(el.tagName).toBe("TR");
    expect(el.classList.contains("data-table-row")).toBe(true);
  });

  test("appends the className input to the host class list", () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.componentInstance.className = "extra";
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("tr");
    expect(el.classList.contains("extra")).toBe(true);
  });
});
