// float-button.test.js
// FloatButton component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("button.float-button");


describe("FloatButton", () => {
  it("renders the element with its base class", async () => {
    await mount("float-button");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("float-button")).toBe(true);
  });

  it("is a button fixed to its corner", async () => {
    await mount("float-button");
    expect(el().type).toBe("button");
    expect(el().getAttribute("data-position")).toBe("bottom-right");
    expect(el().style.position).toBe("fixed");
  });
});
