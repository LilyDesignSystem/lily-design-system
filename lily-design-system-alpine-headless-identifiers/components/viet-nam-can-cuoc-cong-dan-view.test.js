// viet-nam-can-cuoc-cong-dan-view.test.js
// VietNamCanCuocCongDanView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.viet-nam-can-cuoc-cong-dan-view");

describe("VietNamCanCuocCongDanView", () => {
    it("renders the element with its base class", async () => {
        await mount("viet-nam-can-cuoc-cong-dan-view");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("viet-nam-can-cuoc-cong-dan-view")).toBe(true);
    });

    it("uses the span element", async () => {
        await mount("viet-nam-can-cuoc-cong-dan-view");
        expect(el().tagName.toLowerCase()).toBe("span");
    });
});
