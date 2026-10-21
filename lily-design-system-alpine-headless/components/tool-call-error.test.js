// tool-call-error.test.js
// ToolCallError component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.tool-call-error");


describe("ToolCallError", () => {
  it("renders the element with its base class", async () => {
    await mount("tool-call-error");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("tool-call-error")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("tool-call-error");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
