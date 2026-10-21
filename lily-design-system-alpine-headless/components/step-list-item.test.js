// step-list-item.test.js
// StepListItem component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("li.step-list-item");


describe("StepListItem", () => {
  it("renders the element with its base class", async () => {
    await mount("step-list-item");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("step-list-item")).toBe(true);
  });

  it("uses the li element", async () => {
    await mount("step-list-item");
    expect(el().tagName.toLowerCase()).toBe("li");
  });
});
