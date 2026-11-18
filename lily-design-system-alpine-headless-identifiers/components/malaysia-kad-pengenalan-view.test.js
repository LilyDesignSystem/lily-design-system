// malaysia-kad-pengenalan-view.test.js
// MalaysiaKadPengenalanView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.malaysia-kad-pengenalan-view");

describe("MalaysiaKadPengenalanView", () => {
    it("renders the element with its base class", async () => {
        await mount("malaysia-kad-pengenalan-view");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("malaysia-kad-pengenalan-view")).toBe(true);
    });

    it("uses the span element", async () => {
        await mount("malaysia-kad-pengenalan-view");
        expect(el().tagName.toLowerCase()).toBe("span");
    });
});
