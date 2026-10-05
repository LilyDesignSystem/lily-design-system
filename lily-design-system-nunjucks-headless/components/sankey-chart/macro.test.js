import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

const name = "sankey-chart";
const svg = '<svg data-testid="art" viewBox="0 0 10 10"><circle r="4"></circle></svg>';

describe("sankey-chart", () => {
  it("renders a <figure> with the base class", () => {
    const { document } = render(name, { label: "Test", html: svg });
    expect(document.querySelector("figure.sankey-chart")).toBeTruthy();
  });

  it("exposes the chart as a single image", () => {
    const { document } = render(name, { label: "Test", html: svg });
    expect(document.querySelector("figure").getAttribute("role")).toBe("img");
  });

  it("sets aria-label from label", () => {
    const { document } = render(name, { label: "Quarterly figures", html: svg });
    expect(document.querySelector("figure").getAttribute("aria-label")).toBe("Quarterly figures");
  });

  it("puts the base class first, then the consumer class", () => {
    const { document } = render(name, { label: "T", classes: "mine", html: svg });
    expect(document.querySelector("figure").getAttribute("class")).toBe("sankey-chart mine");
  });

  it("renders the consumer svg via params.html", () => {
    const { document } = render(name, { label: "T", html: svg });
    expect(document.querySelector("figure > svg")).toBeTruthy();
  });

  it("renders the consumer svg via the caller block", () => {
    const { document } = render(name, { label: "T" }, svg);
    expect(document.querySelector("figure > svg")).toBeTruthy();
  });

  it("passes describedBy through as aria-describedby", () => {
    const { document } = render(name, { label: "T", describedBy: "desc", html: svg });
    expect(document.querySelector("figure").getAttribute("aria-describedby")).toBe("desc");
  });

  it("omits aria-describedby by default", () => {
    const { document } = render(name, { label: "T", html: svg });
    expect(document.querySelector("figure").hasAttribute("aria-describedby")).toBe(false);
  });

  it("spreads id and attributes onto the figure", () => {
    const { document } = render(name, { label: "T", id: "c1", attributes: { "data-testid": "chart" }, html: svg });
    const el = document.querySelector("figure");
    expect(el.id).toBe("c1");
    expect(el.getAttribute("data-testid")).toBe("chart");
  });

  it("contains no <style> or <script> tags or inline styles", () => {
    const { html } = render(name, { label: "T", html: svg });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
