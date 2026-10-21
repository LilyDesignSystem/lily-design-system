// polska-numer-identyfikacji-podatkowej-view.test.js
// PolskaNumerIdentyfikacjiPodatkowejView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.polska-numer-identyfikacji-podatkowej-view");


describe("PolskaNumerIdentyfikacjiPodatkowejView", () => {
  it("renders the element with its base class", async () => {
    await mount("polska-numer-identyfikacji-podatkowej-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("polska-numer-identyfikacji-podatkowej-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("polska-numer-identyfikacji-podatkowej-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
