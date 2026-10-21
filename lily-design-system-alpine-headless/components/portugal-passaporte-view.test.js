// portugal-passaporte-view.test.js
// PortugalPassaporteView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.portugal-passaporte-view");


describe("PortugalPassaporteView", () => {
  it("renders the element with its base class", async () => {
    await mount("portugal-passaporte-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("portugal-passaporte-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("portugal-passaporte-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
