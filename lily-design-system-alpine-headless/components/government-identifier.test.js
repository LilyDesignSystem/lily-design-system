// government-identifier.test.js
// GovernmentIdentifier component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("section.government-identifier");


describe("GovernmentIdentifier", () => {
  it("renders the element with its base class", async () => {
    await mount("government-identifier");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("government-identifier")).toBe(true);
  });

  it("uses the section element", async () => {
    await mount("government-identifier");
    expect(el().tagName.toLowerCase()).toBe("section");
  });
});
