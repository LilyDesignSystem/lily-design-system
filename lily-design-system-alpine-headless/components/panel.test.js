// panel.test.js
// Panel component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.panel");


describe("Panel", () => {
  it("renders the element with its base class", async () => {
    await mount("panel");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("panel")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("panel");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
