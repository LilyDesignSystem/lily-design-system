// input-group.test.js
// InputGroup component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.input-group");


describe("InputGroup", () => {
  it("renders the element with its base class", async () => {
    await mount("input-group");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("input-group")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("input-group");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
