// taiwan-guomin-shenfenzheng-tongyi-bianhao-input.test.js
// TaiwanGuominShenfenzhengTongyiBianhaoInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.taiwan-guomin-shenfenzheng-tongyi-bianhao-input");

describe("TaiwanGuominShenfenzhengTongyiBianhaoInput", () => {
    it("renders the element with its base class", async () => {
        await mount("taiwan-guomin-shenfenzheng-tongyi-bianhao-input");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("taiwan-guomin-shenfenzheng-tongyi-bianhao-input")).toBe(
            true,
        );
    });

    it("uses the input element", async () => {
        await mount("taiwan-guomin-shenfenzheng-tongyi-bianhao-input");
        expect(el().tagName.toLowerCase()).toBe("input");
    });
});
