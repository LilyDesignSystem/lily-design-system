import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("sonner", () => {
  it("renders a <div role=region aria-live=polite>", () => {
    const { document } = render("sonner", {});
    const el = document.querySelector("div.sonner");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("region");
    expect(el.getAttribute("aria-live")).toBe("polite");
    expect(el.getAttribute("aria-label")).toBe("Notifications");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("sonner", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
