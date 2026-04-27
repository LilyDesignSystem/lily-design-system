import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("mentions-input", () => {
  it("renders a <div> with the base class", () => {
    const { document } = render("mentions-input", { label: "Comment" });
    const el = document.querySelector("div.mentions-input");
    expect(el).toBeTruthy();
  });

  it("renders the default trigger char as @ via data attribute", () => {
    const { document } = render("mentions-input", { label: "Comment" });
    expect(
      document.querySelector("div.mentions-input").getAttribute("data-trigger-char"),
    ).toBe("@");
  });

  it("respects a custom triggerChar", () => {
    const { document } = render("mentions-input", {
      label: "Comment",
      triggerChar: "#",
    });
    expect(
      document.querySelector("div.mentions-input").getAttribute("data-trigger-char"),
    ).toBe("#");
  });

  it("renders an input with role='combobox' and aria-autocomplete='list'", () => {
    const { document } = render("mentions-input", { label: "Comment" });
    const input = document.querySelector("input.mentions-input-control");
    expect(input).toBeTruthy();
    expect(input.getAttribute("role")).toBe("combobox");
    expect(input.getAttribute("aria-haspopup")).toBe("listbox");
    expect(input.getAttribute("aria-autocomplete")).toBe("list");
    expect(input.getAttribute("type")).toBe("text");
  });

  it("requires and applies aria-label to the input", () => {
    const { document } = render("mentions-input", { label: "Comment" });
    expect(document.querySelector("input").getAttribute("aria-label"))
      .toBe("Comment");
  });

  it("renders aria-expanded='false' by default and hides suggestions", () => {
    const { document } = render("mentions-input", { label: "Comment" });
    expect(document.querySelector("input").getAttribute("aria-expanded"))
      .toBe("false");
    expect(
      document.querySelector("div.mentions-input-suggestions").hasAttribute("hidden"),
    ).toBe(true);
  });

  it("renders aria-expanded='true' and shows suggestions when expanded", () => {
    const { document } = render("mentions-input", {
      label: "Comment",
      expanded: true,
    }, "<ul role='listbox'></ul>");
    expect(document.querySelector("input").getAttribute("aria-expanded"))
      .toBe("true");
    expect(
      document.querySelector("div.mentions-input-suggestions").hasAttribute("hidden"),
    ).toBe(false);
  });

  it("renders the value", () => {
    const { document } = render("mentions-input", {
      label: "Comment",
      value: "hello",
    });
    expect(document.querySelector("input").getAttribute("value")).toBe("hello");
  });

  it("renders placeholder when supplied", () => {
    const { document } = render("mentions-input", {
      label: "Comment",
      placeholder: "Type @ to mention",
    });
    expect(document.querySelector("input").getAttribute("placeholder"))
      .toBe("Type @ to mention");
  });

  it("renders disabled when disabled is true", () => {
    const { document } = render("mentions-input", {
      label: "Comment",
      disabled: true,
    });
    expect(document.querySelector("input").hasAttribute("disabled")).toBe(true);
  });

  it("renders caller content into the suggestions panel", () => {
    const { document } = render(
      "mentions-input",
      { label: "Comment", expanded: true },
      "<ul role='listbox' class='inner'></ul>",
    );
    expect(
      document.querySelector("div.mentions-input-suggestions ul.inner"),
    ).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("mentions-input", {
      label: "Comment",
      classes: "extra",
    });
    expect(document.querySelector("div.mentions-input.extra")).toBeTruthy();
  });

  it("renders params.attributes on the root", () => {
    const { document } = render("mentions-input", {
      label: "Comment",
      attributes: { "data-test": "x" },
    });
    expect(document.querySelector("div.mentions-input").getAttribute("data-test"))
      .toBe("x");
  });

  it("contains no <style> tag", () => {
    const { html } = render("mentions-input", { label: "Comment" });
    expect(html).not.toContain("<style");
  });
});
