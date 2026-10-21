// character.test.js
// Character component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.character");


describe("Character", () => {
  it("renders the element with its base class", async () => {
    await mount("character");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("character")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("character");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
