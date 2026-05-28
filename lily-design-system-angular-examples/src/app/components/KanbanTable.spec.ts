import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { KanbanTable } from "./KanbanTable";

describe("KanbanTable", () => {
  test("renders the table root with the base class", () => {
    const fixture = TestBed.createComponent(KanbanTable);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("table.kanban-table");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(KanbanTable);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("table.kanban-table");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
