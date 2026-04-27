import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("tree-select", () => {
  it("renders a <div> with the base class and combobox role", () => {
    const { document } = render("tree-select", { label: "Category" });
    const el = document.querySelector("div.tree-select");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("combobox");
    expect(el.getAttribute("aria-haspopup")).toBe("tree");
  });

  it("requires and renders aria-label", () => {
    const { document } = render("tree-select", { label: "Category" });
    expect(document.querySelector("div.tree-select").getAttribute("aria-label"))
      .toBe("Category");
  });

  it("renders aria-expanded='false' by default", () => {
    const { document } = render("tree-select", { label: "Category" });
    expect(document.querySelector("div.tree-select").getAttribute("aria-expanded"))
      .toBe("false");
  });

  it("renders aria-expanded='true' when expanded", () => {
    const { document } = render("tree-select", {
      label: "Category",
      expanded: true,
    });
    expect(document.querySelector("div.tree-select").getAttribute("aria-expanded"))
      .toBe("true");
  });

  it("omits aria-multiselectable by default", () => {
    const { document } = render("tree-select", { label: "Category" });
    expect(
      document.querySelector("div.tree-select").hasAttribute("aria-multiselectable"),
    ).toBe(false);
  });

  it("renders aria-multiselectable='true' when multiple is true", () => {
    const { document } = render("tree-select", {
      label: "Category",
      multiple: true,
    });
    expect(
      document.querySelector("div.tree-select").getAttribute("aria-multiselectable"),
    ).toBe("true");
  });

  it("renders a trigger button with placeholder", () => {
    const { document } = render("tree-select", {
      label: "Category",
      placeholder: "Pick one",
    });
    const btn = document.querySelector("button.tree-select-trigger");
    expect(btn).toBeTruthy();
    expect(btn.getAttribute("type")).toBe("button");
    expect(btn.textContent.trim()).toBe("Pick one");
  });

  it("renders the value in preference to placeholder", () => {
    const { document } = render("tree-select", {
      label: "Category",
      placeholder: "Pick one",
      value: "Books / Fiction",
    });
    expect(
      document.querySelector("button.tree-select-trigger").textContent.trim(),
    ).toBe("Books / Fiction");
  });

  it("disables the trigger when disabled is true", () => {
    const { document } = render("tree-select", {
      label: "Category",
      disabled: true,
    });
    expect(
      document.querySelector("button.tree-select-trigger").hasAttribute("disabled"),
    ).toBe(true);
  });

  it("hides the panel by default", () => {
    const { document } = render("tree-select", { label: "Category" });
    expect(
      document.querySelector("div.tree-select-panel").hasAttribute("hidden"),
    ).toBe(true);
  });

  it("shows the panel when expanded", () => {
    const { document } = render(
      "tree-select",
      { label: "Category", expanded: true },
      "<ul role='tree'></ul>",
    );
    expect(
      document.querySelector("div.tree-select-panel").hasAttribute("hidden"),
    ).toBe(false);
  });

  it("renders caller content into the panel", () => {
    const { document } = render(
      "tree-select",
      { label: "Category", expanded: true },
      "<ul role='tree' class='inner'></ul>",
    );
    expect(document.querySelector("div.tree-select-panel ul.inner")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("tree-select", {
      label: "Category",
      classes: "extra",
    });
    expect(document.querySelector("div.tree-select.extra")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("tree-select", {
      label: "Category",
      attributes: { "data-test": "x" },
    });
    expect(document.querySelector("div.tree-select").getAttribute("data-test"))
      .toBe("x");
  });

  it("contains no <style> tag", () => {
    const { html } = render("tree-select", { label: "Category" });
    expect(html).not.toContain("<style");
  });
});
