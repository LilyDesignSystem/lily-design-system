import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TaskBarButton } from "./TaskBarButton";

describe("TaskBarButton", () => {
  test("renders the button root with the base class", () => {
    const fixture = TestBed.createComponent(TaskBarButton);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("button.task-bar-button");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(TaskBarButton);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("button.task-bar-button");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
