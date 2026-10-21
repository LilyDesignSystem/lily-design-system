// caption.test.js
// Caption component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("caption.caption");


describe("Caption", () => {
  it("renders the element with its base class", async () => {
    await mount("caption");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("caption")).toBe(true);
  });

  it("uses the caption element", async () => {
    await mount("caption");
    expect(el().tagName.toLowerCase()).toBe("caption");
  });
});
