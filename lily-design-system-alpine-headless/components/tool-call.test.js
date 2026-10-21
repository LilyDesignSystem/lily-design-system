// tool-call.test.js
// ToolCall component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("details.tool-call");


describe("ToolCall", () => {
  it("renders the element with its base class", async () => {
    await mount("tool-call");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("tool-call")).toBe(true);
  });

  it("uses the details element", async () => {
    await mount("tool-call");
    expect(el().tagName.toLowerCase()).toBe("details");
  });
});
