import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("mockup-phone-landscape", () => {
  it("renders a <div> with the base class", () => {
    const { document } = render("mockup-phone-landscape", { label: "Test", text: "Body" });
    const el = document.querySelector("div.mockup-phone-landscape");
    expect(el).toBeTruthy();
  });
});
