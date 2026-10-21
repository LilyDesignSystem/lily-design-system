// option.test.js
// Option component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("option.option");


describe("Option", () => {
  it("renders the element with its base class", async () => {
    await mount("option");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("option")).toBe(true);
  });

  it("uses the option element", async () => {
    await mount("option");
    expect(el().tagName.toLowerCase()).toBe("option");
  });
});
