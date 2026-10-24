import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import * as React from "react";
import TimeZonePicker, { DEFAULT_ZONES } from "./TimeZonePicker";

// A fixed date, so offsets and names do not depend on the day the tests run: January, standard time in the north.
const WINTER = new Date(Date.UTC(2026, 0, 15, 12, 0, 0));
const SUMMER = new Date(Date.UTC(2026, 6, 15, 12, 0, 0));
const ZONES = ["Asia/Tokyo", "America/New_York", "Europe/Paris", "UTC", "Asia/Kolkata"];
// ...and the order the picker must show them in: west to east.
const ORDERED = ["America/New_York", "UTC", "Europe/Paris", "Asia/Kolkata", "Asia/Tokyo"];

const base = { label: "Time zone", locale: "en", zones: ZONES, date: WINTER };

const flush = () => new Promise((r) => setTimeout(r, 0));
const options = () => Array.from(document.querySelectorAll<HTMLElement>(".time-zone-picker-option"));
const list = () => document.querySelector(".time-zone-picker-list") as HTMLElement;
const button = () => screen.getByRole("button");
const hidden = () => document.querySelector('input[type="hidden"]') as HTMLInputElement;

/** Open the list and click the option for `zone`. */
async function pick(zone: string): Promise<void> {
    await fireEvent.click(button());
    await fireEvent.click(options()[ORDERED.indexOf(zone)]);
}

beforeEach(() => {
    document.documentElement.removeAttribute("data-time-zone");
    try {
        localStorage.clear();
    } catch {
        /* ignore */
    }
});

afterEach(() => {
    cleanup();
    document.documentElement.removeAttribute("data-time-zone");
});

describe("markup contract", () => {
    test("a button that controls a listbox", () => {
        render(<TimeZonePicker {...(base)} />);
        expect(button().tagName).toBe("BUTTON");
        expect(button().getAttribute("type")).toBe("button");
        expect(button().getAttribute("aria-haspopup")).toBe("listbox");
        expect(button().getAttribute("aria-expanded")).toBe("false");
        expect(document.getElementById(button().getAttribute("aria-controls")!)?.getAttribute("role")).toBe("listbox");
    });

    test("the root carries the base class and the consumer's class", () => {
        const { container } = render(<TimeZonePicker {...({ ...base, className: "mine", "data-x": "1" })} />);
        const root = container.querySelector(".time-zone-picker")!;
        expect(root.getAttribute("class")).toBe("time-zone-picker mine");
        expect(root.getAttribute("data-x")).toBe("1");
    });

    test("the icon is a bundled SVG, hidden from assistive technology", () => {
        render(<TimeZonePicker {...(base)} />);
        const icon = document.querySelector(".time-zone-picker-icon") as SVGElement;
        expect(icon.tagName.toLowerCase()).toBe("svg");
        expect(icon.getAttribute("aria-hidden")).toBe("true");
        expect(icon.querySelector("path")).toBeTruthy();
    });

    test("the label names the button and the listbox, and is the tooltip's text", () => {
        render(<TimeZonePicker {...({ ...base, label: "Choose a time zone" })} />);
        expect(screen.getByRole("button", { name: "Choose a time zone" })).toBeTruthy();
        expect(list().getAttribute("aria-label")).toBe("Choose a time zone");
        expect(document.querySelector(".time-zone-picker-tooltip")!.textContent).toBe("Choose a time zone");
    });

    test("one option per zone, each an option with aria-selected", async () => {
        render(<TimeZonePicker {...(base)} />);
        await flush();
        expect(options().length).toBe(ZONES.length);
        for (const o of options()) {
            expect(o.getAttribute("role")).toBe("option");
            expect(o.getAttribute("aria-selected")).toMatch(/true|false/);
        }
    });

    test("the hidden input carries the name and the IANA id", async () => {
        render(<TimeZonePicker {...({ ...base, name: "tz", defaultValue: "Asia/Tokyo" })} />);
        await flush();
        expect(hidden().name).toBe("tz");
        expect(hidden().value).toBe("Asia/Tokyo");
    });

    test("the hidden input is named time-zone by default", () => {
        render(<TimeZonePicker {...(base)} />);
        expect(hidden().name).toBe("time-zone");
    });

    test("the list is hidden until opened", () => {
        render(<TimeZonePicker {...(base)} />);
        expect(list().hasAttribute("hidden")).toBe(true);
    });
});

describe("options: offsets and full names, ordered by offset", () => {
    test("ordered west to east, whatever order the zones were given", async () => {
        render(<TimeZonePicker {...(base)} />);
        await flush();
        expect(options().map((o) => o.textContent!.trim().slice(0, 9))).toEqual(["UTC-05:00", "UTC+00:00", "UTC+01:00", "UTC+05:30", "UTC+09:00"]);
    });

    test("each option shows its offset and its full name", async () => {
        render(<TimeZonePicker {...(base)} />);
        await flush();
        const text = options().map((o) => o.textContent!.trim());
        expect(text).toContain("UTC-05:00 – Eastern Standard Time");
        expect(text).toContain("UTC+01:00 – Central European Standard Time");
        expect(text).toContain("UTC+05:30 – India Standard Time");
        expect(text).toContain("UTC+09:00 – Japan Standard Time");
    });

    test("each option carries its offset as data-offset", async () => {
        render(<TimeZonePicker {...(base)} />);
        await flush();
        expect(options()[3].getAttribute("data-offset")).toBe("UTC+05:30");
    });

    test("the names are in the locale it is given", async () => {
        render(<TimeZonePicker {...({ ...base, locale: "fr", zones: ["Europe/Paris"] })} />);
        await flush();
        expect(options()[0].textContent).toMatch(/UTC\+01:00 – .*Europe centrale/);
    });

    test("the date decides the offsets: summer time shows the summer offset", async () => {
        render(<TimeZonePicker {...({ ...base, date: SUMMER, zones: ["Europe/Paris", "America/New_York"] })} />);
        await flush();
        const text = options().map((o) => o.textContent!.trim());
        expect(text[0]).toMatch(/^UTC-04:00 – Eastern Daylight Time$/);
        expect(text[1]).toMatch(/^UTC\+02:00 – Central European Summer Time$/);
    });

    test("labelFor builds the text", async () => {
        render(<TimeZonePicker {...({ ...base, labelFor: (z) => `${z.name} [${z.offset}]` })} />);
        await flush();
        expect(options().map((o) => o.textContent!.trim())).toContain("India Standard Time [UTC+05:30]");
    });

    test("an unknown zone is left out, not shown unnamed", async () => {
        render(<TimeZonePicker {...({ ...base, zones: ["UTC", "Nowhere/Land"] })} />);
        await flush();
        expect(options().length).toBe(1);
    });

    test("the default list is offered when no zones are given, ordered by offset", async () => {
        render(<TimeZonePicker {...({ label: "Time zone", locale: "en", date: WINTER })} />);
        await flush();
        expect(options().length).toBe(DEFAULT_ZONES.length);
        const offsets = options().map((o) => o.getAttribute("data-offset")!);
        const minutes = offsets.map((t) => (t[3] === "-" ? -1 : 1) * (Number(t.slice(4, 6)) * 60 + Number(t.slice(7, 9))));
        expect(minutes).toEqual([...minutes].sort((a, b) => a - b));
    });
});

describe("supplied names (CLDR packs)", () => {
    const names = { "Asia/Kolkata": "Bharat Standard", "Europe/Paris": ["Paris Standard", "Paris Summer"] } as const;

    test("win over Intl for the zones they name, and the rest stay Intl's", async () => {
        render(<TimeZonePicker {...({ ...base, names })} />);
        await flush();
        const text = options().map((o) => o.textContent!.trim());
        expect(text).toContain("UTC+05:30 – Bharat Standard");
        expect(text).toContain("UTC+01:00 – Paris Standard");
        expect(text).toContain("UTC+09:00 – Japan Standard Time");
    });

    test("a daylight pair follows the date", async () => {
        render(<TimeZonePicker {...({ ...base, date: SUMMER, names })} />);
        await flush();
        expect(options().map((o) => o.textContent!.trim())).toContain("UTC+02:00 – Paris Summer");
    });
});

describe("selection and applying", () => {
    test("choosing a zone sets the value, the hidden input, aria-selected and data-time-zone", async () => {
        render(<TimeZonePicker {...({ ...base, defaultValue: "UTC" })} />);
        await flush();
        await pick("Asia/Kolkata");
        expect(hidden().value).toBe("Asia/Kolkata");
        expect(document.documentElement.getAttribute("data-time-zone")).toBe("Asia/Kolkata");
        expect(options()[ORDERED.indexOf("Asia/Kolkata")].getAttribute("aria-selected")).toBe("true");
        expect(options()[ORDERED.indexOf("UTC")].getAttribute("aria-selected")).toBe("false");
    });

    test("choosing closes the list, and aria-expanded follows", async () => {
        render(<TimeZonePicker {...({ ...base, defaultValue: "UTC" })} />);
        await flush();
        await pick("Europe/Paris");
        expect(button().getAttribute("aria-expanded")).toBe("false");
        expect(list().hasAttribute("hidden")).toBe(true);
    });

    test("onChange is called once per change, with the IANA id", async () => {
        const onChange = vi.fn();
        render(<TimeZonePicker {...({ ...base, defaultValue: "UTC", onChange })} />);
        await flush();
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenLastCalledWith("UTC");
        await pick("Asia/Tokyo");
        expect(onChange).toHaveBeenCalledTimes(2);
        expect(onChange).toHaveBeenLastCalledWith("Asia/Tokyo");
    });

    test("choosing the zone already applied does not call onChange again", async () => {
        const onChange = vi.fn();
        render(<TimeZonePicker {...({ ...base, defaultValue: "UTC", onChange })} />);
        await flush();
        await pick("UTC");
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    test("data-time-zone goes onto the target element when one is given", async () => {
        const target = document.createElement("section");
        document.body.append(target);
        render(<TimeZonePicker {...({ ...base, target, defaultValue: "Asia/Tokyo" })} />);
        await flush();
        expect(target.getAttribute("data-time-zone")).toBe("Asia/Tokyo");
        expect(document.documentElement.hasAttribute("data-time-zone")).toBe(false);
        target.remove();
    });
});

describe("initial value", () => {
    test("defaultValue wins when nothing else is supplied", async () => {
        render(<TimeZonePicker {...({ ...base, defaultValue: "Asia/Tokyo" })} />);
        await flush();
        expect(hidden().value).toBe("Asia/Tokyo");
    });

    test("the reader's own zone is used when it is listed", async () => {
        const spy = vi.spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions").mockReturnValue({ timeZone: "Europe/Paris" } as Intl.ResolvedDateTimeFormatOptions);
        render(<TimeZonePicker {...(base)} />);
        await flush();
        spy.mockRestore();
        expect(hidden().value).toBe("Europe/Paris");
    });

    test("a zone that is not listed is matched to its listed twin (same offset and name)", async () => {
        const spy = vi.spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions").mockReturnValue({ timeZone: "Europe/Berlin" } as Intl.ResolvedDateTimeFormatOptions);
        render(<TimeZonePicker {...(base)} />);
        await flush();
        spy.mockRestore();
        expect(hidden().value).toBe("Europe/Paris");
    });

    test("UTC when the reader's zone cannot be placed", async () => {
        const spy = vi.spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions").mockReturnValue({ timeZone: "Nowhere/Land" } as Intl.ResolvedDateTimeFormatOptions);
        render(<TimeZonePicker {...(base)} />);
        await flush();
        spy.mockRestore();
        expect(hidden().value).toBe("UTC");
    });

    test("the first zone when UTC is not offered either", async () => {
        const spy = vi.spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions").mockReturnValue({ timeZone: "Nowhere/Land" } as Intl.ResolvedDateTimeFormatOptions);
        render(<TimeZonePicker {...({ ...base, zones: ["Asia/Tokyo", "America/New_York"] })} />);
        await flush();
        spy.mockRestore();
        expect(hidden().value).toBe("America/New_York");
    });

    test("an empty list leaves the value empty and applies nothing", async () => {
        render(<TimeZonePicker {...({ ...base, zones: [] })} />);
        await flush();
        expect(hidden().value).toBe("");
        expect(document.documentElement.hasAttribute("data-time-zone")).toBe(false);
    });
});

describe("persistence", () => {
    test("the choice is stored under storageKey", async () => {
        render(<TimeZonePicker {...({ ...base, storageKey: "tz", defaultValue: "UTC" })} />);
        await flush();
        await pick("Asia/Tokyo");
        expect(localStorage.getItem("tz")).toBe("Asia/Tokyo");
    });

    test("a stored zone is restored", async () => {
        localStorage.setItem("tz", "Asia/Kolkata");
        render(<TimeZonePicker {...({ ...base, storageKey: "tz", defaultValue: "UTC" })} />);
        await flush();
        expect(hidden().value).toBe("Asia/Kolkata");
    });

    test("a stored zone that is no longer offered is not restored", async () => {
        localStorage.setItem("tz", "Pacific/Auckland");
        render(<TimeZonePicker {...({ ...base, storageKey: "tz", defaultValue: "UTC" })} />);
        await flush();
        expect(hidden().value).toBe("UTC");
    });

    test("nothing is written without a storageKey", async () => {
        render(<TimeZonePicker {...({ ...base, defaultValue: "UTC" })} />);
        await flush();
        await pick("Asia/Tokyo");
        expect(localStorage.length).toBe(0);
    });
});

describe("keyboard (APG listbox)", () => {
    test("ArrowDown on the button opens the list on the selected option", async () => {
        render(<TimeZonePicker {...({ ...base, defaultValue: "Asia/Kolkata" })} />);
        await flush();
        await fireEvent.keyDown(button(), { key: "ArrowDown" });
        expect(button().getAttribute("aria-expanded")).toBe("true");
        await flush();
        expect(list().getAttribute("aria-activedescendant")).toBe(options()[ORDERED.indexOf("Asia/Kolkata")].id);
    });

    test("ArrowUp on the button opens the list on the last option", async () => {
        render(<TimeZonePicker {...({ ...base, defaultValue: "UTC" })} />);
        await flush();
        await fireEvent.keyDown(button(), { key: "ArrowUp" });
        await flush();
        expect(list().getAttribute("aria-activedescendant")).toBe(options()[options().length - 1].id);
    });

    test("Enter and Space open it too", async () => {
        render(<TimeZonePicker {...(base)} />);
        await flush();
        await fireEvent.keyDown(button(), { key: "Enter" });
        expect(button().getAttribute("aria-expanded")).toBe("true");
    });

    test("arrows clamp, Home and End jump, Enter selects and closes", async () => {
        render(<TimeZonePicker {...({ ...base, defaultValue: "UTC" })} />);
        await flush();
        await fireEvent.keyDown(button(), { key: "ArrowDown" });
        await flush();
        await fireEvent.keyDown(list(), { key: "End" });
        await fireEvent.keyDown(list(), { key: "ArrowDown" });
        expect(list().getAttribute("aria-activedescendant")).toBe(options()[options().length - 1].id);
        await fireEvent.keyDown(list(), { key: "Home" });
        expect(list().getAttribute("aria-activedescendant")).toBe(options()[0].id);
        await fireEvent.keyDown(list(), { key: "Enter" });
        await flush();
        expect(hidden().value).toBe("America/New_York");
        expect(button().getAttribute("aria-expanded")).toBe("false");
    });

    test("typing an offset jumps to it", async () => {
        render(<TimeZonePicker {...({ ...base, defaultValue: "UTC" })} />);
        await flush();
        await fireEvent.keyDown(button(), { key: "ArrowDown" });
        await flush();
        for (const ch of "UTC+05") await fireEvent.keyDown(list(), { key: ch });
        expect(list().getAttribute("aria-activedescendant")).toBe(options()[ORDERED.indexOf("Asia/Kolkata")].id);
    });

    test("Escape closes without changing the value", async () => {
        render(<TimeZonePicker {...({ ...base, defaultValue: "UTC" })} />);
        await flush();
        await fireEvent.keyDown(button(), { key: "ArrowDown" });
        await flush();
        await fireEvent.keyDown(list(), { key: "ArrowDown" });
        await fireEvent.keyDown(list(), { key: "Escape" });
        expect(button().getAttribute("aria-expanded")).toBe("false");
        expect(hidden().value).toBe("UTC");
    });
});

describe("open state, disabled, tooltip", () => {
    test("onOpenChange reports opening and closing, once each", async () => {
        const onOpenChange = vi.fn();
        render(<TimeZonePicker {...({ ...base, onOpenChange })} />);
        await flush();
        await fireEvent.click(button());
        await fireEvent.click(button());
        expect(onOpenChange.mock.calls.map((c) => c[0])).toEqual([true, false]);
    });

    test("a disabled picker cannot be opened", async () => {
        render(<TimeZonePicker {...({ ...base, disabled: true })} />);
        expect((button() as HTMLButtonElement).disabled).toBe(true);
        await fireEvent.click(button());
        expect(button().getAttribute("aria-expanded")).toBe("false");
    });

    test("the tooltip shows on hover and Escape dismisses it", async () => {
        render(<TimeZonePicker {...(base)} />);
        const tip = document.querySelector(".time-zone-picker-tooltip") as HTMLElement;
        expect(tip.hasAttribute("hidden")).toBe(true);
        await fireEvent.mouseEnter(button());
        expect(tip.hasAttribute("hidden")).toBe(false);
        expect(tip.getAttribute("role")).toBe("tooltip");
        await fireEvent.keyDown(document, { key: "Escape" });
        expect(tip.hasAttribute("hidden")).toBe(true);
    });

    test("the tooltip is not wired with aria-describedby (the name would be announced twice)", () => {
        render(<TimeZonePicker {...(base)} />);
        expect(button().hasAttribute("aria-describedby")).toBe(false);
    });

    test("a custom children render prop replaces the icon", () => {
        render(<TimeZonePicker {...base} children={() => <span data-testid="glyph">🕒</span>} />);
        expect(screen.getByTestId("glyph")).toBeTruthy();
        expect(document.querySelector(".time-zone-picker-icon")).toBeNull();
    });

});
