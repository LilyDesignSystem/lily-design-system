// date-field.test.js
// DateField component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.date-field");


describe("DateField", () => {
  it("renders the element with its base class", async () => {
    await mount("date-field");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("date-field")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("date-field");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
