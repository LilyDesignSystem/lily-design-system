// italia-codice-fiscale-input.test.js
// ItaliaCodiceFiscaleInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.italia-codice-fiscale-input");


describe("ItaliaCodiceFiscaleInput", () => {
  it("renders the element with its base class", async () => {
    await mount("italia-codice-fiscale-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("italia-codice-fiscale-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("italia-codice-fiscale-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
