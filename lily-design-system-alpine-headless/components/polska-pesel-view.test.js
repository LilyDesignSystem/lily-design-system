// polska-pesel-view.test.js
// PolskaPeselView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.polska-pesel-view");


describe("PolskaPeselView", () => {
  it("renders the element with its base class", async () => {
    await mount("polska-pesel-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("polska-pesel-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("polska-pesel-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
