import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("step-list-item", () => {
  // jsdom drops bare <li> elements unless wrapped — but the render
  // helper does that automatically only for table elements. Use a
  // small custom DOM source for li queries.

  it("renders a <li> with the base class", () => {
    const { html } = render("step-list-item", { text: "Cart" });
    expect(html).toContain('<li');
    expect(html).toContain('class="step-list-item"');
  });

  it("defaults data-status to 'waiting'", () => {
    const { html } = render("step-list-item", { text: "Cart" });
    expect(html).toContain('data-status="waiting"');
  });

  it("respects custom status", () => {
    const { html } = render("step-list-item", {
      text: "Cart",
      status: "finished",
    });
    expect(html).toContain('data-status="finished"');
  });

  it("supports all four status values", () => {
    for (const status of ["waiting", "in-progress", "finished", "error"]) {
      const { html } = render("step-list-item", { text: "x", status });
      expect(html).toContain(`data-status="${status}"`);
    }
  });

  it("renders aria-current='step' when current is true", () => {
    const { html } = render("step-list-item", {
      text: "Now",
      current: true,
    });
    expect(html).toContain('aria-current="step"');
  });

  it("omits aria-current when current is false", () => {
    const { html } = render("step-list-item", { text: "Cart" });
    expect(html).not.toContain('aria-current=');
  });

  it("renders aria-label when provided", () => {
    const { html } = render("step-list-item", {
      label: "Step 2 of 4: Shipping",
      html: "<strong>Shipping</strong>",
    });
    expect(html).toContain('aria-label="Step 2 of 4: Shipping"');
  });

  it("renders text content", () => {
    const { html } = render("step-list-item", { text: "Cart" });
    expect(html).toContain("Cart");
  });

  it("renders raw HTML content", () => {
    const { html } = render("step-list-item", {
      html: "<strong class='inner'>Shipping</strong>",
    });
    expect(html).toContain("<strong class='inner'>Shipping</strong>");
  });

  it("renders caller content", () => {
    const { html } = render(
      "step-list-item",
      {},
      "<strong class='inner'>Shipping</strong>",
    );
    expect(html).toContain("<strong class='inner'>Shipping</strong>");
  });

  it("appends params.classes", () => {
    const { html } = render("step-list-item", {
      text: "Cart",
      classes: "extra",
    });
    expect(html).toContain('class="step-list-item extra"');
  });

  it("renders params.attributes", () => {
    const { html } = render("step-list-item", {
      text: "Cart",
      attributes: { "data-test": "x" },
    });
    expect(html).toContain('data-test="x"');
  });

  it("contains no <style> tag", () => {
    const { html } = render("step-list-item", { text: "Cart" });
    expect(html).not.toContain("<style");
  });
});
