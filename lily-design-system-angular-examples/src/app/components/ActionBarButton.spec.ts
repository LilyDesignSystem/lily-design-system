import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ActionBarButton } from "./ActionBarButton";

describe("ActionBarButton", () => {
  test("renders the button root with the base class", () => {
    const fixture = TestBed.createComponent(ActionBarButton);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("button.action-bar-button");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ActionBarButton);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("button.action-bar-button");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
