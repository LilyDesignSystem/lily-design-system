// radio-group.test.js
// RadioGroup component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("fieldset.radio-group");


describe("RadioGroup", () => {
  it("renders the element with its base class", async () => {
    await mount("radio-group");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("radio-group")).toBe(true);
  });

  it("uses the fieldset element", async () => {
    await mount("radio-group");
    expect(el().tagName.toLowerCase()).toBe("fieldset");
  });
});
