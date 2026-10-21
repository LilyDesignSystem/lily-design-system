// tab-bar-button.test.js
// TabBarButton component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("button.tab-bar-button");


describe("TabBarButton", () => {
  it("renders the element with its base class", async () => {
    await mount("tab-bar-button");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("tab-bar-button")).toBe(true);
  });

  it('is a role="tab" button with aria-selected', async () => {
    await mount("tab-bar-button");
    expect(el().getAttribute("role")).toBe("tab");
    expect(el().getAttribute("aria-selected")).toBe("true");
    expect(el().getAttribute("tabindex")).toBe("0");
  });
});
