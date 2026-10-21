// overlay-container.test.js
// OverlayContainer component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.overlay-container");


describe("OverlayContainer", () => {
  it("renders the element with its base class", async () => {
    await mount("overlay-container");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("overlay-container")).toBe(true);
  });

  it("is a hidden presentation backdrop", async () => {
    await mount("overlay-container");
    expect(el().getAttribute("role")).toBe("presentation");
    expect(el().hidden).toBe(true);
    expect(el().getAttribute("aria-hidden")).toBe("true");
    expect(el().getAttribute("data-open")).toBe("false");
  });
  it("emits overlay-close for a backdrop click but not a child click", async () => {
    await mount("overlay-container", '<div class="overlay-container" x-data="lilyOverlay(true)" x-bind="container"><button id="inner">x</button></div>');
    const closed = vi.fn();
    el().addEventListener("overlay-close", closed);
    expect(el().hidden).toBe(false);
    document.getElementById("inner").click(); await tick();
    expect(closed).not.toHaveBeenCalled();
    el().click(); await tick();
    expect(closed).toHaveBeenCalledTimes(1);
  });
});
