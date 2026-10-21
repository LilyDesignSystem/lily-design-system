// email-link.test.js
// EmailLink component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("a.email-link");


describe("EmailLink", () => {
  it("renders the element with its base class", async () => {
    await mount("email-link");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("email-link")).toBe(true);
  });

  it("uses the a element", async () => {
    await mount("email-link");
    expect(el().tagName.toLowerCase()).toBe("a");
  });
});
