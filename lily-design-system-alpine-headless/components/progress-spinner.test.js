// progress-spinner.test.js
// ProgressSpinner component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.progress-spinner");


describe("ProgressSpinner", () => {
  it("renders the element with its base class", async () => {
    await mount("progress-spinner");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("progress-spinner")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("progress-spinner");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
