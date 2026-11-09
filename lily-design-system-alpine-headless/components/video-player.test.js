// video-player.test.js
// VideoPlayer component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("figure.video-player");

describe("VideoPlayer", () => {
    it("renders the element with its base class", async () => {
        await mount("video-player");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("video-player")).toBe(true);
    });

    it("uses the figure element", async () => {
        await mount("video-player");
        expect(el().tagName.toLowerCase()).toBe("figure");
    });
});
