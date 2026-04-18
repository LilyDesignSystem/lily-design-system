import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("button", () => {
  it("renders a <button> with the base class", () => {
    const { document } = render("button", { text: "Save" });
    const el = document.querySelector("button");
    expect(el).toBeTruthy();
    expect(el.classList.contains("button")).toBe(true);
  });

  it("escapes params.text into the button content", () => {
    const { document } = render("button", { text: "Save & continue" });
    const el = document.querySelector("button");
    expect(el.textContent.trim()).toBe("Save & continue");
  });

  it("renders params.html as raw HTML", () => {
    const { document } = render("button", { html: "<span>Raw</span>" });
    const el = document.querySelector("button");
    expect(el.querySelector("span")).toBeTruthy();
    expect(el.querySelector("span").textContent).toBe("Raw");
  });

  it("defaults type to 'button'", () => {
    const { document } = render("button", { text: "x" });
    expect(document.querySelector("button").getAttribute("type")).toBe("button");
  });

  it("respects a custom type", () => {
    const { document } = render("button", { text: "x", type: "submit" });
    expect(document.querySelector("button").getAttribute("type")).toBe("submit");
  });

  it("appends params.classes after the base class", () => {
    const { document } = render("button", { text: "x", classes: "extra other" });
    const el = document.querySelector("button");
    expect(el.classList.contains("button")).toBe(true);
    expect(el.classList.contains("extra")).toBe(true);
    expect(el.classList.contains("other")).toBe(true);
  });

  it("renders params.label as aria-label", () => {
    const { document } = render("button", { text: "x", label: "Close dialog" });
    expect(document.querySelector("button").getAttribute("aria-label"))
      .toBe("Close dialog");
  });

  it("omits aria-label when no label is given", () => {
    const { document } = render("button", { text: "x" });
    expect(document.querySelector("button").hasAttribute("aria-label")).toBe(false);
  });

  it("sets id, name, and value when provided", () => {
    const { document } = render("button", {
      text: "x",
      id: "my-btn",
      name: "action",
      value: "go",
    });
    const el = document.querySelector("button");
    expect(el.getAttribute("id")).toBe("my-btn");
    expect(el.getAttribute("name")).toBe("action");
    expect(el.getAttribute("value")).toBe("go");
  });

  it("renders the disabled attribute when disabled is true", () => {
    const { document } = render("button", { text: "x", disabled: true });
    expect(document.querySelector("button").hasAttribute("disabled")).toBe(true);
  });

  it("omits the disabled attribute when disabled is false", () => {
    const { document } = render("button", { text: "x", disabled: false });
    expect(document.querySelector("button").hasAttribute("disabled")).toBe(false);
  });

  it("renders params.attributes as HTML attributes", () => {
    const { document } = render("button", {
      text: "x",
      attributes: { "data-test": "abc", "data-index": "1" },
    });
    const el = document.querySelector("button");
    expect(el.getAttribute("data-test")).toBe("abc");
    expect(el.getAttribute("data-index")).toBe("1");
  });

  it("renders caller block content when neither text nor html is set", () => {
    const { document } = render("button", {}, "<em>Call</em>");
    const el = document.querySelector("button");
    expect(el.querySelector("em").textContent).toBe("Call");
  });

  it("contains no <style> tag", () => {
    const { html } = render("button", { text: "x" });
    expect(html).not.toContain("<style");
  });

  it("contains no inline style attribute", () => {
    const { html } = render("button", { text: "x" });
    expect(html).not.toContain("style=");
  });

  it("contains no <script> tag", () => {
    const { html } = render("button", { text: "x" });
    expect(html).not.toContain("<script");
  });
});
