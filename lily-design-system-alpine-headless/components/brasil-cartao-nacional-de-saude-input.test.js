// brasil-cartao-nacional-de-saude-input.test.js
// BrasilCartaoNacionalDeSaudeInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.brasil-cartao-nacional-de-saude-input");


describe("BrasilCartaoNacionalDeSaudeInput", () => {
  it("renders the element with its base class", async () => {
    await mount("brasil-cartao-nacional-de-saude-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("brasil-cartao-nacional-de-saude-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("brasil-cartao-nacional-de-saude-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
