// sonner.test.js
// Sonner component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.sonner");


describe("Sonner", () => {
  it("renders the element with its base class", async () => {
    await mount("sonner");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("sonner")).toBe(true);
  });

  it('is a labelled polite region', async () => {
    await mount("sonner");
    expect(el().getAttribute("role")).toBe("region");
    expect(el().getAttribute("aria-live")).toBe("polite");
    expect(el().hasAttribute("aria-label")).toBe(true);
  });
});
