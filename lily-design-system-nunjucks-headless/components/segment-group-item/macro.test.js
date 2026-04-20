import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("segment-group-item", () => {
  it("renders a <button role=radio> with the base class", () => {
    const { document } = render("segment-group-item", { text: "Day" });
    const el = document.querySelector("button.segment-group-item");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("radio");
  });

  it("defaults aria-checked='false' and tabindex='-1' when not selected", () => {
    const { document } = render("segment-group-item", { text: "Day" });
    const el = document.querySelector("button.segment-group-item");
    expect(el.getAttribute("aria-checked")).toBe("false");
    expect(el.getAttribute("tabindex")).toBe("-1");
  });

  it("sets aria-checked='true' and tabindex='0' when selected", () => {
    const { document } = render("segment-group-item", {
      text: "Day",
      checked: true,
    });
    const el = document.querySelector("button.segment-group-item");
    expect(el.getAttribute("aria-checked")).toBe("true");
    expect(el.getAttribute("tabindex")).toBe("0");
  });

  it("supports disabled", () => {
    const { document } = render("segment-group-item", {
      text: "Day",
      disabled: true,
    });
    expect(document.querySelector("button.segment-group-item").hasAttribute("disabled"))
      .toBe(true);
  });

  it("appends params.classes", () => {
    const { document } = render("segment-group-item", {
      text: "x",
      classes: "compact",
    });
    expect(document.querySelector("button.segment-group-item.compact")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("segment-group-item", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
