// costa-rica-cedula-de-identidad-view.test.js
// CostaRicaCedulaDeIdentidadView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.costa-rica-cedula-de-identidad-view");

describe("CostaRicaCedulaDeIdentidadView", () => {
    it("renders the element with its base class", async () => {
        await mount("costa-rica-cedula-de-identidad-view");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("costa-rica-cedula-de-identidad-view")).toBe(true);
    });

    it("uses the span element", async () => {
        await mount("costa-rica-cedula-de-identidad-view");
        expect(el().tagName.toLowerCase()).toBe("span");
    });
});
