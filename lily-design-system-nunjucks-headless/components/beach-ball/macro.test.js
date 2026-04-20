import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("beach-ball", () => {
  it("renders a <div> with the base class and aria-hidden='true'", () => {
    const { document } = render("beach-ball", {});
    const el = document.querySelector("div.beach-ball");
    expect(el).toBeTruthy();
    expect(el.getAttribute("aria-hidden")).toBe("true");
  });

  it("appends params.classes", () => {
    const { document } = render("beach-ball", { classes: "spinning" });
    expect(document.querySelector("div.beach-ball.spinning")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("beach-ball", {
      attributes: { "data-speed": "slow" },
    });
    expect(document.querySelector("div.beach-ball").getAttribute("data-speed"))
      .toBe("slow");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("beach-ball", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
