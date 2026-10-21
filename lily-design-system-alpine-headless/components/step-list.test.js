// step-list.test.js
// StepList component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("ol.step-list");


describe("StepList", () => {
  it("renders the element with its base class", async () => {
    await mount("step-list");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("step-list")).toBe(true);
  });

  it("uses the ol element", async () => {
    await mount("step-list");
    expect(el().tagName.toLowerCase()).toBe("ol");
  });
});
