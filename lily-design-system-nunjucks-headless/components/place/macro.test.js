import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("place", () => {
  it("renders an <address> with the base class", () => {
    const { document } = render("place", {
      name: "Main Clinic",
      address: "1 High Street",
    });
    expect(document.querySelector("address.place")).toBeTruthy();
    expect(document.querySelector(".place-name").textContent.trim())
      .toBe("Main Clinic");
    expect(document.querySelector(".place-address").textContent.trim())
      .toBe("1 High Street");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("place", { name: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
