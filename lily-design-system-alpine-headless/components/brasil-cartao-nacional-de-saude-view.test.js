// brasil-cartao-nacional-de-saude-view.test.js
// BrasilCartaoNacionalDeSaudeView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.brasil-cartao-nacional-de-saude-view");


describe("BrasilCartaoNacionalDeSaudeView", () => {
  it("renders the element with its base class", async () => {
    await mount("brasil-cartao-nacional-de-saude-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("brasil-cartao-nacional-de-saude-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("brasil-cartao-nacional-de-saude-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
