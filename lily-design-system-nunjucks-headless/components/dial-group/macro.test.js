import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("dial-group", () => {
  it("renders a <div role=group>", () => {
    const { document } = render("dial-group", { label: "Audio" });
    const el = document.querySelector("div.dial-group");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("group");
    expect(el.getAttribute("aria-label")).toBe("Audio");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("dial-group", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
