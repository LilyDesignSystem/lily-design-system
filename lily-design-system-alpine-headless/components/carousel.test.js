// carousel.test.js
// Carousel component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.carousel");
const slides = () => [...document.querySelectorAll(".carousel-slide")];
const previous = () => document.querySelector(".carousel-previous");
const next = () => document.querySelector(".carousel-next");

describe("Carousel", () => {
  it("renders the element with its base class", async () => {
    await mount("carousel");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("carousel")).toBe(true);
  });

  it("is a carousel region showing only the first slide", async () => {
    await mount("carousel");
    expect(el().getAttribute("role")).toBe("region");
    expect(el().getAttribute("aria-roledescription")).toBe("carousel");
    expect(slides().map((s) => s.hidden)).toEqual([false, true, true]);
    expect(slides().map((s) => s.getAttribute("role"))).toEqual(["group", "group", "group"]);
    expect(slides().map((s) => s.getAttribute("aria-label"))).toEqual(["1 / 3", "2 / 3", "3 / 3"]);
    expect(el().getAttribute("data-index")).toBe("0");
  });
  it("next and previous move one slide and wrap", async () => {
    await mount("carousel");
    next().click(); await tick();
    expect(slides().map((s) => s.hidden)).toEqual([true, false, true]);
    previous().click(); await tick();
    previous().click(); await tick();
    expect(slides().map((s) => s.hidden)).toEqual([true, true, false]);
    next().click(); await tick();
    expect(slides()[0].hidden).toBe(false);
    expect(el().getAttribute("data-index")).toBe("0");
  });
  it("announces the slide it lands on", async () => {
    await mount("carousel");
    const seen = vi.fn();
    el().addEventListener("lily:change", (e) => seen(e.detail));
    next().click(); await tick();
    expect(seen).toHaveBeenCalledWith({ index: 1 });
  });
});
