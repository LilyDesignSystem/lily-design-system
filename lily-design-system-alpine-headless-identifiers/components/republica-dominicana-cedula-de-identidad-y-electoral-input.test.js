// republica-dominicana-cedula-de-identidad-y-electoral-input.test.js
// RepublicaDominicanaCedulaDeIdentidadYElectoralInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () =>
    document.querySelector("input.republica-dominicana-cedula-de-identidad-y-electoral-input");

describe("RepublicaDominicanaCedulaDeIdentidadYElectoralInput", () => {
    it("renders the element with its base class", async () => {
        await mount("republica-dominicana-cedula-de-identidad-y-electoral-input");
        expect(el()).not.toBeNull();
        expect(
            el().classList.contains("republica-dominicana-cedula-de-identidad-y-electoral-input"),
        ).toBe(true);
    });

    it("uses the input element", async () => {
        await mount("republica-dominicana-cedula-de-identidad-y-electoral-input");
        expect(el().tagName.toLowerCase()).toBe("input");
    });
});
