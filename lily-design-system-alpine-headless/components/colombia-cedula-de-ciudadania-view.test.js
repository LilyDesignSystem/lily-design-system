// colombia-cedula-de-ciudadania-view.test.js
// ColombiaCedulaDeCiudadaniaView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.colombia-cedula-de-ciudadania-view");

describe("ColombiaCedulaDeCiudadaniaView", () => {
    it("renders the element with its base class", async () => {
        await mount("colombia-cedula-de-ciudadania-view");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("colombia-cedula-de-ciudadania-view")).toBe(true);
    });

    it("uses the span element", async () => {
        await mount("colombia-cedula-de-ciudadania-view");
        expect(el().tagName.toLowerCase()).toBe("span");
    });
});
