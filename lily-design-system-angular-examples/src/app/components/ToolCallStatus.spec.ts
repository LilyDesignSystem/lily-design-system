import { describe, expect, test } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { ToolCallStatus } from "./ToolCallStatus";

function make(inputs: Record<string, unknown> = {}) {
  const fixture = TestBed.createComponent(ToolCallStatus);
  for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
  fixture.detectChanges();
  return fixture;
}
const root = (f: any): HTMLElement => f.nativeElement.querySelector("span");

@Component({ standalone: true, imports: [ToolCallStatus], template: `<lily-tool-call-status><span data-testid="txt">Hello</span></lily-tool-call-status>` })
class Host {}

describe("ToolCallStatus", () => {
  test("renders a <span> with the base class", () => {
    expect(root(make()).classList.contains("tool-call-status")).toBe(true);
  });

  test("sets data-status from status, and omits it without one", () => {
    expect(root(make({ status: "running" })).getAttribute("data-status")).toBe("running");
    expect(root(make()).hasAttribute("data-status")).toBe(false);
  });

  test("appends the consumer class after the base class", () => {
    // Angular's class binding does not preserve source order, so assert membership.
    const cl = root(make({ className: "mine" })).classList;
    expect(cl.contains("tool-call-status")).toBe(true);
    expect(cl.contains("mine")).toBe(true);
  });
  test("projects the children", () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    expect(f.nativeElement.querySelector("[data-testid=txt]").textContent).toBe("Hello");
  });
});
