// document-list.test.js
// DocumentList component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("ul.document-list");


describe("DocumentList", () => {
  it("renders the element with its base class", async () => {
    await mount("document-list");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("document-list")).toBe(true);
  });

  it("uses the ul element", async () => {
    await mount("document-list");
    expect(el().tagName.toLowerCase()).toBe("ul");
  });
});
