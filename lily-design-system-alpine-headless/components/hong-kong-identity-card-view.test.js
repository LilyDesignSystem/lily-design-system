// hong-kong-identity-card-view.test.js
// HongKongIdentityCardView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.hong-kong-identity-card-view");

describe("HongKongIdentityCardView", () => {
    it("renders the element with its base class", async () => {
        await mount("hong-kong-identity-card-view");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("hong-kong-identity-card-view")).toBe(true);
    });

    it("uses the span element", async () => {
        await mount("hong-kong-identity-card-view");
        expect(el().tagName.toLowerCase()).toBe("span");
    });
});
