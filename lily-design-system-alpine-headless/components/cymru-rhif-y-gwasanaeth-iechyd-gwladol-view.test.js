// cymru-rhif-y-gwasanaeth-iechyd-gwladol-view.test.js
// CymruRhifYGwasanaethIechydGwladolView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.cymru-rhif-y-gwasanaeth-iechyd-gwladol-view");


describe("CymruRhifYGwasanaethIechydGwladolView", () => {
  it("renders the element with its base class", async () => {
    await mount("cymru-rhif-y-gwasanaeth-iechyd-gwladol-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("cymru-rhif-y-gwasanaeth-iechyd-gwladol-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("cymru-rhif-y-gwasanaeth-iechyd-gwladol-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
