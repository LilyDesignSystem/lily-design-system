// download-button.test.js
// DownloadButton component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("a.download-button");


describe("DownloadButton", () => {
  it("renders the element with its base class", async () => {
    await mount("download-button");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("download-button")).toBe(true);
  });

  it("uses the a element", async () => {
    await mount("download-button");
    expect(el().tagName.toLowerCase()).toBe("a");
  });
});
