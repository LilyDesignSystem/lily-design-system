// tool-call-input.test.js
// ToolCallInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.tool-call-input");


describe("ToolCallInput", () => {
  it("renders the element with its base class", async () => {
    await mount("tool-call-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("tool-call-input")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("tool-call-input");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
