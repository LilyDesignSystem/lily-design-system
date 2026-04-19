import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("tel-link", () => {
  it("renders an <a> with tel: href and the base class", () => {
    const { document } = render("tel-link", { number: "0300 123 4567" });
    const el = document.querySelector("a.tel-link");
    expect(el).toBeTruthy();
  });

  it("strips spaces from the href", () => {
    const { document } = render("tel-link", { number: "0300 123 4567" });
    expect(document.querySelector("a").getAttribute("href"))
      .toBe("tel:03001234567");
  });

  it("strips hyphens and parentheses from the href", () => {
    const { document } = render("tel-link", { number: "(020) 7946-0958" });
    expect(document.querySelector("a").getAttribute("href"))
      .toBe("tel:02079460958");
  });

  it("preserves a + prefix for international numbers", () => {
    const { document } = render("tel-link", {
      number: "+44 20 7946 0958",
    });
    expect(document.querySelector("a").getAttribute("href"))
      .toBe("tel:+442079460958");
  });

  it("defaults text to the original formatted number", () => {
    const { document } = render("tel-link", { number: "0300 123 4567" });
    expect(document.querySelector("a").textContent.trim())
      .toBe("0300 123 4567");
  });

  it("respects params.text", () => {
    const { document } = render("tel-link", {
      number: "0300 123 4567",
      text: "Call NHS 111",
    });
    expect(document.querySelector("a").textContent.trim())
      .toBe("Call NHS 111");
  });

  it("sets aria-label from params.label", () => {
    const { document } = render("tel-link", {
      number: "999",
      label: "Call 999 for emergency services",
    });
    expect(document.querySelector("a").getAttribute("aria-label"))
      .toBe("Call 999 for emergency services");
  });

  it("appends params.classes", () => {
    const { document } = render("tel-link", {
      number: "999",
      classes: "emergency",
    });
    expect(document.querySelector("a.tel-link.emergency")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("tel-link", { number: "0300 123 4567" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
