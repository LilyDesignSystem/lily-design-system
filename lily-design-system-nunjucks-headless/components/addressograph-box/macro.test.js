import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("addressograph-box", () => {
  it("renders a <div> with the base class", () => {
    const { document } = render("addressograph-box", { text: "Jane Doe" });
    const el = document.querySelector("div.addressograph-box");
    expect(el).toBeTruthy();
    expect(el.textContent.trim()).toBe("Jane Doe");
  });

  it("applies aria-label when label is provided", () => {
    const { document } = render("addressograph-box", { label: "Patient identification", text: "x" });
    expect(document.querySelector("div.addressograph-box").getAttribute("aria-label"))
      .toBe("Patient identification");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("addressograph-box", { text: "y" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
