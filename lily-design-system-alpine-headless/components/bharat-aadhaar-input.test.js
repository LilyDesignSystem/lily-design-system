// bharat-aadhaar-input.test.js
// BharatAadhaarInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.bharat-aadhaar-input");


describe("BharatAadhaarInput", () => {
  it("renders the element with its base class", async () => {
    await mount("bharat-aadhaar-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("bharat-aadhaar-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("bharat-aadhaar-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
