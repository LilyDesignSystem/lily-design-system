// date-time-now-input.test.js
// DateTimeNowInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.date-time-now-input");
const date = () => el().querySelector("input[type=date]");
const time = () => el().querySelector("input[type=time]");
const now = () => el().querySelector("button");

describe("DateTimeNowInput", () => {
  it("renders the element with its base class", async () => {
    await mount("date-time-now-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("date-time-now-input")).toBe(true);
  });

  it("is a group with a date input, a time input and a Now button", async () => {
    await mount("date-time-now-input");
    expect(el().getAttribute("role")).toBe("group");
    expect(date().value).toBe("");
    expect(time().value).toBe("");
    expect(now().type).toBe("button");
  });
  it("Now fills both fields with the current local date and time", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 9, 21, 8, 5));
    try {
      await mount("date-time-now-input");
      const seen = vi.fn();
      el().addEventListener("lily:change", (e) => seen(e.detail));
      now().click(); await tick();
      expect(date().value).toBe("2026-10-21");
      expect(time().value).toBe("08:05");
      expect(seen).toHaveBeenCalledWith({ date: "2026-10-21", time: "08:05" });
    } finally {
      vi.useRealTimers();
    }
  });
});
