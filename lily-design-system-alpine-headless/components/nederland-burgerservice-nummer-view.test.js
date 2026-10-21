// nederland-burgerservice-nummer-view.test.js
// NederlandBurgerserviceNummerView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.nederland-burgerservice-nummer-view");


describe("NederlandBurgerserviceNummerView", () => {
  it("renders the element with its base class", async () => {
    await mount("nederland-burgerservice-nummer-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("nederland-burgerservice-nummer-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("nederland-burgerservice-nummer-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
