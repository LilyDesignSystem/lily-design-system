// iban-view.test.js
// IbanView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.iban-view");

describe("IbanView", () => {
    it("renders the element with its base class", async () => {
        await mount("iban-view");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("iban-view")).toBe(true);
    });

    it("uses the span element", async () => {
        await mount("iban-view");
        expect(el().tagName.toLowerCase()).toBe("span");
    });
});
