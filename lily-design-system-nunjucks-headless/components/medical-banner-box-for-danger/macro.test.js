import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("medical-banner-box-for-danger", () => {
  const name = "medical-banner-box-for-danger";

  it("renders a <div role=alert> with the base class and data-severity='danger'", () => {
    const { document } = render(name, { text: "Allergy..." });
    const el = document.querySelector(`div.${name}`);
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("alert");
    expect(el.getAttribute("data-severity")).toBe("danger");
  });

  it("renders heading at level 4 by default", () => {
    const { document } = render(name, {
      heading: "Allergies",
      text: "Penicillin",
    });
    expect(document.querySelector(`div.${name} h4.medical-banner-box-heading`))
      .toBeTruthy();
  });

  it("wraps text in <p>", () => {
    const { document } = render(name, { text: "Penicillin" });
    expect(document.querySelector(`div.${name} p`).textContent.trim())
      .toBe("Penicillin");
  });

  it("renders html raw", () => {
    const { document } = render(name, {
      heading: "Alerts",
      html: "<ul><li>DNACPR</li></ul>",
    });
    expect(document.querySelector(`div.${name} ul li`).textContent).toBe("DNACPR");
  });

  it("appends params.classes", () => {
    const { document } = render(name, { text: "x", classes: "priority" });
    expect(document.querySelector(`div.${name}.priority`)).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(name, { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
