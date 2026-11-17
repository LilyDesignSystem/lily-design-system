// record-provenance-view.test.js
// RecordProvenanceView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.record-provenance-view");

describe("RecordProvenanceView", () => {
    it("renders the element with its base class", async () => {
        await mount("record-provenance-view");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("record-provenance-view")).toBe(true);
    });

    it("uses the span element", async () => {
        await mount("record-provenance-view");
        expect(el().tagName.toLowerCase()).toBe("span");
    });
});
