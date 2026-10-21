// yisrael-teudat-zehut-view.test.js
// YisraelTeudatZehutView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.yisrael-teudat-zehut-view");


describe("YisraelTeudatZehutView", () => {
  it("renders the element with its base class", async () => {
    await mount("yisrael-teudat-zehut-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("yisrael-teudat-zehut-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("yisrael-teudat-zehut-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
