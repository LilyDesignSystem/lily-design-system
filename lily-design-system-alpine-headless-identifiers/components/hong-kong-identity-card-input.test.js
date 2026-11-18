// hong-kong-identity-card-input.test.js
// HongKongIdentityCardInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.hong-kong-identity-card-input");

describe("HongKongIdentityCardInput", () => {
    it("renders the element with its base class", async () => {
        await mount("hong-kong-identity-card-input");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("hong-kong-identity-card-input")).toBe(true);
    });

    it("uses the input element", async () => {
        await mount("hong-kong-identity-card-input");
        expect(el().tagName.toLowerCase()).toBe("input");
    });
});
