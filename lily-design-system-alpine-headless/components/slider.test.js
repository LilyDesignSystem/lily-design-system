// slider.test.js
// Slider component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.slider");


describe("Slider", () => {
  it("renders the element with its base class", async () => {
    await mount("slider");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("slider")).toBe(true);
  });

  it("is a native range input at its initial value", async () => {
    await mount("slider");
    expect(el().type).toBe("range");
    expect(el().value).toBe("50");
    expect(el().getAttribute("data-value")).toBe("50");
  });
  it("two-way binds its value into data-value", async () => {
    await mount("slider");
    el().value = "80";
    el().dispatchEvent(new Event("input", { bubbles: true })); await tick();
    expect(el().getAttribute("data-value")).toBe("80");
  });
});
