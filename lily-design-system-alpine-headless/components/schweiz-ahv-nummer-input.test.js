// schweiz-ahv-nummer-input.test.js
// SchweizAhvNummerInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.schweiz-ahv-nummer-input");


describe("SchweizAhvNummerInput", () => {
  it("renders the element with its base class", async () => {
    await mount("schweiz-ahv-nummer-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("schweiz-ahv-nummer-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("schweiz-ahv-nummer-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
