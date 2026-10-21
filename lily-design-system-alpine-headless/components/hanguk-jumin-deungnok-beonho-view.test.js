// hanguk-jumin-deungnok-beonho-view.test.js
// HangukJuminDeungnokBeonhoView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.hanguk-jumin-deungnok-beonho-view");


describe("HangukJuminDeungnokBeonhoView", () => {
  it("renders the element with its base class", async () => {
    await mount("hanguk-jumin-deungnok-beonho-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("hanguk-jumin-deungnok-beonho-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("hanguk-jumin-deungnok-beonho-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
