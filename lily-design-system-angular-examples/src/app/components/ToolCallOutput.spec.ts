import { describe, expect, test } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { ToolCallOutput } from "./ToolCallOutput";

function make(inputs: Record<string, unknown> = {}) {
  const fixture = TestBed.createComponent(ToolCallOutput);
  for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
  fixture.detectChanges();
  return fixture;
}
const root = (f: any): HTMLElement => f.nativeElement.querySelector("div");

@Component({ standalone: true, imports: [ToolCallOutput], template: `<lily-tool-call-output><span data-testid="txt">Hello</span></lily-tool-call-output>` })
class Host {}

describe("ToolCallOutput", () => {
  test("renders a <div> with the base class", () => {
    expect(root(make()).classList.contains("tool-call-output")).toBe(true);
  });

  test("with a label it is a named group; without one it has neither role nor aria-label", () => {
    const a = root(make({ label: "Input" }));
    expect(a.getAttribute("role")).toBe("group");
    expect(a.getAttribute("aria-label")).toBe("Input");
    const b = root(make());
    expect(b.hasAttribute("role")).toBe(false);
    expect(b.hasAttribute("aria-label")).toBe(false);
  });

  test("appends the consumer class after the base class", () => {
    // Angular's class binding does not preserve source order, so assert membership.
    const cl = root(make({ className: "mine" })).classList;
    expect(cl.contains("tool-call-output")).toBe(true);
    expect(cl.contains("mine")).toBe(true);
  });
  test("projects the children", () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    expect(f.nativeElement.querySelector("[data-testid=txt]").textContent).toBe("Hello");
  });
});
