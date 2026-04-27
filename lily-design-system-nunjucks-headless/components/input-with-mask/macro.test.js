import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("input-with-mask", () => {
  const baseParams = { label: "Phone", mask: "(___) ___-____" };

  it("renders a <div> with the base class", () => {
    const { document } = render("input-with-mask", baseParams);
    expect(document.querySelector("div.input-with-mask")).toBeTruthy();
  });

  it("renders data-mask attribute on the wrapper", () => {
    const { document } = render("input-with-mask", baseParams);
    expect(document.querySelector("div.input-with-mask").getAttribute("data-mask"))
      .toBe("(___) ___-____");
  });

  it("renders the mask display span with aria-hidden", () => {
    const { document } = render("input-with-mask", baseParams);
    const span = document.querySelector(".input-with-mask-display");
    expect(span).toBeTruthy();
    expect(span.getAttribute("aria-hidden")).toBe("true");
    expect(span.textContent).toBe("(___) ___-____");
  });

  it("renders an <input type='text'> with aria-label", () => {
    const { document } = render("input-with-mask", baseParams);
    const input = document.querySelector("input.input-with-mask-control");
    expect(input).toBeTruthy();
    expect(input.getAttribute("type")).toBe("text");
    expect(input.getAttribute("aria-label")).toBe("Phone");
  });

  it("renders the value when provided", () => {
    const { document } = render("input-with-mask", {
      ...baseParams,
      value: "(123) 456-7890",
    });
    expect(document.querySelector("input.input-with-mask-control").getAttribute("value"))
      .toBe("(123) 456-7890");
  });

  it("renders disabled when disabled is true", () => {
    const { document } = render("input-with-mask", {
      ...baseParams,
      disabled: true,
    });
    expect(document.querySelector("input.input-with-mask-control").hasAttribute("disabled"))
      .toBe(true);
  });

  it("renders placeholder when provided", () => {
    const { document } = render("input-with-mask", {
      ...baseParams,
      placeholder: "(555) 555-5555",
    });
    expect(document.querySelector("input.input-with-mask-control").getAttribute("placeholder"))
      .toBe("(555) 555-5555");
  });

  it("renders name when provided", () => {
    const { document } = render("input-with-mask", {
      ...baseParams,
      name: "phone",
    });
    expect(document.querySelector("input.input-with-mask-control").getAttribute("name"))
      .toBe("phone");
  });

  it("appends params.classes", () => {
    const { document } = render("input-with-mask", {
      ...baseParams,
      classes: "wide",
    });
    expect(document.querySelector("div.input-with-mask.wide")).toBeTruthy();
  });

  it("renders params.attributes on the wrapper", () => {
    const { document } = render("input-with-mask", {
      ...baseParams,
      attributes: { "data-test": "x" },
    });
    expect(document.querySelector("div.input-with-mask").getAttribute("data-test"))
      .toBe("x");
  });

  it("contains no <style> tag", () => {
    const { html } = render("input-with-mask", baseParams);
    expect(html).not.toContain("<style");
  });
});
