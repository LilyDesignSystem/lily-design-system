// description-list.test.js
// DescriptionList component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("dl.description-list");


describe("DescriptionList", () => {
  it("renders the element with its base class", async () => {
    await mount("description-list");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("description-list")).toBe(true);
  });

  it("uses the dl element", async () => {
    await mount("description-list");
    expect(el().tagName.toLowerCase()).toBe("dl");
  });
});
