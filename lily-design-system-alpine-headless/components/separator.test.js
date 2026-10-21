// separator.test.js
// Separator component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("hr.separator");


describe("Separator", () => {
  it("renders the element with its base class", async () => {
    await mount("separator");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("separator")).toBe(true);
  });

  it("uses the hr element", async () => {
    await mount("separator");
    expect(el().tagName.toLowerCase()).toBe("hr");
  });
});
