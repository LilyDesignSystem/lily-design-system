// resizable.test.js
// Resizable component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.resizable");


describe("Resizable", () => {
  it("renders the element with its base class", async () => {
    await mount("resizable");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("resizable")).toBe(true);
  });

  it("is a focusable named region carrying its resize direction", async () => {
    await mount("resizable");
    expect(el().getAttribute("role")).toBe("region");
    expect(el().getAttribute("tabindex")).toBe("0");
    expect(el().hasAttribute("aria-label")).toBe(true);
    expect(el().getAttribute("data-resize")).toBe("both");
  });
});
