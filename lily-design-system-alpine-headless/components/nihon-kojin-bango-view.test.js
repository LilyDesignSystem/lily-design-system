// nihon-kojin-bango-view.test.js
// NihonKojinBangoView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.nihon-kojin-bango-view");


describe("NihonKojinBangoView", () => {
  it("renders the element with its base class", async () => {
    await mount("nihon-kojin-bango-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("nihon-kojin-bango-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("nihon-kojin-bango-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
