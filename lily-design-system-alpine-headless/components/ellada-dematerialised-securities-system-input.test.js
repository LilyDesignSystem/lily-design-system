// ellada-dematerialised-securities-system-input.test.js
// ElladaDematerialisedSecuritiesSystemInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.ellada-dematerialised-securities-system-input");


describe("ElladaDematerialisedSecuritiesSystemInput", () => {
  it("renders the element with its base class", async () => {
    await mount("ellada-dematerialised-securities-system-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("ellada-dematerialised-securities-system-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("ellada-dematerialised-securities-system-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
