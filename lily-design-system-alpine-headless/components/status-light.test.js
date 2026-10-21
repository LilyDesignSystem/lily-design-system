// status-light.test.js
// StatusLight component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.status-light");


describe("StatusLight", () => {
  it("renders the element with its base class", async () => {
    await mount("status-light");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("status-light")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("status-light");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
