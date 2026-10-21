// checkbox-group.test.js
// CheckboxGroup component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("fieldset.checkbox-group");


describe("CheckboxGroup", () => {
  it("renders the element with its base class", async () => {
    await mount("checkbox-group");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("checkbox-group")).toBe(true);
  });

  it("uses the fieldset element", async () => {
    await mount("checkbox-group");
    expect(el().tagName.toLowerCase()).toBe("fieldset");
  });
});
