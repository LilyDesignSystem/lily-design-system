// uruguay-cedula-de-identidad-view.test.js
// UruguayCedulaDeIdentidadView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.uruguay-cedula-de-identidad-view");

describe("UruguayCedulaDeIdentidadView", () => {
    it("renders the element with its base class", async () => {
        await mount("uruguay-cedula-de-identidad-view");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("uruguay-cedula-de-identidad-view")).toBe(true);
    });

    it("uses the span element", async () => {
        await mount("uruguay-cedula-de-identidad-view");
        expect(el().tagName.toLowerCase()).toBe("span");
    });
});
