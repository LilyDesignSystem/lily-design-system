// field.test.js
// Field component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.field");


describe("Field", () => {
  it("renders the element with its base class", async () => {
    await mount("field");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("field")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("field");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
