// cesko-cestovni-pas-view.test.js
// CeskoCestovniPasView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.cesko-cestovni-pas-view");


describe("CeskoCestovniPasView", () => {
  it("renders the element with its base class", async () => {
    await mount("cesko-cestovni-pas-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("cesko-cestovni-pas-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("cesko-cestovni-pas-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
