// mutually-exclusive.test.js
// MutuallyExclusive component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("fieldset.mutually-exclusive");


describe("MutuallyExclusive", () => {
  it("renders the element with its base class", async () => {
    await mount("mutually-exclusive");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("mutually-exclusive")).toBe(true);
  });

  it("uses the fieldset element", async () => {
    await mount("mutually-exclusive");
    expect(el().tagName.toLowerCase()).toBe("fieldset");
  });
});
