// tel-link.test.js
// TelLink component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("a.tel-link");


describe("TelLink", () => {
  it("renders the element with its base class", async () => {
    await mount("tel-link");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("tel-link")).toBe(true);
  });

  it("uses the a element", async () => {
    await mount("tel-link");
    expect(el().tagName.toLowerCase()).toBe("a");
  });
});
