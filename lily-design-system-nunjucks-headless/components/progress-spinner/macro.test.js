import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("progress-spinner", () => {
  it("renders a <div> with the base class", () => {
    const { document } = render("progress-spinner", {});
    expect(document.querySelector("div.progress-spinner")).toBeTruthy();
  });

  it("sets role=status, aria-live=polite, aria-busy=true", () => {
    const { document } = render("progress-spinner", {});
    const el = document.querySelector("div.progress-spinner");
    expect(el.getAttribute("role")).toBe("status");
    expect(el.getAttribute("aria-live")).toBe("polite");
    expect(el.getAttribute("aria-busy")).toBe("true");
  });

  it("defaults aria-label to 'Loading'", () => {
    const { document } = render("progress-spinner", {});
    expect(document.querySelector("div.progress-spinner").getAttribute("aria-label"))
      .toBe("Loading");
  });

  it("respects a custom label", () => {
    const { document } = render("progress-spinner", { label: "Saving…" });
    expect(document.querySelector("div.progress-spinner").getAttribute("aria-label"))
      .toBe("Saving…");
  });

  it("appends params.classes", () => {
    const { document } = render("progress-spinner", { classes: "large" });
    expect(document.querySelector("div.progress-spinner.large")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("progress-spinner", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
