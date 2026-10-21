// bharat-aadhaar-view.test.js
// BharatAadhaarView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.bharat-aadhaar-view");


describe("BharatAadhaarView", () => {
  it("renders the element with its base class", async () => {
    await mount("bharat-aadhaar-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("bharat-aadhaar-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("bharat-aadhaar-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
