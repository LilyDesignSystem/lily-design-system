// tool-call-name.test.js
// ToolCallName component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.tool-call-name");


describe("ToolCallName", () => {
  it("renders the element with its base class", async () => {
    await mount("tool-call-name");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("tool-call-name")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("tool-call-name");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
