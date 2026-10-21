// yisrael-teudat-zehut-input.test.js
// YisraelTeudatZehutInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.yisrael-teudat-zehut-input");


describe("YisraelTeudatZehutInput", () => {
  it("renders the element with its base class", async () => {
    await mount("yisrael-teudat-zehut-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("yisrael-teudat-zehut-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("yisrael-teudat-zehut-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
