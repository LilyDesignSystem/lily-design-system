// segment-group.test.js
// SegmentGroup component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.segment-group");
const segs = () => [...document.querySelectorAll(".segment-group-item")];
const press = async (target, key, init = {}) => {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }));
  await tick();
};

describe("SegmentGroup", () => {
  it("renders the element with its base class", async () => {
    await mount("segment-group");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("segment-group")).toBe(true);
  });

  it("starts with the initial segment checked and tabbable", async () => {
    await mount("segment-group");
    expect(el().getAttribute("role")).toBe("radiogroup");
    expect(segs().map((s) => s.getAttribute("role"))).toEqual(["radio", "radio", "radio"]);
    expect(segs().map((s) => s.getAttribute("aria-checked"))).toEqual(["true", "false", "false"]);
    expect(segs().map((s) => s.getAttribute("tabindex"))).toEqual(["0", "-1", "-1"]);
  });
  it("arrows move focus and select, wrapping", async () => {
    await mount("segment-group");
    segs()[0].focus();
    await press(segs()[0], "ArrowRight");
    expect(document.activeElement).toBe(segs()[1]);
    expect(segs().map((s) => s.getAttribute("aria-checked"))).toEqual(["false", "true", "false"]);
    await press(segs()[1], "ArrowLeft");
    await press(segs()[0], "ArrowLeft");
    expect(document.activeElement).toBe(segs()[2]);
    expect(segs()[2].getAttribute("aria-checked")).toBe("true");
    expect(segs().map((s) => s.getAttribute("tabindex"))).toEqual(["-1", "-1", "0"]);
  });
  it("clicking selects and Home/End jump", async () => {
    await mount("segment-group");
    segs()[2].click(); await tick();
    expect(segs()[2].getAttribute("aria-checked")).toBe("true");
    segs()[2].focus();
    await press(segs()[2], "Home");
    expect(segs()[0].getAttribute("aria-checked")).toBe("true");
  });
});
