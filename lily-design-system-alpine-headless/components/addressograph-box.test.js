// addressograph-box.test.js
// AddressographBox component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.addressograph-box");


describe("AddressographBox", () => {
  it("renders the element with its base class", async () => {
    await mount("addressograph-box");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("addressograph-box")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("addressograph-box");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
