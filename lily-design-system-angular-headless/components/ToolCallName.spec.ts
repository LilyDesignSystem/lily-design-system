import { describe, expect, test } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { ToolCallName } from "./ToolCallName";

function make(inputs: Record<string, unknown> = {}) {
  const fixture = TestBed.createComponent(ToolCallName);
  for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
  fixture.detectChanges();
  return fixture;
}
const root = (f: any): HTMLElement => f.nativeElement.querySelector("span");

@Component({ standalone: true, imports: [ToolCallName], template: `<lily-tool-call-name><span data-testid="txt">Hello</span></lily-tool-call-name>` })
class Host {}

describe("ToolCallName", () => {
  test("renders a <span> with the base class", () => {
    expect(root(make()).classList.contains("tool-call-name")).toBe(true);
  });

  test("appends the consumer class after the base class", () => {
    // Angular's class binding does not preserve source order, so assert membership.
    const cl = root(make({ className: "mine" })).classList;
    expect(cl.contains("tool-call-name")).toBe(true);
    expect(cl.contains("mine")).toBe(true);
  });
  test("projects the children", () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    expect(f.nativeElement.querySelector("[data-testid=txt]").textContent).toBe("Hello");
  });
});
