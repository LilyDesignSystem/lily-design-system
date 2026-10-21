// share-page.test.js
// SharePage component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.share-page");


describe("SharePage", () => {
  it("renders the element with its base class", async () => {
    await mount("share-page");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("share-page")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("share-page");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
