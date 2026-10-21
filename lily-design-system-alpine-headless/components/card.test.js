// card.test.js
// Card component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.card");


describe("Card", () => {
  it("renders the element with its base class", async () => {
    await mount("card");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("card")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("card");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
