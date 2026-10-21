// bulgaria-edinen-grazhdanski-nomer-input.test.js
// BulgariaEdinenGrazhdanskiNomerInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.bulgaria-edinen-grazhdanski-nomer-input");


describe("BulgariaEdinenGrazhdanskiNomerInput", () => {
  it("renders the element with its base class", async () => {
    await mount("bulgaria-edinen-grazhdanski-nomer-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("bulgaria-edinen-grazhdanski-nomer-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("bulgaria-edinen-grazhdanski-nomer-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
