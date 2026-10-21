// label.test.js
// Label component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("label.label");


describe("Label", () => {
  it("renders the element with its base class", async () => {
    await mount("label");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("label")).toBe(true);
  });

  it("uses the label element", async () => {
    await mount("label");
    expect(el().tagName.toLowerCase()).toBe("label");
  });
});
