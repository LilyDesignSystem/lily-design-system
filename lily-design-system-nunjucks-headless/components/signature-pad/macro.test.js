import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("signature-pad", () => {
  it("renders a <canvas>, hidden input, and clear button", () => {
    const { document } = render("signature-pad", {
      id: "sig",
      name: "signature",
    });
    expect(document.querySelector("div.signature-pad")).toBeTruthy();
    const canvas = document.querySelector("canvas.signature-pad-canvas");
    expect(canvas).toBeTruthy();
    expect(canvas.getAttribute("role")).toBe("img");
    expect(canvas.getAttribute("width")).toBe("400");
    expect(document.querySelector("input[type=hidden].signature-pad-input").getAttribute("name"))
      .toBe("signature");
    expect(document.querySelector("button.signature-pad-clear").textContent.trim())
      .toBe("Clear");
  });

  it("contains no <script> tags", () => {
    const { html } = render("signature-pad", {});
    expect(html).not.toContain("<script");
  });
});
