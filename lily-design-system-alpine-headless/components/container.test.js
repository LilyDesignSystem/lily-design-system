// container.test.js
// Container component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.container");


describe("Container", () => {
  it("renders the element with its base class", async () => {
    await mount("container");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("container")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("container");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
