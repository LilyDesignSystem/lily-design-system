import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("command", () => {
  it("renders a <div role=dialog aria-modal=true> hidden by default", () => {
    const { document } = render("command", { label: "Commands" });
    const el = document.querySelector("div.command");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("dialog");
    expect(el.getAttribute("aria-modal")).toBe("true");
    expect(el.hasAttribute("hidden")).toBe(true);
  });

  it("does not set hidden when open", () => {
    const { document } = render("command", { label: "x", open: true });
    expect(document.querySelector("div").hasAttribute("hidden")).toBe(false);
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("command", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
