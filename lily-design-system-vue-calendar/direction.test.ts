// @vitest-environment jsdom
import { afterEach, describe, expect, test, vi } from "vitest";
import { isRtl, logicalKey } from "./direction";

afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
    document.documentElement.removeAttribute("dir");
});

describe("direction", () => {
    test("no element or no dir is left to right", () => {
        expect(isRtl(null)).toBe(false);
        document.body.innerHTML = "<div id=x></div>";
        expect(isRtl(document.getElementById("x"))).toBe(false);
    });
    test("the nearest dir attribute wins", () => {
        document.body.innerHTML =
            '<div dir="rtl"><div id=a></div><div dir="ltr"><div id=b></div></div></div>';
        expect(isRtl(document.getElementById("a"))).toBe(true);
        expect(isRtl(document.getElementById("b"))).toBe(false);
    });
    test("the document's dir applies", () => {
        document.documentElement.setAttribute("dir", "rtl");
        document.body.innerHTML = "<div id=x></div>";
        expect(isRtl(document.getElementById("x"))).toBe(true);
    });
    test("dir is case-insensitive and auto is not rtl", () => {
        document.body.innerHTML = '<div dir="RTL" id=a></div><div dir="auto" id=b></div>';
        expect(isRtl(document.getElementById("a"))).toBe(true);
        expect(isRtl(document.getElementById("b"))).toBe(false);
    });
    // jsdom computes `direction` from `dir` too, so these stub it apart from the attribute (found by bin/mutation-test).
    test("a dir attribute wins over the computed direction, either way", () => {
        document.body.innerHTML =
            '<div dir="rtl"><span id=a></span></div><div dir="ltr"><span id=b></span></div>';
        vi.stubGlobal("getComputedStyle", () => ({ direction: "ltr" }));
        expect(isRtl(document.getElementById("a"))).toBe(true);
        vi.stubGlobal("getComputedStyle", () => ({ direction: "rtl" }));
        expect(isRtl(document.getElementById("b"))).toBe(false);
    });
    test("with no dir attribute, the computed direction decides", () => {
        document.body.innerHTML = "<span id=x></span>";
        vi.stubGlobal("getComputedStyle", () => ({ direction: "rtl" }));
        expect(isRtl(document.getElementById("x"))).toBe(true);
        vi.stubGlobal("getComputedStyle", () => ({ direction: "ltr" }));
        expect(isRtl(document.getElementById("x"))).toBe(false);
    });
    test("with no dir attribute and no getComputedStyle, it is left to right", () => {
        document.body.innerHTML = "<span id=x></span>";
        vi.stubGlobal("getComputedStyle", undefined);
        expect(isRtl(document.getElementById("x"))).toBe(false);
    });
    test("logicalKey swaps the horizontal arrows in rtl only", () => {
        expect(logicalKey("ArrowLeft", false)).toBe("ArrowLeft");
        expect(logicalKey("ArrowLeft", true)).toBe("ArrowRight");
        expect(logicalKey("ArrowRight", true)).toBe("ArrowLeft");
        expect(logicalKey("ArrowDown", true)).toBe("ArrowDown");
        expect(logicalKey("Home", true)).toBe("Home");
    });
});
