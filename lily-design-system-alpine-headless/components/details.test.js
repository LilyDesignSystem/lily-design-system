// details.test.js
// Details component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("details.details");


describe("Details", () => {
  it("renders the element with its base class", async () => {
    await mount("details");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("details")).toBe(true);
  });

  it("is a native disclosure, closed by default", async () => {
    await mount("details");
    expect(el().open).toBe(false);
    el().open = true;
    expect(el().hasAttribute("open")).toBe(true);
  });
});
