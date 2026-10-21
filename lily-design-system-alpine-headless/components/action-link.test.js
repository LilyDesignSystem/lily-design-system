// action-link.test.js
// ActionLink component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("a.action-link");


describe("ActionLink", () => {
  it("renders the element with its base class", async () => {
    await mount("action-link");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("action-link")).toBe(true);
  });

  it("uses the a element", async () => {
    await mount("action-link");
    expect(el().tagName.toLowerCase()).toBe("a");
  });
});
