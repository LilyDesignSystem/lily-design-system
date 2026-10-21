// url-input.test.js
// UrlInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.url-input");


describe("UrlInput", () => {
  it("renders the element with its base class", async () => {
    await mount("url-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("url-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("url-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
