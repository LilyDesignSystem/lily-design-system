// error-message.test.js
// ErrorMessage component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("p.error-message");

describe("ErrorMessage", () => {
    it("renders the element with its base class", async () => {
        await mount("error-message");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("error-message")).toBe(true);
    });

    it("uses the p element", async () => {
        await mount("error-message");
        expect(el().tagName.toLowerCase()).toBe("p");
    });
});
