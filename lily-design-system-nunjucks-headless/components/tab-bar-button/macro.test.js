import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("tab-bar-button", () => {
  it("renders a <button role=tab> with the base class", () => {
    const { document } = render("tab-bar-button", { text: "One" });
    const el = document.querySelector("button.tab-bar-button");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("tab");
  });

  it("sets aria-selected and tabindex based on selected", () => {
    const { document: on } = render("tab-bar-button", {
      text: "x",
      selected: true,
    });
    const onEl = on.querySelector("button");
    expect(onEl.getAttribute("aria-selected")).toBe("true");
    expect(onEl.getAttribute("tabindex")).toBe("0");

    const { document: off } = render("tab-bar-button", { text: "x" });
    const offEl = off.querySelector("button");
    expect(offEl.getAttribute("aria-selected")).toBe("false");
    expect(offEl.getAttribute("tabindex")).toBe("-1");
  });

  it("sets aria-controls when provided", () => {
    const { document } = render("tab-bar-button", {
      text: "x",
      controls: "panel-1",
    });
    expect(document.querySelector("button").getAttribute("aria-controls"))
      .toBe("panel-1");
  });

  it("escapes text", () => {
    const { document } = render("tab-bar-button", { text: "A & B" });
    expect(document.querySelector("button").textContent.trim()).toBe("A & B");
  });

  it("supports disabled", () => {
    const { document } = render("tab-bar-button", { text: "x", disabled: true });
    expect(document.querySelector("button").hasAttribute("disabled")).toBe(true);
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("tab-bar-button", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
