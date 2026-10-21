// flex-stack.test.js
// FlexStack component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.flex-stack");


describe("FlexStack", () => {
  it("renders the element with its base class", async () => {
    await mount("flex-stack");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("flex-stack")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("flex-stack");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
