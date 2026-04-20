import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("expander", () => {
  it("renders a <details> with <summary>", () => {
    const { document } = render("expander", { summary: "Details", text: "x" });
    expect(document.querySelector("details.expander")).toBeTruthy();
    expect(document.querySelector("summary").textContent.trim()).toBe("Details");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("expander", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
