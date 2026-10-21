// hanguk-jumin-deungnok-beonho-input.test.js
// HangukJuminDeungnokBeonhoInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.hanguk-jumin-deungnok-beonho-input");


describe("HangukJuminDeungnokBeonhoInput", () => {
  it("renders the element with its base class", async () => {
    await mount("hanguk-jumin-deungnok-beonho-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("hanguk-jumin-deungnok-beonho-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("hanguk-jumin-deungnok-beonho-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
