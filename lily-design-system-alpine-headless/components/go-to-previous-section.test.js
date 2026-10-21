// go-to-previous-section.test.js
// GoToPreviousSection component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("a.go-to-previous-section");


describe("GoToPreviousSection", () => {
  it("renders the element with its base class", async () => {
    await mount("go-to-previous-section");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("go-to-previous-section")).toBe(true);
  });

  it("uses the a element", async () => {
    await mount("go-to-previous-section");
    expect(el().tagName.toLowerCase()).toBe("a");
  });
});
