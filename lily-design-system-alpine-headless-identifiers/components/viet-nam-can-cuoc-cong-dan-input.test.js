// viet-nam-can-cuoc-cong-dan-input.test.js
// VietNamCanCuocCongDanInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.viet-nam-can-cuoc-cong-dan-input");

describe("VietNamCanCuocCongDanInput", () => {
    it("renders the element with its base class", async () => {
        await mount("viet-nam-can-cuoc-cong-dan-input");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("viet-nam-can-cuoc-cong-dan-input")).toBe(true);
    });

    it("uses the input element", async () => {
        await mount("viet-nam-can-cuoc-cong-dan-input");
        expect(el().tagName.toLowerCase()).toBe("input");
    });
});
