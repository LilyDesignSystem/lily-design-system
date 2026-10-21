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

  it('is role="application" with an accessible name', async () => {
    await mount("signature-pad");
    expect(el().getAttribute("role")).toBe("application");
    expect(el().hasAttribute("aria-label")).toBe(true);
  });
});
