import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("progress-bar", () => {
  it("renders a <div> with the base class", () => {
    const { document } = render("progress-bar", { value: 42, label: "Test" });
    const el = document.querySelector("div.progress-bar");
    expect(el).toBeTruthy();
  });
});
