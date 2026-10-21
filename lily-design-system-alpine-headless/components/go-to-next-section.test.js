// go-to-next-section.test.js
// GoToNextSection component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("a.go-to-next-section");


describe("GoToNextSection", () => {
  it("renders the element with its base class", async () => {
    await mount("go-to-next-section");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("go-to-next-section")).toBe(true);
  });

  it("uses the a element", async () => {
    await mount("go-to-next-section");
    expect(el().tagName.toLowerCase()).toBe("a");
  });
});
