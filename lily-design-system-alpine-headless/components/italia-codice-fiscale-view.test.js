// italia-codice-fiscale-view.test.js
// ItaliaCodiceFiscaleView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.italia-codice-fiscale-view");


describe("ItaliaCodiceFiscaleView", () => {
  it("renders the element with its base class", async () => {
    await mount("italia-codice-fiscale-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("italia-codice-fiscale-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("italia-codice-fiscale-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
