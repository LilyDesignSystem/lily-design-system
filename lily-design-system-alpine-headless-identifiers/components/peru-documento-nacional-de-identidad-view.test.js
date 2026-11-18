// peru-documento-nacional-de-identidad-view.test.js
// PeruDocumentoNacionalDeIdentidadView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.peru-documento-nacional-de-identidad-view");

describe("PeruDocumentoNacionalDeIdentidadView", () => {
    it("renders the element with its base class", async () => {
        await mount("peru-documento-nacional-de-identidad-view");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("peru-documento-nacional-de-identidad-view")).toBe(true);
    });

    it("uses the span element", async () => {
        await mount("peru-documento-nacional-de-identidad-view");
        expect(el().tagName.toLowerCase()).toBe("span");
    });
});
