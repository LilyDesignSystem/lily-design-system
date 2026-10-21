// citation.test.js
// Citation component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("cite.citation");


describe("Citation", () => {
  it("renders the element with its base class", async () => {
    await mount("citation");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("citation")).toBe(true);
  });

  it("uses the cite element", async () => {
    await mount("citation");
    expect(el().tagName.toLowerCase()).toBe("cite");
  });
});
