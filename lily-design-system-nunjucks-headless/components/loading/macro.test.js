import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("loading", () => {
  it("renders a <div role=status> with the base class", () => {
    const { document } = render("loading", { text: "Loading…" });
    const el = document.querySelector("div.loading");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("status");
  });

  it("defaults aria-live to 'polite' and sets aria-busy", () => {
    const { document } = render("loading", { text: "x" });
    const el = document.querySelector("div.loading");
    expect(el.getAttribute("aria-live")).toBe("polite");
    expect(el.getAttribute("aria-busy")).toBe("true");
  });

  it("omits aria-live when params.polite is explicitly false", () => {
    const { document } = render("loading", { text: "x", polite: false });
    expect(document.querySelector("div.loading").hasAttribute("aria-live"))
      .toBe(false);
  });

  it("renders params.text as visible content", () => {
    const { document } = render("loading", { text: "Loading appointments…" });
    expect(document.querySelector("div.loading").textContent.trim())
      .toBe("Loading appointments…");
  });

  it("sets aria-label when provided", () => {
    const { document } = render("loading", {
      label: "Loading",
      html: "<svg></svg>",
    });
    expect(document.querySelector("div.loading").getAttribute("aria-label"))
      .toBe("Loading");
  });

  it("renders params.html raw", () => {
    const { document } = render("loading", { html: "<em>Wait…</em>" });
    expect(document.querySelector("div.loading em")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("loading", {
      text: "x",
      classes: "overlay",
    });
    expect(document.querySelector("div.loading.overlay")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("loading", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
