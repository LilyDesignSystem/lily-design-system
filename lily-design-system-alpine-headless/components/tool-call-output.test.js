// tool-call-output.test.js
// ToolCallOutput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.tool-call-output");


describe("ToolCallOutput", () => {
  it("renders the element with its base class", async () => {
    await mount("tool-call-output");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("tool-call-output")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("tool-call-output");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
