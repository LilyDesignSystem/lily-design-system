// back-link.test.js
// BackLink component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("a.back-link");


describe("BackLink", () => {
  it("renders the element with its base class", async () => {
    await mount("back-link");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("back-link")).toBe(true);
  });

  it("uses the a element", async () => {
    await mount("back-link");
    expect(el().tagName.toLowerCase()).toBe("a");
  });
});
