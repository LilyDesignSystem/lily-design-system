// person.test.js
// Person component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("article.person");


describe("Person", () => {
  it("renders the element with its base class", async () => {
    await mount("person");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("person")).toBe(true);
  });

  it("uses the article element", async () => {
    await mount("person");
    expect(el().tagName.toLowerCase()).toBe("article");
  });
});
