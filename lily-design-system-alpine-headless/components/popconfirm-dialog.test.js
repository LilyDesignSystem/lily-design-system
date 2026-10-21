// popconfirm-dialog.test.js
// PopconfirmDialog component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.popconfirm-dialog");


describe("PopconfirmDialog", () => {
  it("renders the element with its base class", async () => {
    await mount("popconfirm-dialog");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("popconfirm-dialog")).toBe(true);
  });

  const trigger = () => document.querySelector(".popconfirm-dialog-trigger");
  it("is a hidden non-modal alertdialog", async () => {
    await mount("popconfirm-dialog");
    expect(el().getAttribute("role")).toBe("alertdialog");
    expect(el().getAttribute("aria-modal")).toBe("false");
    expect(el().hidden).toBe(true);
  });
  it("confirm emits lily:confirm and closes", async () => {
    await mount("popconfirm-dialog");
    const on = vi.fn(); document.addEventListener("lily:confirm", on);
    trigger().click(); await tick();
    expect(el().hidden).toBe(false);
    document.querySelector(".popconfirm-dialog-confirm").click(); await tick();
    expect(on).toHaveBeenCalledTimes(1);
    expect(el().hidden).toBe(true);
    document.removeEventListener("lily:confirm", on);
  });
  it("cancel and Escape emit lily:cancel and close", async () => {
    await mount("popconfirm-dialog");
    const on = vi.fn(); document.addEventListener("lily:cancel", on);
    trigger().click(); await tick();
    document.querySelector(".popconfirm-dialog-cancel").click(); await tick();
    expect(on).toHaveBeenCalledTimes(1);
    trigger().click(); await tick();
    el().dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })); await tick();
    expect(on).toHaveBeenCalledTimes(2);
    expect(el().hidden).toBe(true);
    document.removeEventListener("lily:cancel", on);
  });
});
