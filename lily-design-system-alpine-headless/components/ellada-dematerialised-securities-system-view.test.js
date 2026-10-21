// ellada-dematerialised-securities-system-view.test.js
// ElladaDematerialisedSecuritiesSystemView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.ellada-dematerialised-securities-system-view");


describe("ElladaDematerialisedSecuritiesSystemView", () => {
  it("renders the element with its base class", async () => {
    await mount("ellada-dematerialised-securities-system-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("ellada-dematerialised-securities-system-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("ellada-dematerialised-securities-system-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
