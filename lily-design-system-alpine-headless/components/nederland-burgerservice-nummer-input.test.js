// nederland-burgerservice-nummer-input.test.js
// NederlandBurgerserviceNummerInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.nederland-burgerservice-nummer-input");


describe("NederlandBurgerserviceNummerInput", () => {
  it("renders the element with its base class", async () => {
    await mount("nederland-burgerservice-nummer-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("nederland-burgerservice-nummer-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("nederland-burgerservice-nummer-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
