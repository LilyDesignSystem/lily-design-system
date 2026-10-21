// chat-list-item.test.js
// ChatListItem component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("li.chat-list-item");


describe("ChatListItem", () => {
  it("renders the element with its base class", async () => {
    await mount("chat-list-item");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("chat-list-item")).toBe(true);
  });

  it("uses the li element", async () => {
    await mount("chat-list-item");
    expect(el().tagName.toLowerCase()).toBe("li");
  });
});
