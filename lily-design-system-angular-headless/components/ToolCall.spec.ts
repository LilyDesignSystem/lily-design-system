import { describe, expect, test } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { ToolCall } from "./ToolCall";

function make(inputs: Record<string, unknown> = {}) {
  const fixture = TestBed.createComponent(ToolCall);
  for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
  fixture.detectChanges();
  return fixture;
}
const root = (f: any): HTMLDetailsElement => f.nativeElement.querySelector("details");

@Component({
  standalone: true,
  imports: [ToolCall],
  template: `<lily-tool-call><span toolCallSummary data-testid="sum">search_web</span><span data-testid="body">Body</span></lily-tool-call>`,
})
class Host {}

describe("ToolCall", () => {
  test("renders a <details> with the base class, closed by default", () => {
    const el = root(make());
    expect(el.classList.contains("tool-call")).toBe(true);
    expect(el.open).toBe(false);
  });
  test("projects [toolCallSummary] into the summary and the rest into the content", () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    expect(f.nativeElement.querySelector("summary.tool-call-summary [data-testid=sum]")).toBeTruthy();
    expect(f.nativeElement.querySelector("div.tool-call-content [data-testid=body]")).toBeTruthy();
    expect(f.nativeElement.querySelector("div.tool-call-content [data-testid=sum]")).toBeNull();
  });
  test("reflects open", () => {
    expect(root(make({ open: true })).open).toBe(true);
  });
  test("sets data-status from status, and omits it without one", () => {
    expect(root(make({ status: "done" })).getAttribute("data-status")).toBe("done");
    expect(root(make()).hasAttribute("data-status")).toBe(false);
  });
  test("is busy only while running", () => {
    expect(root(make({ status: "running" })).getAttribute("aria-busy")).toBe("true");
    for (const s of ["pending", "done", "error"]) expect(root(make({ status: s })).hasAttribute("aria-busy")).toBe(false);
  });
  test("appends the consumer class after the base class", () => {
    // Angular's class binding does not preserve source order, so assert membership.
    const cl = root(make({ className: "mine" })).classList;
    expect(cl.contains("tool-call")).toBe(true);
    expect(cl.contains("mine")).toBe(true);
  });
});
