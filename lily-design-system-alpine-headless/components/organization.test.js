// organization.test.js
// Organization component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("article.organization");


describe("Organization", () => {
  it("renders the element with its base class", async () => {
    await mount("organization");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("organization")).toBe(true);
  });

  it("uses the article element", async () => {
    await mount("organization");
    expect(el().tagName.toLowerCase()).toBe("article");
  });
});
