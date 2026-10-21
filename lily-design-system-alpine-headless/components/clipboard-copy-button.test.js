// clipboard-copy-button.test.js
// ClipboardCopyButton component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("button.clipboard-copy-button");


describe("ClipboardCopyButton", () => {
  it("renders the element with its base class", async () => {
    await mount("clipboard-copy-button");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("clipboard-copy-button")).toBe(true);
  });

  it("copies the text and sets data-copied", async () => {
    const writeText = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    await mount("clipboard-copy-button");
    expect(el().getAttribute("data-copied")).toBe("false");
    el().click(); await tick(); await tick();
    expect(writeText).toHaveBeenCalledWith("text to copy");
    expect(el().getAttribute("data-copied")).toBe("true");
  });
});
