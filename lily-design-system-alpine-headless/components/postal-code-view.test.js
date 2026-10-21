// postal-code-view.test.js
// PostalCodeView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.postal-code-view");


describe("PostalCodeView", () => {
  it("renders the element with its base class", async () => {
    await mount("postal-code-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("postal-code-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("postal-code-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
