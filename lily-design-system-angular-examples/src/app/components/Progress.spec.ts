import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Progress } from "./Progress";

describe("Progress", () => {
  test("renders the progress root with the base class", () => {
    const fixture = TestBed.createComponent(Progress);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("progress.progress");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Progress);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("progress.progress");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
