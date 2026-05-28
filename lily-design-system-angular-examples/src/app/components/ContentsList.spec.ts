import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ContentsList } from "./ContentsList";

describe("ContentsList", () => {
  test("renders the ol root with the base class", () => {
    const fixture = TestBed.createComponent(ContentsList);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("ol.contents-list");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ContentsList);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("ol.contents-list");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
