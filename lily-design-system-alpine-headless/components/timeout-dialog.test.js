// timeout-dialog.test.js
// TimeoutDialog component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("dialog.timeout-dialog");


describe("TimeoutDialog", () => {
  it("renders the element with its base class", async () => {
    await mount("timeout-dialog");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("timeout-dialog")).toBe(true);
  });

  it("uses the dialog element", async () => {
    await mount("timeout-dialog");
    expect(el().tagName.toLowerCase()).toBe("dialog");
  });
});
