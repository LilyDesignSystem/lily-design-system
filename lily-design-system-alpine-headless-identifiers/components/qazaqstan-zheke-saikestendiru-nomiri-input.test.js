// qazaqstan-zheke-saikestendiru-nomiri-input.test.js
// QazaqstanZhekeSaikestendiruNomiriInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.qazaqstan-zheke-saikestendiru-nomiri-input");

describe("QazaqstanZhekeSaikestendiruNomiriInput", () => {
    it("renders the element with its base class", async () => {
        await mount("qazaqstan-zheke-saikestendiru-nomiri-input");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("qazaqstan-zheke-saikestendiru-nomiri-input")).toBe(true);
    });

    it("uses the input element", async () => {
        await mount("qazaqstan-zheke-saikestendiru-nomiri-input");
        expect(el().tagName.toLowerCase()).toBe("input");
    });
});
