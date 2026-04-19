import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("form", () => {
  it("renders a <form> with the base class", () => {
    const { document } = render("form", { action: "/submit" });
    const el = document.querySelector("form.form");
    expect(el).toBeTruthy();
  });

  it("defaults method to 'post'", () => {
    const { document } = render("form", { action: "/" });
    expect(document.querySelector("form").getAttribute("method")).toBe("post");
  });

  it("respects a custom method", () => {
    const { document } = render("form", { action: "/", method: "get" });
    expect(document.querySelector("form").getAttribute("method")).toBe("get");
  });

  it("sets action from params.action", () => {
    const { document } = render("form", { action: "/search" });
    expect(document.querySelector("form").getAttribute("action")).toBe("/search");
  });

  it("sets enctype when provided", () => {
    const { document } = render("form", {
      action: "/",
      enctype: "multipart/form-data",
    });
    expect(document.querySelector("form").getAttribute("enctype"))
      .toBe("multipart/form-data");
  });

  it("sets novalidate when true", () => {
    const { document } = render("form", { action: "/", novalidate: true });
    expect(document.querySelector("form").hasAttribute("novalidate")).toBe(true);
  });

  it("sets aria-label from params.label when labelledBy is absent", () => {
    const { document } = render("form", { label: "Contact" });
    expect(document.querySelector("form").getAttribute("aria-label")).toBe("Contact");
  });

  it("prefers aria-labelledby over aria-label", () => {
    const { document } = render("form", { label: "Fallback", labelledBy: "h" });
    const f = document.querySelector("form");
    expect(f.getAttribute("aria-labelledby")).toBe("h");
    expect(f.hasAttribute("aria-label")).toBe(false);
  });

  it("appends params.classes", () => {
    const { document } = render("form", { classes: "wide" });
    expect(document.querySelector("form.form.wide")).toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render(
      "form",
      {},
      '<button type="submit">Go</button>',
    );
    expect(document.querySelector("form button").textContent).toBe("Go");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("form", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
