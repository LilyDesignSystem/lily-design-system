// address-input.test.js
// AddressInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.address-input");


describe("AddressInput", () => {
  it("renders the element with its base class", async () => {
    await mount("address-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("address-input")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("address-input");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
