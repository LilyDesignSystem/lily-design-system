// grail-layout-left-aside.test.js
// GrailLayoutLeftAside component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("aside.grail-layout-left-aside");


describe("GrailLayoutLeftAside", () => {
  it("renders the element with its base class", async () => {
    await mount("grail-layout-left-aside");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("grail-layout-left-aside")).toBe(true);
  });

  it("uses the aside element", async () => {
    await mount("grail-layout-left-aside");
    expect(el().tagName.toLowerCase()).toBe("aside");
  });
});
