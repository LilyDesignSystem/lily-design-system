// signature-pad.test.js
// SignaturePad component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.signature-pad");

describe("SignaturePad", () => {
    it("renders the element with its base class", async () => {
        await mount("signature-pad");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("signature-pad")).toBe(true);
    });

    it("is a named group with its attestation, a typed-name field and an outcome notice", async () => {
        await mount("signature-pad");
        expect(el().getAttribute("role")).toBe("group");
        expect(el().getAttribute("aria-describedby")).toBe(el().firstElementChild.id);
        expect(el().getAttribute("data-outcome")).toBe("pending");
        const input = el().querySelector(".signature-pad-typed input");
        expect(el().querySelector(".signature-pad-typed label").getAttribute("for")).toBe(input.id);
        expect(el().querySelector(".signature-pad-outcome").textContent).toBe("Awaiting signature");
    });
});
