// chat-composer.test.js
// ChatComposer component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("form.chat-composer");


describe("ChatComposer", () => {
  it("renders the element with its base class", async () => {
    await mount("chat-composer");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("chat-composer")).toBe(true);
  });

  it("uses the form element", async () => {
    await mount("chat-composer");
    expect(el().tagName.toLowerCase()).toBe("form");
  });
});
