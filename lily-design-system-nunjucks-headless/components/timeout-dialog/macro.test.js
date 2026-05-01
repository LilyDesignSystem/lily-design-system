import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("timeout-dialog", () => {
  it("renders a <dialog> with the base class", () => {
    const { document } = render("timeout-dialog", { label: "Test", text: "Content" });
    const el = document.querySelector(".timeout-dialog");
    expect(el).toBeTruthy();
  });

  it("appends params.classes to the root element", () => {
    const { document } = render("timeout-dialog", { label: "Test", classes: "extra" });
    const el = document.querySelector(".timeout-dialog.extra");
    expect(el).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("timeout-dialog", { label: "Test" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
