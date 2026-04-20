import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("password-input-or-text-input-div", () => {
  it("renders an input and a toggle button", () => {
    const { document } = render("password-input-or-text-input-div", {
      id: "pw",
      name: "password",
    });
    expect(document.querySelector("div.password-input-or-text-input-div"))
      .toBeTruthy();
    const input = document.querySelector(".password-input-or-text-input-div-input");
    expect(input.getAttribute("type")).toBe("password");
    const btn = document.querySelector(".password-input-or-text-input-div-toggle");
    expect(btn).toBeTruthy();
    expect(btn.getAttribute("type")).toBe("button");
    expect(btn.getAttribute("aria-pressed")).toBe("false");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("password-input-or-text-input-div", { id: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
