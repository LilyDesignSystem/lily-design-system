// select.test.js
// Select component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("select.select");


describe("Select", () => {
  it("renders the element with its base class", async () => {
    await mount("select");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("select")).toBe(true);
  });

  it("uses the select element", async () => {
    await mount("select");
    expect(el().tagName.toLowerCase()).toBe("select");
  });
});
