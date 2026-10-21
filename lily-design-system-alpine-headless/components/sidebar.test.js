// sidebar.test.js
// Sidebar component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("aside.sidebar");


describe("Sidebar", () => {
  it("renders the element with its base class", async () => {
    await mount("sidebar");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("sidebar")).toBe(true);
  });

  it("uses the aside element", async () => {
    await mount("sidebar");
    expect(el().tagName.toLowerCase()).toBe("aside");
  });
});
