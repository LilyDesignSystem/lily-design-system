import { describe, expect, test } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { SankeyChart } from "./SankeyChart";

function make(inputs: Record<string, unknown> = {}) {
  const fixture = TestBed.createComponent(SankeyChart);
  fixture.componentRef.setInput("label", "Test");
  for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
  fixture.detectChanges();
  return fixture;
}
const fig = (f: any): HTMLElement => f.nativeElement.querySelector("figure");

@Component({
  standalone: true,
  imports: [SankeyChart],
  template: `<lily-sankey-chart label="T"><svg data-testid="art" viewBox="0 0 10 10"><circle r="4" /></svg></lily-sankey-chart>`,
})
class Host {}

describe("SankeyChart", () => {
  test("renders a <figure> with the base class", () => {
    expect(fig(make()).classList.contains("sankey-chart")).toBe(true);
  });
  test("exposes the chart as a single image", () => {
    const el = fig(make());
    expect(el.tagName).toBe("FIGURE");
    expect(el.getAttribute("role")).toBe("img");
  });
  test("sets aria-label from label", () => {
    expect(fig(make({ label: "Quarterly figures" })).getAttribute("aria-label")).toBe("Quarterly figures");
  });
  test("keeps the base class and adds the consumer class", () => {
    const cls = fig(make({ className: "mine" })).classList;
    expect(cls.contains("sankey-chart")).toBe(true);
    expect(cls.contains("mine")).toBe(true);
  });
  test("renders the consumer svg as children", () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    const svg = f.nativeElement.querySelector("[data-testid=art]");
    expect(svg.closest("figure")).toBe(fig(f));
  });
  test("passes aria-describedby through to the figure", () => {
    expect(fig(make({ describedBy: "desc" })).getAttribute("aria-describedby")).toBe("desc");
  });
  test("omits aria-describedby by default", () => {
    expect(fig(make()).hasAttribute("aria-describedby")).toBe(false);
  });
});
