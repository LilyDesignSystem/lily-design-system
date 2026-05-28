import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TaskListItem } from "./TaskListItem";

describe("TaskListItem", () => {
  test("renders the li root with the base class", () => {
    const fixture = TestBed.createComponent(TaskListItem);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("li.task-list-item");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(TaskListItem);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("li.task-list-item");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
