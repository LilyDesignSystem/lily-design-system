// polska-numer-identyfikacji-podatkowej-input.test.js
// PolskaNumerIdentyfikacjiPodatkowejInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.polska-numer-identyfikacji-podatkowej-input");


describe("PolskaNumerIdentyfikacjiPodatkowejInput", () => {
  it("renders the element with its base class", async () => {
    await mount("polska-numer-identyfikacji-podatkowej-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("polska-numer-identyfikacji-podatkowej-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("polska-numer-identyfikacji-podatkowej-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
