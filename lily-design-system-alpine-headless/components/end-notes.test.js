// end-notes.test.js
// EndNotes component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("section.end-notes");


describe("EndNotes", () => {
  it("renders the element with its base class", async () => {
    await mount("end-notes");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("end-notes")).toBe(true);
  });

  it("uses the section element", async () => {
    await mount("end-notes");
    expect(el().tagName.toLowerCase()).toBe("section");
  });
});
