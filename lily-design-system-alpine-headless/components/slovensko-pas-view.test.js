// slovensko-pas-view.test.js
// SlovenskoPasView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.slovensko-pas-view");


describe("SlovenskoPasView", () => {
  it("renders the element with its base class", async () => {
    await mount("slovensko-pas-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("slovensko-pas-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("slovensko-pas-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
