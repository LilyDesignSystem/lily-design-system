// peru-documento-nacional-de-identidad-input.test.js
// PeruDocumentoNacionalDeIdentidadInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.peru-documento-nacional-de-identidad-input");

describe("PeruDocumentoNacionalDeIdentidadInput", () => {
    it("renders the element with its base class", async () => {
        await mount("peru-documento-nacional-de-identidad-input");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("peru-documento-nacional-de-identidad-input")).toBe(true);
    });

    it("uses the input element", async () => {
        await mount("peru-documento-nacional-de-identidad-input");
        expect(el().tagName.toLowerCase()).toBe("input");
    });
});
