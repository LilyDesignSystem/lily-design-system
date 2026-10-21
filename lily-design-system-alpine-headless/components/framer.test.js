// framer.test.js
// Framer component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.framer");


describe("Framer", () => {
  it("renders the element with its base class", async () => {
    await mount("framer");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("framer")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("framer");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
