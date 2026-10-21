// notification.test.js
// Notification component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.notification");


describe("Notification", () => {
  it("renders the element with its base class", async () => {
    await mount("notification");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("notification")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("notification");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
