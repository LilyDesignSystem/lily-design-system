// schweiz-ahv-nummer-view.test.js
// SchweizAhvNummerView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.schweiz-ahv-nummer-view");


describe("SchweizAhvNummerView", () => {
  it("renders the element with its base class", async () => {
    await mount("schweiz-ahv-nummer-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("schweiz-ahv-nummer-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("schweiz-ahv-nummer-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
