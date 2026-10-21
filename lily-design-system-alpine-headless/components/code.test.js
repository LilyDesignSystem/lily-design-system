// code.test.js
// Code component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("code.code");


describe("Code", () => {
  it("renders the element with its base class", async () => {
    await mount("code");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("code")).toBe(true);
  });

  it("uses the code element", async () => {
    await mount("code");
    expect(el().tagName.toLowerCase()).toBe("code");
  });
});
