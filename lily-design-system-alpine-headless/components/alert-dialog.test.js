// alert-dialog.test.js
// AlertDialog component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("dialog.alert-dialog");


describe("AlertDialog", () => {
  it("renders the element with its base class", async () => {
    await mount("alert-dialog");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("alert-dialog")).toBe(true);
  });

  it("is closed, modal, with its role", async () => {
    await mount("alert-dialog");
    expect(el().open).toBe(false);
    expect(el().getAttribute("aria-modal")).toBe("true");
    expect(el().getAttribute("role")).toBe("alertdialog");
  });
  it("opens from the trigger and closes on Escape", async () => {
    await mount("alert-dialog");
    document.querySelector(".alert-dialog-trigger").click(); await tick();
    expect(el().open).toBe(true);
    el().dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })); await tick();
    expect(el().open).toBe(false);
  });
});
