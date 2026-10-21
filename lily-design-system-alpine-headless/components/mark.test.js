// mark.test.js
// Mark component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("mark.mark");


describe("Mark", () => {
  it("renders the element with its base class", async () => {
    await mount("mark");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("mark")).toBe(true);
  });

  it("uses the mark element", async () => {
    await mount("mark");
    expect(el().tagName.toLowerCase()).toBe("mark");
  });
});
