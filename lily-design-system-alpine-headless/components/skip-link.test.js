// skip-link.test.js
// SkipLink component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("a.skip-link");


describe("SkipLink", () => {
  it("renders the element with its base class", async () => {
    await mount("skip-link");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("skip-link")).toBe(true);
  });

  it("uses the a element", async () => {
    await mount("skip-link");
    expect(el().tagName.toLowerCase()).toBe("a");
  });
});
