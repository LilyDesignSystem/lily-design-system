// comment.test.js
// Comment component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.comment");


describe("Comment", () => {
  it("renders the element with its base class", async () => {
    await mount("comment");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("comment")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("comment");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
