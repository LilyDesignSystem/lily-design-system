// inset-text.test.js
// InsetText component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.inset-text");


describe("InsetText", () => {
  it("renders the element with its base class", async () => {
    await mount("inset-text");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("inset-text")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("inset-text");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
