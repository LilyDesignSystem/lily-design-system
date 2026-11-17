import { afterEach, describe, expect, it } from "vitest";
import { applyThemeColor, applyThemeColorWhenLoaded, brandColor } from "./theme-color";

const meta = () => document.head.querySelector<HTMLMetaElement>('meta[name="theme-color"]');

afterEach(() => {
    meta()?.remove();
    document.documentElement.style.removeProperty("--lily-brand");
});

describe("theme-color", () => {
    it("reads --lily-brand from the root", () => {
        document.documentElement.style.setProperty("--lily-brand", " #005eb8 ");
        expect(brandColor()).toBe("#005eb8");
    });

    it("creates the meta tag and sets it from the brand colour", () => {
        document.documentElement.style.setProperty("--lily-brand", "#005eb8");
        expect(meta()).toBeNull();
        expect(applyThemeColor()).toBe(true);
        expect(meta()?.content).toBe("#005eb8");
    });

    it("writes nothing when the colour is unchanged, and updates when it changes", () => {
        document.documentElement.style.setProperty("--lily-brand", "#005eb8");
        applyThemeColor();
        expect(applyThemeColor()).toBe(false);
        document.documentElement.style.setProperty("--lily-brand", "#7a1f5c");
        expect(applyThemeColor()).toBe(true);
        expect(meta()?.content).toBe("#7a1f5c");
    });

    it("leaves the tag alone when a theme sets no --lily-brand", () => {
        expect(applyThemeColor()).toBe(false);
        expect(meta()).toBeNull();
    });

    it("waits for the stylesheet to load", () => {
        const link = document.createElement("link");
        applyThemeColorWhenLoaded(link);
        document.documentElement.style.setProperty("--lily-brand", "#005eb8");
        expect(meta()).toBeNull();
        link.dispatchEvent(new Event("load"));
        expect(meta()?.content).toBe("#005eb8");
    });
});
