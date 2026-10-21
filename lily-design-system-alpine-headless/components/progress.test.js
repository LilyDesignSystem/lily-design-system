// progress.test.js
// Progress component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("progress.progress");


describe("Progress", () => {
  it("renders the element with its base class", async () => {
    await mount("progress");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("progress")).toBe(true);
  });

  it("uses the progress element", async () => {
    await mount("progress");
    expect(el().tagName.toLowerCase()).toBe("progress");
  });
});
