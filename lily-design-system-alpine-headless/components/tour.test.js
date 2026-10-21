// tour.test.js
// Tour component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.tour");
const press = async (target, key, init = {}) => {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }));
  await tick();
};
const steps = () => [...document.querySelectorAll(".tour-list-item")];
const button = (name) => document.querySelector(".tour-" + name);

describe("Tour", () => {
  it("renders the element with its base class", async () => {
    await mount("tour");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("tour")).toBe(true);
  });

  it("shows the first step as current and hides the rest from everyone", async () => {
    await mount("tour");
    expect(steps().map((s) => s.getAttribute("aria-roledescription"))).toEqual(["step", "step", "step"]);
    expect(steps().map((s) => s.getAttribute("aria-current"))).toEqual(["step", null, null]);
    expect(steps().map((s) => s.hidden)).toEqual([false, true, true]);
    expect(steps().map((s) => s.getAttribute("aria-hidden"))).toEqual([null, "true", "true"]);
    expect(steps().map((s) => s.getAttribute("aria-label"))).toEqual(["1 / 3", "2 / 3", "3 / 3"]);
  });
  it("next and previous move the current step, and previous stops at the first", async () => {
    await mount("tour");
    button("next").click(); await tick();
    expect(steps().map((s) => s.getAttribute("aria-current"))).toEqual([null, "step", null]);
    button("previous").click(); await tick();
    button("previous").click(); await tick();
    expect(steps()[0].getAttribute("aria-current")).toBe("step");
  });
  it("next on the last step finishes the tour", async () => {
    await mount("tour");
    const finished = vi.fn();
    el().addEventListener("lily:finish", finished);
    button("next").click(); await tick();
    button("next").click(); await tick();
    expect(el().hidden).toBe(false);
    button("next").click(); await tick();
    expect(el().hidden).toBe(true);
    expect(finished).toHaveBeenCalledTimes(1);
  });
  it("the close button and Escape end it", async () => {
    await mount("tour");
    const closed = vi.fn();
    el().addEventListener("lily:close", closed);
    button("close").click(); await tick();
    expect(el().hidden).toBe(true);
    await mount("tour");
    el().addEventListener("lily:close", closed);
    await press(button("next"), "Escape");
    expect(el().hidden).toBe(true);
    expect(closed).toHaveBeenCalledTimes(2);
  });
});
