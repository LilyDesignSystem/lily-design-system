// search-input.test.js
// SearchInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.search-input");


describe("SearchInput", () => {
  it("renders the element with its base class", async () => {
    await mount("search-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("search-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("search-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
