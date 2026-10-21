// chat-nav.test.js
// ChatNav component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("nav.chat-nav");


describe("ChatNav", () => {
  it("renders the element with its base class", async () => {
    await mount("chat-nav");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("chat-nav")).toBe(true);
  });

  it("uses the nav element", async () => {
    await mount("chat-nav");
    expect(el().tagName.toLowerCase()).toBe("nav");
  });
});
