// status-tag.test.js
// StatusTag component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.status-tag");


describe("StatusTag", () => {
  it("renders the element with its base class", async () => {
    await mount("status-tag");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("status-tag")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("status-tag");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
