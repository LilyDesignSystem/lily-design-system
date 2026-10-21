// scroll-area.test.js
// ScrollArea component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.scroll-area");


describe("ScrollArea", () => {
  it("renders the element with its base class", async () => {
    await mount("scroll-area");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("scroll-area")).toBe(true);
  });

  it("is a focusable named region", async () => {
    await mount("scroll-area");
    expect(el().getAttribute("role")).toBe("region");
    expect(el().getAttribute("tabindex")).toBe("0");
    expect(el().hasAttribute("aria-label")).toBe(true);
  });
});
