// file-dialog.test.js
// FileDialog component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("dialog.file-dialog");


describe("FileDialog", () => {
  it("renders the element with its base class", async () => {
    await mount("file-dialog");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("file-dialog")).toBe(true);
  });

  it("is closed, modal", async () => {
    await mount("file-dialog");
    expect(el().open).toBe(false);
    expect(el().getAttribute("aria-modal")).toBe("true");
  });
  it("opens from the trigger and closes on Escape", async () => {
    await mount("file-dialog");
    document.querySelector(".file-dialog-trigger").click(); await tick();
    expect(el().open).toBe(true);
    el().dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })); await tick();
    expect(el().open).toBe(false);
  });
});
