// select-with-extras.test.js
// SelectWithExtras component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.select-with-extras");


describe("SelectWithExtras", () => {
  it("renders the element with its base class", async () => {
    await mount("select-with-extras");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("select-with-extras")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("select-with-extras");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
