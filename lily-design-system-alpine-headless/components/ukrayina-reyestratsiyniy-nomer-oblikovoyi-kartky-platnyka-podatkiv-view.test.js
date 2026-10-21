// ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view.test.js
// UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view");


describe("UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView", () => {
  it("renders the element with its base class", async () => {
    await mount("ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
