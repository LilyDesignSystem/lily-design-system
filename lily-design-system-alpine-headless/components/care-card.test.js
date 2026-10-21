// care-card.test.js
// CareCard component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.care-card");


describe("CareCard", () => {
  it("renders the element with its base class", async () => {
    await mount("care-card");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("care-card")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("care-card");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
