// taiwan-guomin-shenfenzheng-tongyi-bianhao-view.test.js
// TaiwanGuominShenfenzhengTongyiBianhaoView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.taiwan-guomin-shenfenzheng-tongyi-bianhao-view");

describe("TaiwanGuominShenfenzhengTongyiBianhaoView", () => {
    it("renders the element with its base class", async () => {
        await mount("taiwan-guomin-shenfenzheng-tongyi-bianhao-view");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("taiwan-guomin-shenfenzheng-tongyi-bianhao-view")).toBe(
            true,
        );
    });

    it("uses the span element", async () => {
        await mount("taiwan-guomin-shenfenzheng-tongyi-bianhao-view");
        expect(el().tagName.toLowerCase()).toBe("span");
    });
});
