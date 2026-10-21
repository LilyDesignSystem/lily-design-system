// suomi-henkilotunnus-view.test.js
// SuomiHenkilotunnusView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.suomi-henkilotunnus-view");


describe("SuomiHenkilotunnusView", () => {
  it("renders the element with its base class", async () => {
    await mount("suomi-henkilotunnus-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("suomi-henkilotunnus-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("suomi-henkilotunnus-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
