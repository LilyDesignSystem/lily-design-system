import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("container", () => {
  it("renders a <div> with the base class", () => {
    const { document } = render("container", { text: "Body" });
    const el = document.querySelector("div.container");
    expect(el).toBeTruthy();
  });
});
