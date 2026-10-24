// convert-div.test.js
// ConvertDiv component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.convert-div");


describe("ConvertDiv", () => {
  it("renders the element with its base class", async () => {
    await mount("convert-div");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("convert-div")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("convert-div");
    expect(el().tagName.toLowerCase()).toBe("div");
  });

  it("is a named group", async () => {
    await mount("convert-div");
    expect(el().getAttribute("role")).toBe("group");
    expect(el().getAttribute("aria-label")).not.toBeNull();
  });
});
