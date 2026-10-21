// feature-card.test.js
// FeatureCard component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("article.feature-card");


describe("FeatureCard", () => {
  it("renders the element with its base class", async () => {
    await mount("feature-card");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("feature-card")).toBe(true);
  });

  it("uses the article element", async () => {
    await mount("feature-card");
    expect(el().tagName.toLowerCase()).toBe("article");
  });
});
