// event.test.js
// Event component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("article.event");


describe("Event", () => {
  it("renders the element with its base class", async () => {
    await mount("event");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("event")).toBe(true);
  });

  it("uses the article element", async () => {
    await mount("event");
    expect(el().tagName.toLowerCase()).toBe("article");
  });
});
