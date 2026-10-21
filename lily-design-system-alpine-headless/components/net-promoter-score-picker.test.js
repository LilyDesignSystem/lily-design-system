// net-promoter-score-picker.test.js
// NetPromoterScorePicker component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("fieldset.net-promoter-score-picker");


describe("NetPromoterScorePicker", () => {
  it("renders the element with its base class", async () => {
    await mount("net-promoter-score-picker");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("net-promoter-score-picker")).toBe(true);
  });

  const radios = () => [...document.querySelectorAll("input[type=radio]")];
  it("renders 11 native radios that share one name", async () => {
    await mount("net-promoter-score-picker");
    expect(el().getAttribute("role")).toBe("radiogroup");
    expect(radios()).toHaveLength(11);
    expect(new Set(radios().map((r) => r.name))).toEqual(new Set(["nps"]));
    expect(radios().every((r) => !r.checked)).toBe(true);
  });
  it("choosing a radio unchecks the others and updates data-value", async () => {
    await mount("net-promoter-score-picker");
    radios()[2].click(); await tick();
    expect(radios().map((r) => r.checked)).toEqual(radios().map((_, i) => i === 2));
    expect(el().getAttribute("data-value")).toBe("2");
    radios()[0].click(); await tick();
    expect(el().getAttribute("data-value")).toBe("0");
  });
  it("a disabled fieldset disables every radio", async () => {
    await mount("net-promoter-score-picker");
    el().disabled = true;
    expect(radios().every((r) => r.matches(":disabled"))).toBe(true);
  });
});
