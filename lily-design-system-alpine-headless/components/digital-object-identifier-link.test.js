// digital-object-identifier-link.test.js
// DigitalObjectIdentifierLink component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("a.digital-object-identifier-link");


describe("DigitalObjectIdentifierLink", () => {
  it("renders the element with its base class", async () => {
    await mount("digital-object-identifier-link");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("digital-object-identifier-link")).toBe(true);
  });

  it("uses the a element", async () => {
    await mount("digital-object-identifier-link");
    expect(el().tagName.toLowerCase()).toBe("a");
  });
});
