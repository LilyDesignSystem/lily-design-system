// early-warning-score-view.test.js
// EarlyWarningScoreView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.early-warning-score-view");

describe("EarlyWarningScoreView", () => {
    it("renders the element with its base class", async () => {
        await mount("early-warning-score-view");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("early-warning-score-view")).toBe(true);
    });

    it("uses the span element", async () => {
        await mount("early-warning-score-view");
        expect(el().tagName.toLowerCase()).toBe("span");
    });
});
