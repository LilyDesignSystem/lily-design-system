// lietuva-asmens-kodas-view.test.js
// LietuvaAsmensKodasView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.lietuva-asmens-kodas-view");


describe("LietuvaAsmensKodasView", () => {
  it("renders the element with its base class", async () => {
    await mount("lietuva-asmens-kodas-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("lietuva-asmens-kodas-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("lietuva-asmens-kodas-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
