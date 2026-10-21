// slovensko-pas-input.test.js
// SlovenskoPasInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.slovensko-pas-input");


describe("SlovenskoPasInput", () => {
  it("renders the element with its base class", async () => {
    await mount("slovensko-pas-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("slovensko-pas-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("slovensko-pas-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
