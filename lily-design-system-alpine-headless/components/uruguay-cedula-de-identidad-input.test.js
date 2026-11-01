// uruguay-cedula-de-identidad-input.test.js
// UruguayCedulaDeIdentidadInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.uruguay-cedula-de-identidad-input");

describe("UruguayCedulaDeIdentidadInput", () => {
    it("renders the element with its base class", async () => {
        await mount("uruguay-cedula-de-identidad-input");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("uruguay-cedula-de-identidad-input")).toBe(true);
    });

    it("uses the input element", async () => {
        await mount("uruguay-cedula-de-identidad-input");
        expect(el().tagName.toLowerCase()).toBe("input");
    });
});
