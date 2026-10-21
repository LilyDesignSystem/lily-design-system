// file-manager.test.js
// FileManager component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.file-manager");


describe("FileManager", () => {
  it("renders the element with its base class", async () => {
    await mount("file-manager");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("file-manager")).toBe(true);
  });

  it("is a named region", async () => {
    await mount("file-manager");
    expect(el().getAttribute("role")).toBe("region");
    expect(el().hasAttribute("aria-label")).toBe(true);
  });
});
