// button-group.test.js
// ButtonGroup component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.button-group");


describe("ButtonGroup", () => {
  it("renders the element with its base class", async () => {
    await mount("button-group");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("button-group")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("button-group");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
