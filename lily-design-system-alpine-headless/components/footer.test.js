// footer.test.js
// Footer component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("footer.footer");


describe("Footer", () => {
  it("renders the element with its base class", async () => {
    await mount("footer");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("footer")).toBe(true);
  });

  it("uses the footer element", async () => {
    await mount("footer");
    expect(el().tagName.toLowerCase()).toBe("footer");
  });
});
