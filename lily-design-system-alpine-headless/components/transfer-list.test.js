// transfer-list.test.js
// TransferList component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.transfer-list");


describe("TransferList", () => {
  it("renders the element with its base class", async () => {
    await mount("transfer-list");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("transfer-list")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("transfer-list");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
