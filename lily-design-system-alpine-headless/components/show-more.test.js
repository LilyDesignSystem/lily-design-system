// show-more.test.js
// ShowMore component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.show-more");
const button = () => document.querySelector(".show-more-button");
const content = () => document.querySelector(".show-more-content");

describe("ShowMore", () => {
  it("renders the element with its base class", async () => {
    await mount("show-more");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("show-more")).toBe(true);
  });

  it("starts collapsed", async () => {
    await mount("show-more");
    expect(button().getAttribute("aria-expanded")).toBe("false");
    expect(content().getAttribute("data-expanded")).toBe("false");
  });
  it("expands on click and mirrors the state on the content", async () => {
    await mount("show-more");
    button().click(); await tick();
    expect(button().getAttribute("aria-expanded")).toBe("true");
    expect(content().getAttribute("data-expanded")).toBe("true");
  });
});
