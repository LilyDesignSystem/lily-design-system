// info-state.test.js
// InfoState component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("section.info-state");


describe("InfoState", () => {
  it("renders the element with its base class", async () => {
    await mount("info-state");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("info-state")).toBe(true);
  });

  it("uses the section element", async () => {
    await mount("info-state");
    expect(el().tagName.toLowerCase()).toBe("section");
  });
});
