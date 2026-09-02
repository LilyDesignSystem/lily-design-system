import { Component } from "@angular/core";
import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { KanbanTableHead } from "./KanbanTableHead";

// KanbanTableHead is an attribute-selector component (`thead[lily-kanban-table-head]`): its host is the
// native <thead> the consumer writes, not a wrapper element, so tests mount it via a
// small host template rather than `TestBed.createComponent(KanbanTableHead)` directly (the
// latter has no <thead> to attach to and falls back to a bare <div>).
@Component({
  standalone: true,
  imports: [KanbanTableHead],
  template: `<thead lily-kanban-table-head [className]="className"></thead>`,
})
class TestHost {
  className = "";
}

describe("KanbanTableHead", () => {
  test("the host is the thead itself — no wrapper element — with the base class", () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("thead");
    expect(el.tagName).toBe("THEAD");
    expect(el.classList.contains("kanban-table-head")).toBe(true);
  });

  test("appends the className input to the host class list", () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.componentInstance.className = "extra";
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("thead");
    expect(el.classList.contains("extra")).toBe(true);
  });
});
