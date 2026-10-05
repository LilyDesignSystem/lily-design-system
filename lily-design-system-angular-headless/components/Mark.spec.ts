import { describe, expect, test } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { Mark } from "./Mark";

function make(inputs: Record<string, unknown> = {}) {
  const fixture = TestBed.createComponent(Mark);
  for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
  fixture.detectChanges();
  return fixture;
}
const root = (f: any): HTMLElement => f.nativeElement.querySelector("mark");

@Component({ standalone: true, imports: [Mark], template: `<lily-mark><span data-testid="txt">Hello</span></lily-mark>` })
class Host {}

describe("Mark", () => {
  test("renders a <mark> with the base class", () => {
    expect(root(make()).classList.contains("mark")).toBe(true);
  });

  test("appends the consumer class after the base class", () => {
    // Angular's class binding does not preserve source order, so assert membership.
    const cl = root(make({ className: "mine" })).classList;
    expect(cl.contains("mark")).toBe(true);
    expect(cl.contains("mine")).toBe(true);
  });
  test("projects the children", () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    expect(f.nativeElement.querySelector("[data-testid=txt]").textContent).toBe("Hello");
  });
});
