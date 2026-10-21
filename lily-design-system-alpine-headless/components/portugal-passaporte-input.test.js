// portugal-passaporte-input.test.js
// PortugalPassaporteInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.portugal-passaporte-input");


describe("PortugalPassaporteInput", () => {
  it("renders the element with its base class", async () => {
    await mount("portugal-passaporte-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("portugal-passaporte-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("portugal-passaporte-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
