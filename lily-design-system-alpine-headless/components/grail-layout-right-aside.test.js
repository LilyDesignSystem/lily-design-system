// grail-layout-right-aside.test.js
// GrailLayoutRightAside component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("aside.grail-layout-right-aside");


describe("GrailLayoutRightAside", () => {
  it("renders the element with its base class", async () => {
    await mount("grail-layout-right-aside");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("grail-layout-right-aside")).toBe(true);
  });

  it("uses the aside element", async () => {
    await mount("grail-layout-right-aside");
    expect(el().tagName.toLowerCase()).toBe("aside");
  });
});
