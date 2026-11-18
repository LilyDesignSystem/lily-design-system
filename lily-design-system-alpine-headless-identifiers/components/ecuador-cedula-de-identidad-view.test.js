// ecuador-cedula-de-identidad-view.test.js
// EcuadorCedulaDeIdentidadView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.ecuador-cedula-de-identidad-view");

describe("EcuadorCedulaDeIdentidadView", () => {
    it("renders the element with its base class", async () => {
        await mount("ecuador-cedula-de-identidad-view");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("ecuador-cedula-de-identidad-view")).toBe(true);
    });

    it("uses the span element", async () => {
        await mount("ecuador-cedula-de-identidad-view");
        expect(el().tagName.toLowerCase()).toBe("span");
    });
});
