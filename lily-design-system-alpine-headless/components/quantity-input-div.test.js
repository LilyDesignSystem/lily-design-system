// quantity-input-div.test.js
// QuantityInputDiv component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.quantity-input-div");

describe("QuantityInputDiv", () => {
    it("renders the element with its base class", async () => {
        await mount("quantity-input-div");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("quantity-input-div")).toBe(true);
    });

    it("uses the div element", async () => {
        await mount("quantity-input-div");
        expect(el().tagName.toLowerCase()).toBe("div");
    });
});
