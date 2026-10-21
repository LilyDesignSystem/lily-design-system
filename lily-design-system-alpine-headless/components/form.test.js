// form.test.js
// Form component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("form.form");


describe("Form", () => {
  it("renders the element with its base class", async () => {
    await mount("form");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("form")).toBe(true);
  });

  it("uses the form element", async () => {
    await mount("form");
    expect(el().tagName.toLowerCase()).toBe("form");
  });
});
