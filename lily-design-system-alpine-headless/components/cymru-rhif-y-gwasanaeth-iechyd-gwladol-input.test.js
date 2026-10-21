// cymru-rhif-y-gwasanaeth-iechyd-gwladol-input.test.js
// CymruRhifYGwasanaethIechydGwladolInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.cymru-rhif-y-gwasanaeth-iechyd-gwladol-input");


describe("CymruRhifYGwasanaethIechydGwladolInput", () => {
  it("renders the element with its base class", async () => {
    await mount("cymru-rhif-y-gwasanaeth-iechyd-gwladol-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("cymru-rhif-y-gwasanaeth-iechyd-gwladol-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("cymru-rhif-y-gwasanaeth-iechyd-gwladol-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
