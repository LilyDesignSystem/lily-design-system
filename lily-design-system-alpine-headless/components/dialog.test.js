// dialog.test.js
// Dialog component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("dialog.dialog");


describe("Dialog", () => {
  it("renders the element with its base class", async () => {
    await mount("dialog");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("dialog")).toBe(true);
  });

  it("is closed until the trigger is activated", async () => {
    await mount("dialog");
    expect(el().open).toBe(false);
    expect(el().getAttribute("aria-modal")).toBe("true");
  });
  it("opens on the trigger and closes on the close button", async () => {
    await mount("dialog");
    document.querySelector(".dialog-trigger").click(); await tick();
    expect(el().open).toBe(true);
    document.querySelector(".dialog-close").click(); await tick();
    expect(el().open).toBe(false);
  });
  it("closes on Escape", async () => {
    await mount("dialog");
    document.querySelector(".dialog-trigger").click(); await tick();
    el().dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })); await tick();
    expect(el().open).toBe(false);
  });
});
