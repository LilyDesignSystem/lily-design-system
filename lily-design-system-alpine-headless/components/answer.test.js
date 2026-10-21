// answer.test.js
// Answer component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.answer");


describe("Answer", () => {
  it("renders the element with its base class", async () => {
    await mount("answer");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("answer")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("answer");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
