// toast.test.js
// Toast component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.toast");


describe("Toast", () => {
  it("renders the element with its base class", async () => {
    await mount("toast");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("toast")).toBe(true);
  });

  it('is a polite status live region', async () => {
    await mount("toast");
    expect(el().getAttribute("role")).toBe("status");
    expect(el().getAttribute("aria-live")).toBe("polite");
  });
});
