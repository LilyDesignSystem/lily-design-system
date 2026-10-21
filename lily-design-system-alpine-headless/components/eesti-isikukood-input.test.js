// eesti-isikukood-input.test.js
// EestiIsikukoodInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.eesti-isikukood-input");


describe("EestiIsikukoodInput", () => {
  it("renders the element with its base class", async () => {
    await mount("eesti-isikukood-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("eesti-isikukood-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("eesti-isikukood-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
