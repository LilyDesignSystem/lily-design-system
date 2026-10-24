import { mount, type VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { nextTick } from "vue";

import TimeZonePicker, { DEFAULT_ZONES } from "./TimeZonePicker.vue";

// A fixed date, so offsets and names do not depend on the day the tests run: January, standard time in the north.
const WINTER = new Date(Date.UTC(2026, 0, 15, 12, 0, 0));
const SUMMER = new Date(Date.UTC(2026, 6, 15, 12, 0, 0));
const ZONES = ["Asia/Tokyo", "America/New_York", "Europe/Paris", "UTC", "Asia/Kolkata"];
// ...and the order the picker must show them in: west to east.
const ORDERED = ["America/New_York", "UTC", "Europe/Paris", "Asia/Kolkata", "Asia/Tokyo"];

async function flush(): Promise<void> {
    await nextTick();
    await new Promise((r) => setTimeout(r, 0));
    await nextTick();
}

const wrappers: VueWrapper<any>[] = [];

function build(props: Record<string, unknown> = {}, options: Record<string, unknown> = {}) {
    const wrapper = mount(TimeZonePicker, {
        props: { label: "Time zone", locale: "en", zones: ZONES, date: WINTER, ...props },
        attachTo: document.body,
        ...options,
    });
    wrappers.push(wrapper);
    return wrapper;
}

const parts = (w: VueWrapper<any>) => ({
    button: w.find("button.time-zone-picker-button"),
    list: w.find("ul.time-zone-picker-list"),
    options: w.findAll("li.time-zone-picker-option"),
    hidden: w.find('input[type="hidden"]'),
    tip: w.find(".time-zone-picker-tooltip"),
});

async function pick(w: VueWrapper<any>, zone: string): Promise<void> {
    const { button, options } = parts(w);
    await button.trigger("click");
    await options[ORDERED.indexOf(zone)].trigger("click");
    await flush();
}

const hiddenValue = (w: VueWrapper<any>) => (parts(w).hidden.element as HTMLInputElement).value;

beforeEach(() => {
    document.documentElement.removeAttribute("data-time-zone");
    try {
        localStorage.clear();
    } catch {
        /* ignore */
    }
});

afterEach(() => {
    while (wrappers.length) wrappers.pop()!.unmount();
    document.body.innerHTML = "";
    document.documentElement.removeAttribute("data-time-zone");
});

describe("markup contract", () => {
    test("a button that controls a listbox", async () => {
        const w = build();
        await flush();
        const { button, list } = parts(w);
        expect(button.element.tagName).toBe("BUTTON");
        expect(button.attributes("type")).toBe("button");
        expect(button.attributes("aria-haspopup")).toBe("listbox");
        expect(button.attributes("aria-expanded")).toBe("false");
        expect(button.attributes("aria-controls")).toBe(list.attributes("id"));
        expect(list.attributes("role")).toBe("listbox");
    });

    test("the root carries the base class and the consumer's class", () => {
        const w = build({ class: "mine" });
        expect(w.classes()).toEqual(["time-zone-picker", "mine"]);
    });

    test("the icon is a bundled SVG, hidden from assistive technology", () => {
        const icon = build().find("svg.time-zone-picker-icon");
        expect(icon.attributes("aria-hidden")).toBe("true");
        expect(icon.find("path").exists()).toBe(true);
    });

    test("the label names the button and the listbox, and is the tooltip text", () => {
        const w = build({ label: "Choose a time zone" });
        const { button, list, tip } = parts(w);
        expect(button.attributes("aria-label")).toBe("Choose a time zone");
        expect(list.attributes("aria-label")).toBe("Choose a time zone");
        expect(tip.text()).toBe("Choose a time zone");
        expect(tip.attributes("role")).toBe("tooltip");
        expect(button.attributes("aria-describedby")).toBeUndefined();
    });

    test("one option per zone, each an option with aria-selected", async () => {
        const w = build();
        await flush();
        const { options } = parts(w);
        expect(options.length).toBe(ZONES.length);
        for (const o of options) {
            expect(o.attributes("role")).toBe("option");
            expect(o.attributes("aria-selected")).toMatch(/true|false/);
        }
    });

    test("the hidden input carries the name and the IANA id", async () => {
        const w = build({ name: "tz", defaultValue: "Asia/Tokyo" });
        await flush();
        expect(parts(w).hidden.attributes("name")).toBe("tz");
        expect(hiddenValue(w)).toBe("Asia/Tokyo");
    });

    test("the hidden input is named time-zone by default", () => {
        expect(parts(build()).hidden.attributes("name")).toBe("time-zone");
    });

    test("the list is hidden until opened", () => {
        expect(parts(build()).list.attributes("hidden")).toBeDefined();
    });
});

describe("options: offsets and full names, ordered by offset", () => {
    test("ordered west to east, whatever order the zones were given", async () => {
        const w = build();
        await flush();
        expect(parts(w).options.map((o) => o.text().slice(0, 9))).toEqual(["UTC-05:00", "UTC+00:00", "UTC+01:00", "UTC+05:30", "UTC+09:00"]);
    });

    test("each option shows its offset and its full name", async () => {
        const w = build();
        await flush();
        const text = parts(w).options.map((o) => o.text());
        expect(text).toContain("UTC-05:00 – Eastern Standard Time");
        expect(text).toContain("UTC+01:00 – Central European Standard Time");
        expect(text).toContain("UTC+05:30 – India Standard Time");
        expect(text).toContain("UTC+09:00 – Japan Standard Time");
        expect(parts(w).options[3].attributes("data-offset")).toBe("UTC+05:30");
    });

    test("the names are in the locale it is given", async () => {
        const w = build({ locale: "fr", zones: ["Europe/Paris"] });
        await flush();
        expect(parts(w).options[0].text()).toMatch(/UTC\+01:00 – .*Europe centrale/);
    });

    test("the date decides the offsets: summer time shows the summer offset", async () => {
        const w = build({ date: SUMMER, zones: ["Europe/Paris", "America/New_York"] });
        await flush();
        const text = parts(w).options.map((o) => o.text());
        expect(text[0]).toBe("UTC-04:00 – Eastern Daylight Time");
        expect(text[1]).toBe("UTC+02:00 – Central European Summer Time");
    });

    test("labelFor builds the text", async () => {
        const w = build({ labelFor: (z: { name: string; offset: string }) => `${z.name} [${z.offset}]` });
        await flush();
        expect(parts(w).options.map((o) => o.text())).toContain("India Standard Time [UTC+05:30]");
    });

    test("an unknown zone is left out, not shown unnamed", async () => {
        const w = build({ zones: ["UTC", "Nowhere/Land"] });
        await flush();
        expect(parts(w).options.length).toBe(1);
    });

    test("the default list is offered when no zones are given, ordered by offset", async () => {
        const w = mount(TimeZonePicker, { props: { label: "Time zone", locale: "en", date: WINTER }, attachTo: document.body });
        wrappers.push(w);
        await flush();
        const offsets = parts(w).options.map((o) => o.attributes("data-offset")!);
        expect(offsets.length).toBe(DEFAULT_ZONES.length);
        const minutes = offsets.map((t) => (t[3] === "-" ? -1 : 1) * (Number(t.slice(4, 6)) * 60 + Number(t.slice(7, 9))));
        expect(minutes).toEqual([...minutes].sort((a, b) => a - b));
    });
});

describe("selection and applying", () => {
    test("choosing a zone sets the value, the hidden input, aria-selected and data-time-zone, and closes", async () => {
        const w = build({ defaultValue: "UTC" });
        await flush();
        await pick(w, "Asia/Kolkata");
        expect(hiddenValue(w)).toBe("Asia/Kolkata");
        expect(document.documentElement.getAttribute("data-time-zone")).toBe("Asia/Kolkata");
        const { options, button, list } = parts(w);
        expect(options[ORDERED.indexOf("Asia/Kolkata")].attributes("aria-selected")).toBe("true");
        expect(options[ORDERED.indexOf("UTC")].attributes("aria-selected")).toBe("false");
        expect(button.attributes("aria-expanded")).toBe("false");
        expect(list.attributes("hidden")).toBeDefined();
    });

    test("a change event is emitted once per change, with the IANA id", async () => {
        const w = build({ defaultValue: "UTC" });
        await flush();
        expect(w.emitted("change")).toEqual([["UTC"]]);
        await pick(w, "Asia/Tokyo");
        expect(w.emitted("change")).toEqual([["UTC"], ["Asia/Tokyo"]]);
        await pick(w, "Asia/Tokyo");
        expect(w.emitted("change")!.length).toBe(2);
    });

    test("data-time-zone goes onto the target element when one is given", async () => {
        const target = document.createElement("section");
        document.body.append(target);
        build({ target, defaultValue: "Asia/Tokyo" });
        await flush();
        expect(target.getAttribute("data-time-zone")).toBe("Asia/Tokyo");
        expect(document.documentElement.hasAttribute("data-time-zone")).toBe(false);
    });

    test("v-model:value is driven from outside", async () => {
        const w = build({ value: "Asia/Tokyo" });
        await flush();
        expect(hiddenValue(w)).toBe("Asia/Tokyo");
        await w.setProps({ value: "UTC" });
        expect(hiddenValue(w)).toBe("UTC");
    });
});

describe("initial value", () => {
    const system = (zone: string) =>
        vi.spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions").mockReturnValue({ timeZone: zone } as Intl.ResolvedDateTimeFormatOptions);

    test("defaultValue wins when nothing else is supplied", async () => {
        const w = build({ defaultValue: "Asia/Tokyo" });
        await flush();
        expect(hiddenValue(w)).toBe("Asia/Tokyo");
    });

    test.each([
        ["Europe/Paris", "the reader's own zone when it is listed", "Europe/Paris"],
        ["Europe/Berlin", "its listed twin when it is not", "Europe/Paris"],
        ["Nowhere/Land", "UTC when it cannot be placed", "UTC"],
    ])("system zone %s: %s", async (sys, _why, expected) => {
        const spy = system(sys);
        const w = build();
        await flush();
        spy.mockRestore();
        expect(hiddenValue(w)).toBe(expected);
    });

    test("the first zone when UTC is not offered either", async () => {
        const spy = system("Nowhere/Land");
        const w = build({ zones: ["Asia/Tokyo", "America/New_York"] });
        await flush();
        spy.mockRestore();
        expect(hiddenValue(w)).toBe("America/New_York");
    });

    test("an empty list leaves the value empty and applies nothing", async () => {
        const w = build({ zones: [] });
        await flush();
        expect(hiddenValue(w)).toBe("");
        expect(document.documentElement.hasAttribute("data-time-zone")).toBe(false);
    });
});

describe("persistence", () => {
    test("the choice is stored under storageKey, and restored", async () => {
        const w = build({ storageKey: "tz", defaultValue: "UTC" });
        await flush();
        await pick(w, "Asia/Tokyo");
        expect(localStorage.getItem("tz")).toBe("Asia/Tokyo");
        const again = build({ storageKey: "tz", defaultValue: "UTC" });
        await flush();
        expect(hiddenValue(again)).toBe("Asia/Tokyo");
    });

    test("a stored zone that is no longer offered is not restored", async () => {
        localStorage.setItem("tz", "Pacific/Auckland");
        const w = build({ storageKey: "tz", defaultValue: "UTC" });
        await flush();
        expect(hiddenValue(w)).toBe("UTC");
    });

    test("nothing is written without a storageKey", async () => {
        const w = build({ defaultValue: "UTC" });
        await flush();
        await pick(w, "Asia/Tokyo");
        expect(localStorage.length).toBe(0);
    });
});

describe("keyboard (APG listbox)", () => {
    const activeId = (w: VueWrapper<any>) => parts(w).list.attributes("aria-activedescendant");

    test("ArrowDown on the button opens the list on the selected option", async () => {
        const w = build({ defaultValue: "Asia/Kolkata" });
        await flush();
        await parts(w).button.trigger("keydown", { key: "ArrowDown" });
        await flush();
        expect(parts(w).button.attributes("aria-expanded")).toBe("true");
        expect(activeId(w)).toBe(parts(w).options[ORDERED.indexOf("Asia/Kolkata")].attributes("id"));
    });

    test("ArrowUp on the button opens the list on the last option", async () => {
        const w = build({ defaultValue: "UTC" });
        await flush();
        await parts(w).button.trigger("keydown", { key: "ArrowUp" });
        await flush();
        expect(activeId(w)).toBe(parts(w).options[ORDERED.length - 1].attributes("id"));
    });

    test("Enter opens it too", async () => {
        const w = build();
        await flush();
        await parts(w).button.trigger("keydown", { key: "Enter" });
        expect(parts(w).button.attributes("aria-expanded")).toBe("true");
    });

    test("arrows clamp, Home and End jump, Enter selects and closes", async () => {
        const w = build({ defaultValue: "UTC" });
        await flush();
        await parts(w).button.trigger("keydown", { key: "ArrowDown" });
        await flush();
        const { list, options } = parts(w);
        await list.trigger("keydown", { key: "End" });
        await list.trigger("keydown", { key: "ArrowDown" });
        expect(activeId(w)).toBe(options[options.length - 1].attributes("id"));
        await list.trigger("keydown", { key: "Home" });
        expect(activeId(w)).toBe(options[0].attributes("id"));
        await list.trigger("keydown", { key: "Enter" });
        await flush();
        expect(hiddenValue(w)).toBe("America/New_York");
        expect(parts(w).button.attributes("aria-expanded")).toBe("false");
    });

    test("typing an offset jumps to it", async () => {
        const w = build({ defaultValue: "UTC" });
        await flush();
        await parts(w).button.trigger("keydown", { key: "ArrowDown" });
        await flush();
        for (const ch of "UTC+05") await parts(w).list.trigger("keydown", { key: ch });
        expect(activeId(w)).toBe(parts(w).options[ORDERED.indexOf("Asia/Kolkata")].attributes("id"));
    });

    test("Escape closes without changing the value", async () => {
        const w = build({ defaultValue: "UTC" });
        await flush();
        await parts(w).button.trigger("keydown", { key: "ArrowDown" });
        await flush();
        await parts(w).list.trigger("keydown", { key: "ArrowDown" });
        await parts(w).list.trigger("keydown", { key: "Escape" });
        await flush();
        expect(parts(w).button.attributes("aria-expanded")).toBe("false");
        expect(hiddenValue(w)).toBe("UTC");
    });
});

describe("open state, disabled, tooltip, slot", () => {
    test("v-model:open reports opening and closing", async () => {
        const w = build();
        await flush();
        await parts(w).button.trigger("click");
        await parts(w).button.trigger("click");
        await flush();
        expect(w.emitted("update:open")!.map((c) => c[0])).toEqual([true, false]);
    });

    test("a disabled picker cannot be opened", async () => {
        const w = build({ disabled: true });
        expect((parts(w).button.element as HTMLButtonElement).disabled).toBe(true);
        await parts(w).button.trigger("click");
        expect(parts(w).button.attributes("aria-expanded")).toBe("false");
    });

    test("the tooltip shows on hover and Escape dismisses it", async () => {
        const w = build();
        expect(parts(w).tip.attributes("hidden")).toBeDefined();
        await parts(w).button.trigger("mouseenter");
        expect(parts(w).tip.attributes("hidden")).toBeUndefined();
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
        await nextTick();
        expect(parts(w).tip.attributes("hidden")).toBeDefined();
    });

    test("a default slot replaces the icon and receives infoFor", async () => {
        const w = build({ defaultValue: "Asia/Kolkata" }, { slots: { default: `<template #default="{ infoFor, value }"><span data-testid="glyph">{{ infoFor(value)?.offset }}</span></template>` } });
        await flush();
        expect(w.find('[data-testid="glyph"]').text()).toBe("UTC+05:30");
        expect(w.find(".time-zone-picker-icon").exists()).toBe(false);
    });
});
