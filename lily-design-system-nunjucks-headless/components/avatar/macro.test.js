import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("avatar", () => {
  it("renders a <span role=img> with the base class", () => {
    const { document } = render("avatar", { label: "Jane Smith" });
    const el = document.querySelector("span.avatar");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("img");
    expect(el.getAttribute("aria-label")).toBe("Jane Smith");
  });

  it("renders caller block content", () => {
    const { document } = render(
      "avatar",
      { label: "Jane" },
      '<span class="avatar-text">JS</span>',
    );
    expect(document.querySelector("span.avatar .avatar-text")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("avatar", {
      label: "x",
      classes: "large",
    });
    expect(document.querySelector("span.avatar.large")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("avatar", { label: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
