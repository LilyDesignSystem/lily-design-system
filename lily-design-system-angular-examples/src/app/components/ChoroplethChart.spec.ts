import { describe, expect, test } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { ChoroplethChart } from "./ChoroplethChart";

function make(inputs: Record<string, unknown> = {}) {
  const fixture = TestBed.createComponent(ChoroplethChart);
  fixture.componentRef.setInput("label", "Test");
  for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
  fixture.detectChanges();
  return fixture;
}
const fig = (f: any): HTMLElement => f.nativeElement.querySelector("figure");
const graphic = (f: any): HTMLElement => f.nativeElement.querySelector(".choropleth-chart-graphic");
const wrap = (f: any): HTMLElement => f.nativeElement.querySelector(".choropleth-chart-data-table");

@Component({
  standalone: true,
  imports: [ChoroplethChart],
  template: `<lily-choropleth-chart label="T"><svg data-testid="art" viewBox="0 0 10 10"><circle r="4" /></svg></lily-choropleth-chart>`,
})
class Host {}

@Component({
  standalone: true,
  imports: [ChoroplethChart],
  template: `<lily-choropleth-chart label="T"><svg data-testid="art" viewBox="0 0 10 10"><circle r="4" /></svg><table dataTable><caption>Values</caption><tbody><tr><th scope="row">A</th><td>1</td></tr></tbody></table></lily-choropleth-chart>`,
})
class HostWithTable {}

describe("ChoroplethChart", () => {
  test("renders a <figure> with the base class", () => {
    expect(fig(make()).classList.contains("choropleth-chart")).toBe(true);
  });
  test("exposes the graphic as a single named image", () => {
    const g = graphic(make());
    expect(g.tagName).toBe("DIV");
    expect(g.getAttribute("role")).toBe("img");
    expect(g.getAttribute("aria-label")).toBe("Test");
    expect(g.className).toBe("choropleth-chart-graphic");
  });
  test("omits aria-label when label is empty", () => {
    expect(graphic(make({ label: "" })).hasAttribute("aria-label")).toBe(false);
  });
  test("does not put role=img on the figure", () => {
    expect(fig(make()).hasAttribute("role")).toBe(false);
  });
  test("appends the consumer class after the base class", () => {
    // Angular's class binding does not preserve source order, so assert membership.
    const cl = fig(make({ className: "mine" })).classList;
    expect(cl.contains("choropleth-chart")).toBe(true);
    expect(cl.contains("mine")).toBe(true);
  });
  test("describedBy sets aria-describedby on the image wrapper, and is absent by default", () => {
    expect(graphic(make()).hasAttribute("aria-describedby")).toBe(false);
    expect(graphic(make({ describedBy: "desc" })).getAttribute("aria-describedby")).toBe("desc");
  });
  test("projects the consumer svg inside the image wrapper", () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    const art = f.nativeElement.querySelector("[data-testid=art]");
    expect(art.closest("[role=img]")).toBe(f.nativeElement.querySelector(".choropleth-chart-graphic"));
  });
  test("the data-table wrapper is empty when nothing is projected", () => {
    expect(wrap(make()).children.length).toBe(0);
  });
  test("projects a [dataTable] element into .choropleth-chart-data-table, a sibling after the graphic", () => {
    const f = TestBed.createComponent(HostWithTable);
    f.detectChanges();
    const w = f.nativeElement.querySelector(".choropleth-chart-data-table");
    expect(w.querySelector("table")).toBeTruthy();
    expect(w.previousElementSibling).toBe(f.nativeElement.querySelector(".choropleth-chart-graphic"));
    expect(w.parentElement.tagName).toBe("FIGURE");
  });
  test("keeps the table outside the role=img element so assistive technology can reach it", () => {
    const f = TestBed.createComponent(HostWithTable);
    f.detectChanges();
    expect(f.nativeElement.querySelector("table").closest("[role=img]")).toBeNull();
  });
});
