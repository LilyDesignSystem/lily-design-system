import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("diff", () => {
  it("renders a <div role=group> with left and right panels", () => {
    const { document } = render("diff", {
      leftHtml: "<p>Before</p>",
      rightHtml: "<p>After</p>",
    });
    expect(document.querySelector("div.diff").getAttribute("role")).toBe("group");
    expect(document.querySelector(".diff-left p").textContent).toBe("Before");
    expect(document.querySelector(".diff-right p").textContent).toBe("After");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("diff", { leftHtml: "", rightHtml: "" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
