import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("label", () => {
  it("renders a <label> with the base class", () => {
    const { document } = render("label", { for: "name", text: "Full name" });
    const el = document.querySelector("label");
    expect(el).toBeTruthy();
    expect(el.classList.contains("label")).toBe(true);
  });

  it("sets the for attribute from params.for", () => {
    const { document } = render("label", { for: "email", text: "Email" });
    expect(document.querySelector("label").getAttribute("for")).toBe("email");
  });

  it("omits the for attribute when not provided", () => {
    const { document } = render("label", { text: "x" });
    expect(document.querySelector("label").hasAttribute("for")).toBe(false);
  });

  it("escapes params.text", () => {
    const { document } = render("label", { text: "A & B" });
    expect(document.querySelector("label").textContent.trim()).toBe("A & B");
  });

  it("renders params.html raw", () => {
    const { document } = render("label", { html: "<span>Name</span>" });
    expect(document.querySelector("label span").textContent).toBe("Name");
  });

  it("wraps the label in <h1> when isPageHeading is true", () => {
    const { document } = render("label", {
      for: "name",
      text: "Full name",
      isPageHeading: true,
    });
    expect(document.querySelector("h1.label-heading label")).toBeTruthy();
  });

  it("omits the heading when isPageHeading is false", () => {
    const { document } = render("label", { text: "x" });
    expect(document.querySelector("h1")).toBeNull();
  });

  it("appends params.classes", () => {
    const { document } = render("label", { text: "x", classes: "bold" });
    expect(document.querySelector("label.label.bold")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("label", {
      text: "x",
      attributes: { "data-role": "primary" },
    });
    expect(document.querySelector("label").getAttribute("data-role"))
      .toBe("primary");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("label", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
