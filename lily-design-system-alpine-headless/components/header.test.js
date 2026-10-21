// header.test.js
// Header component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("header.header");


describe("Header", () => {
  it("renders the element with its base class", async () => {
    await mount("header");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("header")).toBe(true);
  });

  it("uses the header element", async () => {
    await mount("header");
    expect(el().tagName.toLowerCase()).toBe("header");
  });
});
