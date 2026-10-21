// mockup-shell.test.js
// MockupShell component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.mockup-shell");


describe("MockupShell", () => {
  it("renders the element with its base class", async () => {
    await mount("mockup-shell");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("mockup-shell")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("mockup-shell");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
