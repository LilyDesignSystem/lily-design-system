import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("currency-input", () => {
  it("renders a <div> with a symbol and a text input", () => {
    const { document } = render("currency-input", {
      id: "amount",
      name: "amount",
      value: "12.50",
      label: "Amount",
    });
    const wrap = document.querySelector("div.currency-input");
    expect(wrap).toBeTruthy();
    expect(wrap.querySelector(".currency-input-symbol").textContent.trim())
      .toBe("£");
    const input = wrap.querySelector("input.currency-input-value");
    expect(input.getAttribute("type")).toBe("text");
    expect(input.getAttribute("inputmode")).toBe("decimal");
    expect(input.getAttribute("value")).toBe("12.50");
  });

  it("respects currencySymbol override", () => {
    const { document } = render("currency-input", { currencySymbol: "$" });
    expect(document.querySelector(".currency-input-symbol").textContent.trim())
      .toBe("$");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("currency-input", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
