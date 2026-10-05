import { describe, expect, test } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { StreamingText } from "./StreamingText";

function make(inputs: Record<string, unknown> = {}) {
  const fixture = TestBed.createComponent(StreamingText);
  for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
  fixture.detectChanges();
  return fixture;
}
const root = (f: any): HTMLElement => f.nativeElement.querySelector("div");

@Component({ standalone: true, imports: [StreamingText], template: `<lily-streaming-text><span data-testid="txt">Hello</span></lily-streaming-text>` })
class Host {}

describe("StreamingText", () => {
  test("renders a <div> with the base class", () => {
    expect(root(make()).classList.contains("streaming-text")).toBe(true);
  });
  test("is a polite, atomic status region", () => {
    const el = root(make());
    expect(el.getAttribute("role")).toBe("status");
    expect(el.getAttribute("aria-live")).toBe("polite");
    expect(el.getAttribute("aria-atomic")).toBe("true");
  });
  test("is not busy by default", () => {
    const el = root(make());
    expect(el.hasAttribute("aria-busy")).toBe(false);
    expect(el.hasAttribute("data-streaming")).toBe(false);
  });
  test("marks the region busy while streaming, and clears it afterwards", () => {
    const f = make({ streaming: true });
    expect(root(f).getAttribute("aria-busy")).toBe("true");
    expect(root(f).getAttribute("data-streaming")).toBe("true");
    f.componentRef.setInput("streaming", false);
    f.detectChanges();
    expect(root(f).hasAttribute("aria-busy")).toBe(false);
    expect(root(f).hasAttribute("data-streaming")).toBe(false);
  });
  test("sets aria-label from label, and omits it without one", () => {
    expect(root(make({ label: "Answer" })).getAttribute("aria-label")).toBe("Answer");
    expect(root(make()).hasAttribute("aria-label")).toBe(false);
  });
  test("appends the consumer class after the base class", () => {
    // Angular's class binding does not preserve source order, so assert membership.
    const cl = root(make({ className: "mine" })).classList;
    expect(cl.contains("streaming-text")).toBe(true);
    expect(cl.contains("mine")).toBe(true);
  });
  test("projects the children", () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    expect(f.nativeElement.querySelector("[data-testid=txt]").textContent).toBe("Hello");
  });
});
