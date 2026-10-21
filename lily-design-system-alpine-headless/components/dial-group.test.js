// dial-group.test.js
// DialGroup component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.dial-group");


describe("DialGroup", () => {
  it("renders the element with its base class", async () => {
    await mount("dial-group");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("dial-group")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("dial-group");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
