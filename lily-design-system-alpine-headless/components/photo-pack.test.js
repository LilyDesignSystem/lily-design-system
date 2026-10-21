// photo-pack.test.js
// PhotoPack component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.photo-pack");


describe("PhotoPack", () => {
  it("renders the element with its base class", async () => {
    await mount("photo-pack");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("photo-pack")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("photo-pack");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
