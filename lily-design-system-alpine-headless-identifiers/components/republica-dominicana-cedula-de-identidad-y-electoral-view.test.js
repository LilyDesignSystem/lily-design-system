// republica-dominicana-cedula-de-identidad-y-electoral-view.test.js
// RepublicaDominicanaCedulaDeIdentidadYElectoralView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () =>
    document.querySelector("span.republica-dominicana-cedula-de-identidad-y-electoral-view");

describe("RepublicaDominicanaCedulaDeIdentidadYElectoralView", () => {
    it("renders the element with its base class", async () => {
        await mount("republica-dominicana-cedula-de-identidad-y-electoral-view");
        expect(el()).not.toBeNull();
        expect(
            el().classList.contains("republica-dominicana-cedula-de-identidad-y-electoral-view"),
        ).toBe(true);
    });

    it("uses the span element", async () => {
        await mount("republica-dominicana-cedula-de-identidad-y-electoral-view");
        expect(el().tagName.toLowerCase()).toBe("span");
    });
});
