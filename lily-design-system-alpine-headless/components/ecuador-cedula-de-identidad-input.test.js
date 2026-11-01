// ecuador-cedula-de-identidad-input.test.js
// EcuadorCedulaDeIdentidadInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.ecuador-cedula-de-identidad-input");

describe("EcuadorCedulaDeIdentidadInput", () => {
    it("renders the element with its base class", async () => {
        await mount("ecuador-cedula-de-identidad-input");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("ecuador-cedula-de-identidad-input")).toBe(true);
    });

    it("uses the input element", async () => {
        await mount("ecuador-cedula-de-identidad-input");
        expect(el().tagName.toLowerCase()).toBe("input");
    });
});
