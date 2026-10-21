// cesko-cestovni-pas-input.test.js
// CeskoCestovniPasInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.cesko-cestovni-pas-input");


describe("CeskoCestovniPasInput", () => {
  it("renders the element with its base class", async () => {
    await mount("cesko-cestovni-pas-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("cesko-cestovni-pas-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("cesko-cestovni-pas-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
