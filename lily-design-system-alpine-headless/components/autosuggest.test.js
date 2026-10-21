// autosuggest.test.js
// Autosuggest component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.autosuggest");


describe("Autosuggest", () => {
  it("renders the element with its base class", async () => {
    await mount("autosuggest");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("autosuggest")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("autosuggest");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
