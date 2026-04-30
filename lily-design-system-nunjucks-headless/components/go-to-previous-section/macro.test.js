import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("go-to-previous-section", () => {
  it("renders a <a> with the base class", () => {
    const { document } = render("go-to-previous-section", { href: "#section", label: "Test" });
    const el = document.querySelector("a.go-to-previous-section");
    expect(el).toBeTruthy();
  });
});
