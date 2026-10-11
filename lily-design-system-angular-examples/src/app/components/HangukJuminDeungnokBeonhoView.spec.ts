import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { HangukJuminDeungnokBeonhoView } from "./HangukJuminDeungnokBeonhoView";

describe("HangukJuminDeungnokBeonhoView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(HangukJuminDeungnokBeonhoView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.hanguk-jumin-deungnok-beonho-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(HangukJuminDeungnokBeonhoView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.hanguk-jumin-deungnok-beonho-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });

  test("sets aria-label from the label input", () => {
    const fixture = TestBed.createComponent(HangukJuminDeungnokBeonhoView);
    fixture.componentRef.setInput("label", "Hello");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.hanguk-jumin-deungnok-beonho-view");
    expect(el.getAttribute("aria-label")).toBe("Hello");
  });

  test("renders the value as text content", () => {
    const fixture = TestBed.createComponent(HangukJuminDeungnokBeonhoView);
    fixture.componentRef.setInput("value", "abc123");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.hanguk-jumin-deungnok-beonho-view");
    expect(el.textContent).toBe("abc123");
  });
});
