import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

const name = "tool-call";
const summary = '<span data-testid="sum">search_web</span>';

describe("tool-call", () => {
  it("renders a <details> with the base class, closed by default", () => {
    const { document } = render(name, { summary, text: "Body" });
    const el = document.querySelector("details.tool-call");
    expect(el).toBeTruthy();
    expect(el.hasAttribute("open")).toBe(false);
  });

  it("puts params.summary in summary.tool-call-summary and the body in div.tool-call-content", () => {
    const { document } = render(name, { summary, text: "Body" });
    expect(document.querySelector("summary.tool-call-summary [data-testid=sum]")).toBeTruthy();
    expect(document.querySelector("div.tool-call-content").textContent).toBe("Body");
  });

  it("renders open when open is true", () => {
    expect(render(name, { open: true, summary, text: "x" }).document.querySelector("details").hasAttribute("open")).toBe(true);
  });

  it("sets data-status from status, and omits it without one", () => {
    expect(render(name, { status: "done", summary, text: "x" }).document.querySelector("details").getAttribute("data-status")).toBe("done");
    expect(render(name, { summary, text: "x" }).document.querySelector("details").hasAttribute("data-status")).toBe(false);
  });

  it("is busy only while running", () => {
    expect(render(name, { status: "running", summary, text: "x" }).document.querySelector("details").getAttribute("aria-busy")).toBe("true");
    for (const s of ["pending", "done", "error"]) {
      expect(render(name, { status: s, summary, text: "x" }).document.querySelector("details").hasAttribute("aria-busy")).toBe(false);
    }
  });

  it("puts the base class first, then the consumer class", () => {
    expect(render(name, { classes: "mine", summary, text: "x" }).document.querySelector("details").getAttribute("class")).toBe("tool-call mine");
  });

  it("renders the body via html and caller content", () => {
    expect(render(name, { summary, html: "<b>Hi</b>" }).document.querySelector("div.tool-call-content > b")).toBeTruthy();
    expect(render(name, { summary }, "<i>c</i>").document.querySelector("div.tool-call-content > i")).toBeTruthy();
  });

  it("sets id and extra attributes", () => {
    const el = render(name, { id: "t1", attributes: { "data-x": "1" }, summary, text: "x" }).document.querySelector("details");
    expect(el.getAttribute("id")).toBe("t1");
    expect(el.getAttribute("data-x")).toBe("1");
  });

  it("contains no <style> or <script> tags or inline styles", () => {
    const { html } = render(name, { status: "running", summary, text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
