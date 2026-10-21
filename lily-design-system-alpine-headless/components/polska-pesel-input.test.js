// polska-pesel-input.test.js
// PolskaPeselInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.polska-pesel-input");


describe("PolskaPeselInput", () => {
  it("renders the element with its base class", async () => {
    await mount("polska-pesel-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("polska-pesel-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("polska-pesel-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
