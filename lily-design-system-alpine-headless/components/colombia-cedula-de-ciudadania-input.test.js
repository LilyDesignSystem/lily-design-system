// colombia-cedula-de-ciudadania-input.test.js
// ColombiaCedulaDeCiudadaniaInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.colombia-cedula-de-ciudadania-input");

describe("ColombiaCedulaDeCiudadaniaInput", () => {
    it("renders the element with its base class", async () => {
        await mount("colombia-cedula-de-ciudadania-input");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("colombia-cedula-de-ciudadania-input")).toBe(true);
    });

    it("uses the input element", async () => {
        await mount("colombia-cedula-de-ciudadania-input");
        expect(el().tagName.toLowerCase()).toBe("input");
    });
});
