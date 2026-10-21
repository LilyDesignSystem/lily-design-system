// grail-layout-bottom-footer.test.js
// GrailLayoutBottomFooter component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("footer.grail-layout-bottom-footer");


describe("GrailLayoutBottomFooter", () => {
  it("renders the element with its base class", async () => {
    await mount("grail-layout-bottom-footer");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("grail-layout-bottom-footer")).toBe(true);
  });

  it("uses the footer element", async () => {
    await mount("grail-layout-bottom-footer");
    expect(el().tagName.toLowerCase()).toBe("footer");
  });
});
