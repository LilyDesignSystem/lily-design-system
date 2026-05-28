import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ToolBarButton } from "./ToolBarButton";

describe("ToolBarButton", () => {
  test("renders the button root with the base class", () => {
    const fixture = TestBed.createComponent(ToolBarButton);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("button.tool-bar-button");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ToolBarButton);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("button.tool-bar-button");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
