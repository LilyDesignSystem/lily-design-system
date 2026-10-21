// ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input.test.js
// UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input");


describe("UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivInput", () => {
  it("renders the element with its base class", async () => {
    await mount("ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
