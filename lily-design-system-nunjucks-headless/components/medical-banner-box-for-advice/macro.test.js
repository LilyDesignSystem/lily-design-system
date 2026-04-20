import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("medical-banner-box-for-advice", () => {
  const name = "medical-banner-box-for-advice";

  it("renders a <div> with the base class and data-severity='advice'", () => {
    const { document } = render(name, { text: "Care plan..." });
    const el = document.querySelector(`div.${name}`);
    expect(el).toBeTruthy();
    expect(el.getAttribute("data-severity")).toBe("advice");
  });

  it("renders heading at level 4 by default", () => {
    const { document } = render(name, {
      heading: "Care plan",
      text: "x",
    });
    const h = document.querySelector(`div.${name} h4.medical-banner-box-heading`);
    expect(h).toBeTruthy();
    expect(h.textContent).toBe("Care plan");
  });

  it("respects custom heading level", () => {
    const { document } = render(name, {
      heading: "Contacts",
      headingLevel: 3,
      text: "x",
    });
    expect(document.querySelector(`div.${name} h3.medical-banner-box-heading`))
      .toBeTruthy();
  });

  it("wraps text in <p>", () => {
    const { document } = render(name, { text: "Follow care plan" });
    expect(document.querySelector(`div.${name} p`).textContent.trim())
      .toBe("Follow care plan");
  });

  it("renders html raw", () => {
    const { document } = render(name, {
      heading: "x",
      html: "<ul><li>a</li></ul>",
    });
    expect(document.querySelector(`div.${name} ul li`)).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render(name, { text: "x", classes: "compact" });
    expect(document.querySelector(`div.${name}.compact`)).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(name, { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
