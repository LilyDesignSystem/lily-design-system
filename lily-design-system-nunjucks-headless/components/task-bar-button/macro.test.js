import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("task-bar-button", () => {
  it("renders a <button> with the base class", () => {
    const { document } = render("task-bar-button", { text: "Start" });
    expect(document.querySelector("button.task-bar-button")).toBeTruthy();
  });

  it("sets aria-pressed when pressed is provided", () => {
    const { document: on } = render("task-bar-button", {
      text: "x",
      pressed: true,
    });
    expect(on.querySelector("button").getAttribute("aria-pressed")).toBe("true");
  });

  it("omits aria-pressed when pressed is not provided", () => {
    const { document } = render("task-bar-button", { text: "x" });
    expect(document.querySelector("button").hasAttribute("aria-pressed")).toBe(false);
  });

  it("supports disabled", () => {
    const { document } = render("task-bar-button", { text: "x", disabled: true });
    expect(document.querySelector("button").hasAttribute("disabled")).toBe(true);
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("task-bar-button", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
