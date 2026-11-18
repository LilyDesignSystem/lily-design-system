// qazaqstan-zheke-saikestendiru-nomiri-view.test.js
// QazaqstanZhekeSaikestendiruNomiriView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.qazaqstan-zheke-saikestendiru-nomiri-view");

describe("QazaqstanZhekeSaikestendiruNomiriView", () => {
    it("renders the element with its base class", async () => {
        await mount("qazaqstan-zheke-saikestendiru-nomiri-view");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("qazaqstan-zheke-saikestendiru-nomiri-view")).toBe(true);
    });

    it("uses the span element", async () => {
        await mount("qazaqstan-zheke-saikestendiru-nomiri-view");
        expect(el().tagName.toLowerCase()).toBe("span");
    });
});
