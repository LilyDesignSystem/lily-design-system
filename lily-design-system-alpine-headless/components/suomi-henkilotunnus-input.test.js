// suomi-henkilotunnus-input.test.js
// SuomiHenkilotunnusInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.suomi-henkilotunnus-input");


describe("SuomiHenkilotunnusInput", () => {
  it("renders the element with its base class", async () => {
    await mount("suomi-henkilotunnus-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("suomi-henkilotunnus-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("suomi-henkilotunnus-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
