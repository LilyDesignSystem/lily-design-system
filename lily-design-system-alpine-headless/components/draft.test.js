// draft.test.js
// Draft component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.draft");


describe("Draft", () => {
  it("renders the element with its base class", async () => {
    await mount("draft");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("draft")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("draft");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
