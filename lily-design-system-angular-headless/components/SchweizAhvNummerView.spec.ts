import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { SchweizAhvNummerView } from "./SchweizAhvNummerView";

describe("SchweizAhvNummerView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(SchweizAhvNummerView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.schweiz-ahv-nummer-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(SchweizAhvNummerView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.schweiz-ahv-nummer-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });

  test("sets aria-label from the label input", () => {
    const fixture = TestBed.createComponent(SchweizAhvNummerView);
    fixture.componentRef.setInput("label", "Hello");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.schweiz-ahv-nummer-view");
    expect(el.getAttribute("aria-label")).toBe("Hello");
  });

  test("renders the value as text content", () => {
    const fixture = TestBed.createComponent(SchweizAhvNummerView);
    fixture.componentRef.setInput("value", "abc123");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.schweiz-ahv-nummer-view");
    expect(el.textContent).toBe("abc123");
  });
});
