import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("image-file-input", () => {
  it("renders an <input type=file> with accept='image/*'", () => {
    const { document } = render("image-file-input", { id: "avatar" });
    const el = document.querySelector("input.image-file-input");
    expect(el).toBeTruthy();
    expect(el.getAttribute("type")).toBe("file");
    expect(el.getAttribute("accept")).toBe("image/*");
  });

  it("supports multiple", () => {
    const { document } = render("image-file-input", { multiple: true });
    expect(document.querySelector("input").hasAttribute("multiple")).toBe(true);
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("image-file-input", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
