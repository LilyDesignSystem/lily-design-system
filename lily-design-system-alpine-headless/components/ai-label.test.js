// ai-label.test.js
// AiLabel component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.ai-label");


describe("AiLabel", () => {
  it("renders the element with its base class", async () => {
    await mount("ai-label");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("ai-label")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("ai-label");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
