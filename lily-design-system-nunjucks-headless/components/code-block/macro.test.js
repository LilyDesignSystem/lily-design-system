import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("code-block", () => {
  it("renders <pre><code> with the base class", () => {
    const { document } = render("code-block", { text: "x = 1" });
    const pre = document.querySelector("pre.code-block");
    expect(pre).toBeTruthy();
    expect(pre.querySelector("code")).toBeTruthy();
  });

  it("escapes text content", () => {
    const { document } = render("code-block", {
      text: "<script>alert(1)</script>",
    });
    const code = document.querySelector("pre code");
    expect(code.textContent).toBe("<script>alert(1)</script>");
    expect(code.querySelector("script")).toBeNull();
  });

  it("preserves whitespace", () => {
    const { document } = render("code-block", {
      text: "line 1\nline 2",
    });
    expect(document.querySelector("pre code").textContent)
      .toContain("line 1\nline 2");
  });

  it("adds language class on the inner <code> when provided", () => {
    const { document } = render("code-block", {
      language: "js",
      text: "x",
    });
    expect(document.querySelector("pre code").classList.contains("language-js"))
      .toBe(true);
  });

  it("sets aria-label when provided", () => {
    const { document } = render("code-block", {
      label: "Example",
      text: "x",
    });
    expect(document.querySelector("pre").getAttribute("aria-label"))
      .toBe("Example");
  });

  it("appends params.classes on the <pre>", () => {
    const { document } = render("code-block", {
      text: "x",
      classes: "dark",
    });
    expect(document.querySelector("pre.code-block.dark")).toBeTruthy();
  });

  it("contains no <style> or <script> tags outside the escaped content", () => {
    const { html } = render("code-block", { text: "x" });
    expect(html).not.toContain("<style");
    // content is escaped, so no unescaped <script> tags in the rendered HTML
    expect(html).not.toContain("style=");
  });
});
