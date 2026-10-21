// loading.test.js
// Loading component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.loading");


describe("Loading", () => {
  it("renders the element with its base class", async () => {
    await mount("loading");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("loading")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("loading");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
