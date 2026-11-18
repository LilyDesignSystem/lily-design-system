// guatemala-codigo-unico-de-identificacion-view.test.js
// GuatemalaCodigoUnicoDeIdentificacionView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.guatemala-codigo-unico-de-identificacion-view");

describe("GuatemalaCodigoUnicoDeIdentificacionView", () => {
    it("renders the element with its base class", async () => {
        await mount("guatemala-codigo-unico-de-identificacion-view");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("guatemala-codigo-unico-de-identificacion-view")).toBe(true);
    });

    it("uses the span element", async () => {
        await mount("guatemala-codigo-unico-de-identificacion-view");
        expect(el().tagName.toLowerCase()).toBe("span");
    });
});
