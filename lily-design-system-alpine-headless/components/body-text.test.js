// body-text.test.js
// BodyText component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.body-text");


describe("BodyText", () => {
  it("renders the element with its base class", async () => {
    await mount("body-text");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("body-text")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("body-text");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
