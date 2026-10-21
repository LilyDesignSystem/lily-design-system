// beach-ball.test.js
// BeachBall component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.beach-ball");


describe("BeachBall", () => {
  it("renders the element with its base class", async () => {
    await mount("beach-ball");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("beach-ball")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("beach-ball");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
