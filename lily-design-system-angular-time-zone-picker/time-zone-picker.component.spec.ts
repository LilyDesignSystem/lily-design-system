import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import {
  DEFAULT_ZONES,
  TimeZonePicker,
  TimeZonePickerIcon,
  nextTimeZonePickerId,
} from "./time-zone-picker.component";

// A fixed date, so offsets and names do not depend on the day the tests run: January, standard time in the north.
const WINTER = new Date(Date.UTC(2026, 0, 15, 12, 0, 0));
const SUMMER = new Date(Date.UTC(2026, 6, 15, 12, 0, 0));
const ZONES = ["Asia/Tokyo", "America/New_York", "Europe/Paris", "UTC", "Asia/Kolkata"];
// ...and the order the picker must show them in: west to east.
const ORDERED = ["America/New_York", "UTC", "Europe/Paris", "Asia/Kolkata", "Asia/Tokyo"];

const flush = (): Promise<void> => new Promise((r) => setTimeout(r, 0));
const resetRoot = (): void => document.documentElement.removeAttribute("data-time-zone");

let fixtures: ComponentFixture<unknown>[] = [];

function mount(inputs: Record<string, unknown> = {}): ComponentFixture<TimeZonePicker> {
  const fixture = TestBed.createComponent(TimeZonePicker);
  const all: Record<string, unknown> = { label: "Time zone", locale: "en", zones: ZONES, date: WINTER, ...inputs };
  for (const [key, value] of Object.entries(all)) fixture.componentRef.setInput(key, value);
  fixture.detectChanges();
  fixtures.push(fixture);
  return fixture;
}

async function mountSettled(inputs: Record<string, unknown> = {}): Promise<ComponentFixture<TimeZonePicker>> {
  const fixture = mount(inputs);
  await flush();
  fixture.detectChanges();
  return fixture;
}

const q = <T extends Element>(f: ComponentFixture<unknown>, sel: string): T => f.nativeElement.querySelector(sel) as T;
const button = (f: ComponentFixture<unknown>) => q<HTMLButtonElement>(f, ".time-zone-picker-button");
const list = (f: ComponentFixture<unknown>) => q<HTMLUListElement>(f, ".time-zone-picker-list");
const hidden = (f: ComponentFixture<unknown>) => q<HTMLInputElement>(f, 'input[type="hidden"]');
const tip = (f: ComponentFixture<unknown>) => q<HTMLElement>(f, ".time-zone-picker-tooltip");
const options = (f: ComponentFixture<unknown>) =>
  Array.from(f.nativeElement.querySelectorAll(".time-zone-picker-option")) as HTMLLIElement[];

function press(f: ComponentFixture<unknown>, target: HTMLElement, key: string): void {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
  f.detectChanges();
}

function click(f: ComponentFixture<unknown>, target: HTMLElement): void {
  target.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  f.detectChanges();
}

async function pick(f: ComponentFixture<unknown>, zone: string): Promise<void> {
  click(f, button(f));
  click(f, options(f)[ORDERED.indexOf(zone)]);
  await flush();
  f.detectChanges();
}

beforeEach(() => {
  resetRoot();
  try {
    localStorage.clear();
  } catch {
    /* ignore */
  }
});

afterEach(() => {
  for (const fixture of fixtures) fixture.destroy();
  fixtures = [];
  resetRoot();
});

describe("markup contract", () => {
  test("a button that controls a listbox", () => {
    const f = mount();
    const btn = button(f);
    expect(btn.tagName).toBe("BUTTON");
    expect(btn.getAttribute("type")).toBe("button");
    expect(btn.getAttribute("aria-haspopup")).toBe("listbox");
    expect(btn.getAttribute("aria-expanded")).toBe("false");
    expect(list(f).id).toBe(btn.getAttribute("aria-controls"));
    expect(list(f).getAttribute("role")).toBe("listbox");
  });

  test("the root carries the base class and the consumer's class", () => {
    const root = q<HTMLElement>(mount({ className: "extra" }), ".time-zone-picker");
    expect(root.tagName).toBe("DIV");
    expect(root.classList.contains("time-zone-picker")).toBe(true);
    expect(root.classList.contains("extra")).toBe(true);
  });

  test("the icon is a bundled SVG, hidden from assistive technology", () => {
    const icon = q<SVGElement>(mount(), ".time-zone-picker-icon");
    expect(icon.tagName.toLowerCase()).toBe("svg");
    expect(icon.getAttribute("aria-hidden")).toBe("true");
    expect(icon.querySelector("path")).toBeTruthy();
  });

  test("the label names the button and the listbox, and is the tooltip text", () => {
    const f = mount({ label: "Choose a time zone" });
    expect(button(f).getAttribute("aria-label")).toBe("Choose a time zone");
    expect(list(f).getAttribute("aria-label")).toBe("Choose a time zone");
    expect(tip(f).textContent?.trim()).toBe("Choose a time zone");
    expect(tip(f).getAttribute("role")).toBe("tooltip");
    expect(button(f).hasAttribute("aria-describedby")).toBe(false);
  });

  test("one option per zone, each an option with aria-selected", async () => {
    const f = await mountSettled();
    expect(options(f).length).toBe(ZONES.length);
    for (const o of options(f)) {
      expect(o.getAttribute("role")).toBe("option");
      expect(o.getAttribute("aria-selected")).toMatch(/true|false/);
    }
  });

  test("the hidden input carries the name and the IANA id", async () => {
    const f = await mountSettled({ name: "tz", defaultValue: "Asia/Tokyo" });
    expect(hidden(f).name).toBe("tz");
    expect(hidden(f).value).toBe("Asia/Tokyo");
  });

  test("the hidden input is named time-zone by default", () => {
    expect(hidden(mount()).name).toBe("time-zone");
  });

  test("the list is hidden until opened", () => {
    expect(list(mount()).hasAttribute("hidden")).toBe(true);
  });
});

describe("options: offsets and full names, ordered by offset", () => {
  test("ordered west to east, whatever order the zones were given", async () => {
    const f = await mountSettled();
    expect(options(f).map((o) => o.textContent!.trim().slice(0, 9))).toEqual(["UTC-05:00", "UTC+00:00", "UTC+01:00", "UTC+05:30", "UTC+09:00"]);
  });

  test("each option shows its offset and its full name", async () => {
    const f = await mountSettled();
    const text = options(f).map((o) => o.textContent!.trim());
    expect(text).toContain("UTC-05:00 – Eastern Standard Time");
    expect(text).toContain("UTC+01:00 – Central European Standard Time");
    expect(text).toContain("UTC+05:30 – India Standard Time");
    expect(text).toContain("UTC+09:00 – Japan Standard Time");
    expect(options(f)[3].getAttribute("data-offset")).toBe("UTC+05:30");
  });

  test("the names are in the locale it is given", async () => {
    const f = await mountSettled({ locale: "fr", zones: ["Europe/Paris"] });
    expect(options(f)[0].textContent).toMatch(/UTC\+01:00 – .*Europe centrale/);
  });

  test("the date decides the offsets: summer time shows the summer offset", async () => {
    const f = await mountSettled({ date: SUMMER, zones: ["Europe/Paris", "America/New_York"] });
    const text = options(f).map((o) => o.textContent!.trim());
    expect(text[0]).toBe("UTC-04:00 – Eastern Daylight Time");
    expect(text[1]).toBe("UTC+02:00 – Central European Summer Time");
  });

  test("labelFor builds the text", async () => {
    const f = await mountSettled({ labelFor: (z: { name: string; offset: string }) => `${z.name} [${z.offset}]` });
    expect(options(f).map((o) => o.textContent!.trim())).toContain("India Standard Time [UTC+05:30]");
  });

  test("an unknown zone is left out, not shown unnamed", async () => {
    const f = await mountSettled({ zones: ["UTC", "Nowhere/Land"] });
    expect(options(f).length).toBe(1);
  });

  test("the default list is offered when no zones are given, ordered by offset", async () => {
    const fixture = TestBed.createComponent(TimeZonePicker);
    fixture.componentRef.setInput("label", "Time zone");
    fixture.componentRef.setInput("locale", "en");
    fixture.componentRef.setInput("date", WINTER);
    fixture.detectChanges();
    fixtures.push(fixture);
    await flush();
    fixture.detectChanges();
    const offsets = options(fixture).map((o) => o.getAttribute("data-offset")!);
    expect(offsets.length).toBe(DEFAULT_ZONES.length);
    const minutes = offsets.map((t) => (t[3] === "-" ? -1 : 1) * (Number(t.slice(4, 6)) * 60 + Number(t.slice(7, 9))));
    expect(minutes).toEqual([...minutes].sort((a, b) => a - b));
  });
});

describe("selection and applying", () => {
  test("choosing a zone sets the value, the hidden input, aria-selected and data-time-zone, and closes", async () => {
    const f = await mountSettled({ defaultValue: "UTC" });
    await pick(f, "Asia/Kolkata");
    expect(hidden(f).value).toBe("Asia/Kolkata");
    expect(document.documentElement.getAttribute("data-time-zone")).toBe("Asia/Kolkata");
    expect(options(f)[ORDERED.indexOf("Asia/Kolkata")].getAttribute("aria-selected")).toBe("true");
    expect(options(f)[ORDERED.indexOf("UTC")].getAttribute("aria-selected")).toBe("false");
    expect(button(f).getAttribute("aria-expanded")).toBe("false");
    expect(list(f).hasAttribute("hidden")).toBe(true);
  });

  test("zoneChange fires once per change, with the IANA id, and not for an unchanged zone", async () => {
    const f = await mountSettled({ defaultValue: "UTC" });
    const spy = vi.fn();
    f.componentInstance.zoneChange.subscribe(spy);
    await pick(f, "Asia/Tokyo");
    expect(spy.mock.calls.map((c) => c[0])).toEqual(["Asia/Tokyo"]);
    await pick(f, "Asia/Tokyo");
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test("data-time-zone goes onto the target element when one is given", async () => {
    const target = document.createElement("section");
    document.body.append(target);
    await mountSettled({ target, defaultValue: "Asia/Tokyo" });
    expect(target.getAttribute("data-time-zone")).toBe("Asia/Tokyo");
    expect(document.documentElement.hasAttribute("data-time-zone")).toBe(false);
    target.remove();
  });
});

describe("initial value", () => {
  const system = (zone: string) =>
    vi.spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions").mockReturnValue({ timeZone: zone } as Intl.ResolvedDateTimeFormatOptions);

  test("defaultValue wins when nothing else is supplied", async () => {
    expect(hidden(await mountSettled({ defaultValue: "Asia/Tokyo" })).value).toBe("Asia/Tokyo");
  });

  test.each([
    ["Europe/Paris", "Europe/Paris"],
    ["Europe/Berlin", "Europe/Paris"],
    ["Nowhere/Land", "UTC"],
  ])("system zone %s resolves to %s (own zone, listed twin, UTC)", async (sys, expected) => {
    const spy = system(sys);
    const f = await mountSettled();
    spy.mockRestore();
    expect(hidden(f).value).toBe(expected);
  });

  test("the first zone when UTC is not offered either", async () => {
    const spy = system("Nowhere/Land");
    const f = await mountSettled({ zones: ["Asia/Tokyo", "America/New_York"] });
    spy.mockRestore();
    expect(hidden(f).value).toBe("America/New_York");
  });

  test("an empty list leaves the value empty and applies nothing", async () => {
    const f = await mountSettled({ zones: [] });
    expect(hidden(f).value).toBe("");
    expect(document.documentElement.hasAttribute("data-time-zone")).toBe(false);
  });
});

describe("persistence", () => {
  test("the choice is stored under storageKey, and restored", async () => {
    const f = await mountSettled({ storageKey: "tz", defaultValue: "UTC" });
    await pick(f, "Asia/Tokyo");
    expect(localStorage.getItem("tz")).toBe("Asia/Tokyo");
    expect(hidden(await mountSettled({ storageKey: "tz", defaultValue: "UTC" })).value).toBe("Asia/Tokyo");
  });

  test("a stored zone that is no longer offered is not restored", async () => {
    localStorage.setItem("tz", "Pacific/Auckland");
    expect(hidden(await mountSettled({ storageKey: "tz", defaultValue: "UTC" })).value).toBe("UTC");
  });

  test("nothing is written without a storageKey", async () => {
    const f = await mountSettled({ defaultValue: "UTC" });
    await pick(f, "Asia/Tokyo");
    expect(localStorage.length).toBe(0);
  });
});

describe("keyboard (APG listbox)", () => {
  const active = (f: ComponentFixture<unknown>) => list(f).getAttribute("aria-activedescendant");

  test("ArrowDown on the button opens the list on the selected option", async () => {
    const f = await mountSettled({ defaultValue: "Asia/Kolkata" });
    press(f, button(f), "ArrowDown");
    await flush();
    f.detectChanges();
    expect(button(f).getAttribute("aria-expanded")).toBe("true");
    expect(active(f)).toBe(options(f)[ORDERED.indexOf("Asia/Kolkata")].id);
  });

  test("ArrowUp on the button opens the list on the last option", async () => {
    const f = await mountSettled({ defaultValue: "UTC" });
    press(f, button(f), "ArrowUp");
    await flush();
    f.detectChanges();
    expect(active(f)).toBe(options(f)[ORDERED.length - 1].id);
  });

  test("arrows clamp, Home and End jump, Enter selects and closes", async () => {
    const f = await mountSettled({ defaultValue: "UTC" });
    press(f, button(f), "ArrowDown");
    await flush();
    f.detectChanges();
    press(f, list(f), "End");
    press(f, list(f), "ArrowDown");
    expect(active(f)).toBe(options(f)[ORDERED.length - 1].id);
    press(f, list(f), "Home");
    expect(active(f)).toBe(options(f)[0].id);
    press(f, list(f), "Enter");
    await flush();
    f.detectChanges();
    expect(hidden(f).value).toBe("America/New_York");
    expect(button(f).getAttribute("aria-expanded")).toBe("false");
  });

  test("typing an offset jumps to it", async () => {
    const f = await mountSettled({ defaultValue: "UTC" });
    press(f, button(f), "ArrowDown");
    await flush();
    f.detectChanges();
    for (const ch of "UTC+05") press(f, list(f), ch);
    expect(active(f)).toBe(options(f)[ORDERED.indexOf("Asia/Kolkata")].id);
  });

  test("Escape closes without changing the value", async () => {
    const f = await mountSettled({ defaultValue: "UTC" });
    press(f, button(f), "ArrowDown");
    await flush();
    f.detectChanges();
    press(f, list(f), "ArrowDown");
    press(f, list(f), "Escape");
    await flush();
    f.detectChanges();
    expect(button(f).getAttribute("aria-expanded")).toBe("false");
    expect(hidden(f).value).toBe("UTC");
  });
});

describe("open state, disabled, tooltip, icon template", () => {
  test("the open model reports opening and closing", async () => {
    const f = await mountSettled();
    const spy = vi.fn();
    f.componentInstance.open.subscribe(spy);
    click(f, button(f));
    click(f, button(f));
    await flush();
    expect(spy.mock.calls.map((c) => c[0])).toEqual([true, false]);
  });

  test("a disabled picker cannot be opened", async () => {
    const f = await mountSettled({ disabled: true });
    expect(button(f).disabled).toBe(true);
    click(f, button(f));
    expect(button(f).getAttribute("aria-expanded")).toBe("false");
  });

  test("the tooltip shows on hover and Escape dismisses it", async () => {
    const f = await mountSettled();
    expect(tip(f).hasAttribute("hidden")).toBe(true);
    button(f).closest("lily-icon-button")!.dispatchEvent(new MouseEvent("mouseenter"));
    f.detectChanges();
    await flush();
    f.detectChanges();
    expect(tip(f).hasAttribute("hidden")).toBe(false);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    f.detectChanges();
    expect(tip(f).hasAttribute("hidden")).toBe(true);
  });

  test("a projected template replaces the icon and receives infoFor", async () => {
    @Component({
      standalone: true,
      imports: [TimeZonePicker, TimeZonePickerIcon],
      template: `<lily-time-zone-picker label="Time zone" locale="en" [zones]="zones" [date]="date" defaultValue="Asia/Kolkata">
        <ng-template lilyTimeZonePickerIcon let-args><span data-testid="glyph">{{ args.infoFor(args.value)?.offset }}</span></ng-template>
      </lily-time-zone-picker>`,
    })
    class Host {
      zones = ZONES;
      date = WINTER;
    }
    const f = TestBed.createComponent(Host);
    fixtures.push(f);
    f.detectChanges();
    await flush();
    f.detectChanges();
    expect(q<HTMLElement>(f, '[data-testid="glyph"]').textContent).toBe("UTC+05:30");
    expect(q(f, ".time-zone-picker-icon")).toBeNull();
  });

  test("ids are unique per picker", () => {
    expect(nextTimeZonePickerId()).not.toBe(nextTimeZonePickerId());
  });
});
