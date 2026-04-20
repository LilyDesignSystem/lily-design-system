import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("file-upload", () => {
  it("renders a <div> with label and file input", () => {
    const { document } = render("file-upload", {
      id: "up",
      name: "files",
      multiple: true,
      label: "Upload files",
    });
    expect(document.querySelector("div.file-upload")).toBeTruthy();
    expect(document.querySelector(".file-upload-label").textContent.trim())
      .toBe("Upload files");
    const input = document.querySelector(".file-upload-input");
    expect(input.getAttribute("type")).toBe("file");
    expect(input.getAttribute("name")).toBe("files");
    expect(input.hasAttribute("multiple")).toBe(true);
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("file-upload", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
