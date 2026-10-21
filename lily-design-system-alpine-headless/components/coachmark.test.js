// coachmark.test.js
// Coachmark component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.coachmark");
const press = async (target, key, init = {}) => {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }));
  await tick();
};
const dismiss = () => el().querySelector(".coachmark-dismiss");

describe("Coachmark", () => {
  it("renders the element with its base class", async () => {
    await mount("coachmark");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("coachmark")).toBe(true);
  });

  it("is a non-modal dialog named and described by its own text", async () => {
    await mount("coachmark");
    expect(el().getAttribute("role")).toBe("dialog");
    expect(el().getAttribute("aria-modal")).toBe("false");
    expect(document.getElementById(el().getAttribute("aria-labelledby")).className).toBe("coachmark-title");
    expect(document.getElementById(el().getAttribute("aria-describedby")).className).toBe("coachmark-description");
    expect(el().hidden).toBe(false);
  });
  it("the dismiss button hides it and announces lily:dismiss", async () => {
    await mount("coachmark");
    const seen = vi.fn();
    el().addEventListener("lily:dismiss", seen);
    dismiss().click(); await tick();
    expect(el().hidden).toBe(true);
    expect(seen).toHaveBeenCalledTimes(1);
  });
  it("Escape dismisses it", async () => {
    await mount("coachmark");
    await press(dismiss(), "Escape");
    expect(el().hidden).toBe(true);
  });
});
