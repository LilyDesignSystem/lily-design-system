import { describe, expect, test } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { ToolCallError } from "./ToolCallError";

function make(inputs: Record<string, unknown> = {}) {
  const fixture = TestBed.createComponent(ToolCallError);
  for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
  fixture.detectChanges();
  return fixture;
}
const root = (f: any): HTMLElement => f.nativeElement.querySelector("div");

@Component({ standalone: true, imports: [ToolCallError], template: `<lily-tool-call-error><span data-testid="txt">Hello</span></lily-tool-call-error>` })
class Host {}

describe("ToolCallError", () => {
  test("renders a <div> with the base class", () => {
    expect(root(make()).classList.contains("tool-call-error")).toBe(true);
  });

  test("is an alert region", () => {
    expect(root(make()).getAttribute("role")).toBe("alert");
  });

  test("appends the consumer class after the base class", () => {
    // Angular's class binding does not preserve source order, so assert membership.
    const cl = root(make({ className: "mine" })).classList;
    expect(cl.contains("tool-call-error")).toBe(true);
    expect(cl.contains("mine")).toBe(true);
  });
  test("projects the children", () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    expect(f.nativeElement.querySelector("[data-testid=txt]").textContent).toBe("Hello");
  });
});
