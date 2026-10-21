// toggle-group.test.js
// ToggleGroup component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.toggle-group");
const items = () => [...document.querySelectorAll(".toggle-group-item")];

describe("ToggleGroup", () => {
  it("renders the element with its base class", async () => {
    await mount("toggle-group");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("toggle-group")).toBe(true);
  });

  it("has role=group and unpressed items", async () => {
    await mount("toggle-group");
    expect(el().getAttribute("role")).toBe("group");
    for (const b of items()) expect(b.getAttribute("aria-pressed")).toBe("false");
  });
  it("toggles each item independently", async () => {
    await mount("toggle-group");
    items()[0].click(); items()[1].click(); await tick();
    expect(items().map((b) => b.getAttribute("aria-pressed"))).toEqual(["true", "true"]);
    items()[0].click(); await tick();
    expect(items().map((b) => b.getAttribute("aria-pressed"))).toEqual(["false", "true"]);
  });
});
