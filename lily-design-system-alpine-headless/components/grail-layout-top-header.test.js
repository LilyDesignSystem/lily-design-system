// grail-layout-top-header.test.js
// GrailLayoutTopHeader component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("header.grail-layout-top-header");


describe("GrailLayoutTopHeader", () => {
  it("renders the element with its base class", async () => {
    await mount("grail-layout-top-header");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("grail-layout-top-header")).toBe(true);
  });

  it("uses the header element", async () => {
    await mount("grail-layout-top-header");
    expect(el().tagName.toLowerCase()).toBe("header");
  });
});
