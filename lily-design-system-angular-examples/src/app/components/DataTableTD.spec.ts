import { Component } from "@angular/core";
import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { DataTableTD } from "./DataTableTD";

// DataTableTD is an attribute-selector component (`td[lily-data-table-td]`): its host is the
// native <td> the consumer writes, not a wrapper element, so tests mount it via a
// small host template rather than `TestBed.createComponent(DataTableTD)` directly (the
// latter has no <td> to attach to and falls back to a bare <div>).
@Component({
  standalone: true,
  imports: [DataTableTD],
  template: `<td lily-data-table-td [className]="className"></td>`,
})
class TestHost {
  className = "";
}

describe("DataTableTD", () => {
  test("the host is the td itself — no wrapper element — with the base class", () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("td");
    expect(el.tagName).toBe("TD");
    expect(el.classList.contains("data-table-td")).toBe(true);
  });

  test("appends the className input to the host class list", () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.componentInstance.className = "extra";
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("td");
    expect(el.classList.contains("extra")).toBe(true);
  });
});
