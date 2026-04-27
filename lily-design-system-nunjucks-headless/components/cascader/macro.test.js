import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("cascader", () => {
  it("renders a <div> with the base class and combobox role", () => {
    const { document } = render("cascader", { label: "Region" });
    const el = document.querySelector("div.cascader");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("combobox");
    expect(el.getAttribute("aria-haspopup")).toBe("tree");
  });

  it("requires and renders aria-label", () => {
    const { document } = render("cascader", { label: "Region" });
    expect(document.querySelector("div.cascader").getAttribute("aria-label"))
      .toBe("Region");
  });

  it("renders aria-expanded='false' by default", () => {
    const { document } = render("cascader", { label: "Region" });
    expect(document.querySelector("div.cascader").getAttribute("aria-expanded"))
      .toBe("false");
  });

  it("renders aria-expanded='true' when expanded", () => {
    const { document } = render("cascader", {
      label: "Region",
      expanded: true,
    });
    expect(document.querySelector("div.cascader").getAttribute("aria-expanded"))
      .toBe("true");
  });

  it("renders a trigger button with the placeholder", () => {
    const { document } = render("cascader", {
      label: "Region",
      placeholder: "Choose…",
    });
    const btn = document.querySelector("button.cascader-trigger");
    expect(btn).toBeTruthy();
    expect(btn.getAttribute("type")).toBe("button");
    expect(btn.textContent.trim()).toBe("Choose…");
  });

  it("renders the value when provided, in preference to placeholder", () => {
    const { document } = render("cascader", {
      label: "Region",
      placeholder: "Choose…",
      value: "Europe / France",
    });
    expect(
      document.querySelector("button.cascader-trigger").textContent.trim(),
    ).toBe("Europe / France");
  });

  it("disables the trigger when disabled is true", () => {
    const { document } = render("cascader", {
      label: "Region",
      disabled: true,
    });
    expect(
      document.querySelector("button.cascader-trigger").hasAttribute("disabled"),
    ).toBe(true);
  });

  it("hides the panel by default", () => {
    const { document } = render("cascader", { label: "Region" }, "<p>x</p>");
    expect(document.querySelector("div.cascader-panel").hasAttribute("hidden"))
      .toBe(true);
  });

  it("shows the panel when expanded", () => {
    const { document } = render("cascader", {
      label: "Region",
      expanded: true,
    }, "<p>x</p>");
    expect(document.querySelector("div.cascader-panel").hasAttribute("hidden"))
      .toBe(false);
  });

  it("renders caller content into the panel", () => {
    const { document } = render(
      "cascader",
      { label: "Region", expanded: true },
      "<ul role='tree' class='inner'></ul>",
    );
    expect(document.querySelector("div.cascader-panel ul.inner")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("cascader", {
      label: "Region",
      classes: "extra",
    });
    expect(document.querySelector("div.cascader.extra")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("cascader", {
      label: "Region",
      attributes: { "data-test": "x" },
    });
    expect(document.querySelector("div.cascader").getAttribute("data-test"))
      .toBe("x");
  });

  it("contains no <style> tag", () => {
    const { html } = render("cascader", { label: "Region" });
    expect(html).not.toContain("<style");
  });
});
