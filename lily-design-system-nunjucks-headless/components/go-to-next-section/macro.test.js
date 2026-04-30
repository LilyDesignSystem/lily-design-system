import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("go-to-next-section", () => {
  it("renders a <a> with the base class", () => {
    const { document } = render("go-to-next-section", { href: "#section", label: "Test" });
    const el = document.querySelector("a.go-to-next-section");
    expect(el).toBeTruthy();
  });
});
