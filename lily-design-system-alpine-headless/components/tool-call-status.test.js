// tool-call-status.test.js
// ToolCallStatus component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.tool-call-status");


describe("ToolCallStatus", () => {
  it("renders the element with its base class", async () => {
    await mount("tool-call-status");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("tool-call-status")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("tool-call-status");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
