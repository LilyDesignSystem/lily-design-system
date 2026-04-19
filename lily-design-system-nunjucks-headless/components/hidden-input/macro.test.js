import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("hidden-input", () => {
  it("renders an <input type=hidden> with the base class", () => {
    const { document } = render("hidden-input", {
      name: "csrf",
      value: "abc123",
    });
    const el = document.querySelector("input");
    expect(el.getAttribute("type")).toBe("hidden");
    expect(el.classList.contains("hidden-input")).toBe(true);
  });

  it("sets name and value", () => {
    const { document } = render("hidden-input", {
      name: "session",
      value: "xyz",
    });
    const el = document.querySelector("input");
    expect(el.getAttribute("name")).toBe("session");
    expect(el.getAttribute("value")).toBe("xyz");
  });

  it("renders empty value when not provided", () => {
    const { document } = render("hidden-input", { name: "session" });
    expect(document.querySelector("input").getAttribute("value")).toBe("");
  });

  it("renders optional id", () => {
    const { document } = render("hidden-input", {
      id: "csrf-token",
      name: "csrf",
      value: "abc",
    });
    expect(document.querySelector("input").getAttribute("id"))
      .toBe("csrf-token");
  });

  it("omits id when not provided", () => {
    const { document } = render("hidden-input", { name: "x", value: "y" });
    expect(document.querySelector("input").hasAttribute("id")).toBe(false);
  });

  it("appends params.classes", () => {
    const { document } = render("hidden-input", {
      name: "x",
      value: "y",
      classes: "extra",
    });
    expect(document.querySelector("input.hidden-input.extra")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("hidden-input", { name: "x", value: "y" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
