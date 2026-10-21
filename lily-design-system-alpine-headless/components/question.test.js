// question.test.js
// Question component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.question");


describe("Question", () => {
  it("renders the element with its base class", async () => {
    await mount("question");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("question")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("question");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
