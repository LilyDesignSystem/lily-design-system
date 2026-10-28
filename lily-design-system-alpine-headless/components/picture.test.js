// picture.test.js
// Picture component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("picture.picture");


describe("Picture", () => {
  it("renders the element with its base class", async () => {
    await mount("picture");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("picture")).toBe(true);
  });

  it("uses the picture element", async () => {
    await mount("picture");
    expect(el().tagName.toLowerCase()).toBe("picture");
  });
});
