import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("file-manager", () => {
  it("renders a <section role=region>", () => {
    const { document } = render("file-manager", {});
    const el = document.querySelector("section.file-manager");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("region");
    expect(el.getAttribute("aria-label")).toBe("File manager");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("file-manager", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
