// malaysia-kad-pengenalan-input.test.js
// MalaysiaKadPengenalanInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.malaysia-kad-pengenalan-input");

describe("MalaysiaKadPengenalanInput", () => {
    it("renders the element with its base class", async () => {
        await mount("malaysia-kad-pengenalan-input");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("malaysia-kad-pengenalan-input")).toBe(true);
    });

    it("uses the input element", async () => {
        await mount("malaysia-kad-pengenalan-input");
        expect(el().tagName.toLowerCase()).toBe("input");
    });
});
