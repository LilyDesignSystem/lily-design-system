import { Component } from "@angular/core";
import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TableTD } from "./TableTD";

// TableTD is an attribute-selector component (`td[lily-table-td]`): its host is the
// native <td> the consumer writes, not a wrapper element, so tests mount it via a
// small host template rather than `TestBed.createComponent(TableTD)` directly (the
// latter has no <td> to attach to and falls back to a bare <div>).
@Component({
  standalone: true,
  imports: [TableTD],
  template: `<td lily-table-td [className]="className"></td>`,
})
class TestHost {
  className = "";
}

describe("TableTD", () => {
  test("the host is the td itself — no wrapper element — with the base class", () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("td");
    expect(el.tagName).toBe("TD");
    expect(el.classList.contains("table-td")).toBe(true);
  });

  test("appends the className input to the host class list", () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.componentInstance.className = "extra";
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("td");
    expect(el.classList.contains("extra")).toBe(true);
  });
});
