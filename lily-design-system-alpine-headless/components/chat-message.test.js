// chat-message.test.js
// ChatMessage component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("article.chat-message");


describe("ChatMessage", () => {
  it("renders the element with its base class", async () => {
    await mount("chat-message");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("chat-message")).toBe(true);
  });

  it("uses the article element", async () => {
    await mount("chat-message");
    expect(el().tagName.toLowerCase()).toBe("article");
  });
});
