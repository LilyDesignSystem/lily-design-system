// nihon-kojin-bango-input.test.js
// NihonKojinBangoInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.nihon-kojin-bango-input");


describe("NihonKojinBangoInput", () => {
  it("renders the element with its base class", async () => {
    await mount("nihon-kojin-bango-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("nihon-kojin-bango-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("nihon-kojin-bango-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
