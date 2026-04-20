import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("avatar-group", () => {
  it("renders a <div role=group> with the base class", () => {
    const { document } = render("avatar-group", { label: "Care team" });
    const el = document.querySelector("div.avatar-group");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("group");
    expect(el.getAttribute("aria-label")).toBe("Care team");
  });

  it("prefers aria-labelledby over aria-label", () => {
    const { document } = render("avatar-group", {
      label: "x",
      labelledBy: "h",
    });
    const el = document.querySelector("div.avatar-group");
    expect(el.getAttribute("aria-labelledby")).toBe("h");
    expect(el.hasAttribute("aria-label")).toBe(false);
  });

  it("renders caller block content", () => {
    const { document } = render(
      "avatar-group",
      { label: "Team" },
      '<span class="avatar">JS</span><span class="avatar">KT</span>',
    );
    expect(document.querySelectorAll("div.avatar-group span.avatar").length)
      .toBe(2);
  });

  it("appends params.classes", () => {
    const { document } = render("avatar-group", {
      label: "x",
      classes: "stacked",
    });
    expect(document.querySelector("div.avatar-group.stacked")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("avatar-group", { label: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
