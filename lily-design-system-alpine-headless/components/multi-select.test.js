// multi-select.test.js
// MultiSelect component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("select.multi-select");


describe("MultiSelect", () => {
  it("renders the element with its base class", async () => {
    await mount("multi-select");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("multi-select")).toBe(true);
  });

  it("uses the select element", async () => {
    await mount("multi-select");
    expect(el().tagName.toLowerCase()).toBe("select");
  });
});
