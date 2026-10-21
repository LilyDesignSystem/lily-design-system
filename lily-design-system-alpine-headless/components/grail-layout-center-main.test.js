// grail-layout-center-main.test.js
// GrailLayoutCenterMain component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("main.grail-layout-center-main");


describe("GrailLayoutCenterMain", () => {
  it("renders the element with its base class", async () => {
    await mount("grail-layout-center-main");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("grail-layout-center-main")).toBe(true);
  });

  it("uses the main element", async () => {
    await mount("grail-layout-center-main");
    expect(el().tagName.toLowerCase()).toBe("main");
  });
});
