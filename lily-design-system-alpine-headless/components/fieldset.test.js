// fieldset.test.js
// Fieldset component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("fieldset.fieldset");


describe("Fieldset", () => {
  it("renders the element with its base class", async () => {
    await mount("fieldset");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("fieldset")).toBe(true);
  });

  it("uses the fieldset element", async () => {
    await mount("fieldset");
    expect(el().tagName.toLowerCase()).toBe("fieldset");
  });
});
