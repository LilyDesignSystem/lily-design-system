import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("tile-map", () => {
  it("renders a <div> with class tile-map", () => {
    const { document } = render("tile-map", { label: "USA tile map" }, "<button data-tile></button>");
    expect(document.querySelector("div.tile-map")).toBeTruthy();
  });

  it("applies role=img with aria-label and aria-roledescription", () => {
    const { document } = render("tile-map", { label: "USA tile map" }, "x");
    const root = document.querySelector(".tile-map");
    expect(root.getAttribute("role")).toBe("img");
    expect(root.getAttribute("aria-label")).toBe("USA tile map");
    expect(root.getAttribute("aria-roledescription")).toBe("tile map");
  });

  it("renders caller content", () => {
    const { document } = render("tile-map", { label: "x" }, "<button data-tile>A</button>");
    expect(document.querySelector("[data-tile]").textContent).toBe("A");
  });
});
