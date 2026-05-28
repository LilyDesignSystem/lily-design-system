import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { KanbanTableRow } from "./KanbanTableRow";

describe("KanbanTableRow", () => {
  test("renders the tr root with the base class", () => {
    const fixture = TestBed.createComponent(KanbanTableRow);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("tr.kanban-table-row");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(KanbanTableRow);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("tr.kanban-table-row");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
