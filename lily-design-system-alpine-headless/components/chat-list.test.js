// chat-list.test.js
// ChatList component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("ol.chat-list");


describe("ChatList", () => {
  it("renders the element with its base class", async () => {
    await mount("chat-list");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("chat-list")).toBe(true);
  });

  it("uses the ol element", async () => {
    await mount("chat-list");
    expect(el().tagName.toLowerCase()).toBe("ol");
  });
});
