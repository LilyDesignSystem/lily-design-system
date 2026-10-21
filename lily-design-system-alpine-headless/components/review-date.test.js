// review-date.test.js
// ReviewDate component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("time.review-date");


describe("ReviewDate", () => {
  it("renders the element with its base class", async () => {
    await mount("review-date");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("review-date")).toBe(true);
  });

  it("uses the time element", async () => {
    await mount("review-date");
    expect(el().tagName.toLowerCase()).toBe("time");
  });
});
