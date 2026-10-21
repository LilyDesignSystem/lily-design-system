// thinking.test.js
// Thinking component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("details.thinking");


describe("Thinking", () => {
  it("renders the element with its base class", async () => {
    await mount("thinking");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("thinking")).toBe(true);
  });

  it("uses the details element", async () => {
    await mount("thinking");
    expect(el().tagName.toLowerCase()).toBe("details");
  });
});
