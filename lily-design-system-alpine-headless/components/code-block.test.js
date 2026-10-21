// code-block.test.js
// CodeBlock component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("pre.code-block");


describe("CodeBlock", () => {
  it("renders the element with its base class", async () => {
    await mount("code-block");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("code-block")).toBe(true);
  });

  it("uses the pre element", async () => {
    await mount("code-block");
    expect(el().tagName.toLowerCase()).toBe("pre");
  });
});
