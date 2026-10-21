// switch-button.test.js
// SwitchButton component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("button.switch-button");


describe("SwitchButton", () => {
  it("renders the element with its base class", async () => {
    await mount("switch-button");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("switch-button")).toBe(true);
  });

  it('has role="switch" and starts unchecked', async () => {
    await mount("switch-button");
    expect(el().getAttribute("role")).toBe("switch");
    expect(el().getAttribute("aria-checked")).toBe("false");
  });
  it("toggles aria-checked on click", async () => {
    await mount("switch-button");
    el().click(); await tick();
    expect(el().getAttribute("aria-checked")).toBe("true");
  });
});
