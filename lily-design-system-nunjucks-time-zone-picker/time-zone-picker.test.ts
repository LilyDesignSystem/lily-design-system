// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import nunjucks from "nunjucks";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import { DEFAULT_ZONES, autoInit, initTimeZonePicker, timeZoneOptions } from "./time-zone-picker.client.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = nunjucks.configure(__dirname, { autoescape: true, throwOnUndefined: false, trimBlocks: true, lstripBlocks: true });

// A fixed date, so offsets and names do not depend on the day the tests run: January, standard time in the north.
const WINTER = new Date(Date.UTC(2026, 0, 15, 12, 0, 0));
const SUMMER = new Date(Date.UTC(2026, 6, 15, 12, 0, 0));
const ZONES = ["Asia/Tokyo", "America/New_York", "Europe/Paris", "UTC", "Asia/Kolkata"];
// ...and the order the picker must show them in: west to east.
const ORDERED = ["America/New_York", "UTC", "Europe/Paris", "Asia/Kolkata", "Asia/Tokyo"];

const options = (over: Record<string, unknown> = {}) => timeZoneOptions({ locale: "en", zones: ZONES, date: WINTER, ...over });

function renderMacro(opts: Record<string, unknown>): string {
  const src = `{% from "./time-zone-picker.njk" import timeZonePicker %}{{ timeZonePicker(opts) }}`;
  return env.renderString(src, { opts: { label: "Time zone", locale: "en", options: options(), date: WINTER.toISOString(), ...opts } });
}

function renderWithCaller(opts: Record<string, unknown>, body: string): string {
  const src = `{% from "./time-zone-picker.njk" import timeZonePicker %}{% call timeZonePicker(opts) %}${body}{% endcall %}`;
  return env.renderString(src, { opts: { label: "Time zone", locale: "en", options: options(), ...opts } });
}

function mountIntoBody(html: string): HTMLElement {
  document.body.innerHTML = html;
  return document.body.querySelector("[data-lily-time-zone-picker-root]") as HTMLElement;
}

const qa = (sel: string) => [...document.body.querySelectorAll<HTMLElement>(sel)];
const button = () => document.body.querySelector<HTMLButtonElement>(".time-zone-picker-button")!;
const list = () => document.body.querySelector<HTMLUListElement>(".time-zone-picker-list")!;
const opts = () => qa(".time-zone-picker-option");
const hidden = () => document.body.querySelector<HTMLInputElement>('input[type="hidden"]')!;
const tip = () => document.body.querySelector<HTMLElement>(".time-zone-picker-tooltip")!;
const press = (el: Element, key: string) => el.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
const click = (el: Element) => el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
function pick(zone: string): void {
  click(button());
  click(opts()[ORDERED.indexOf(zone)]);
}

let apis: Array<{ destroy: () => void }> = [];
function mount(over: Record<string, unknown> = {}, initOpts: Record<string, unknown> = {}) {
  const root = mountIntoBody(renderMacro(over));
  const api = initTimeZonePicker(root, initOpts);
  apis.push(api);
  return api;
}

beforeEach(() => {
  document.documentElement.removeAttribute("data-time-zone");
  document.body.innerHTML = "";
  try {
    localStorage.clear();
  } catch {
    /* ignore */
  }
});

afterEach(() => {
  for (const a of apis) a.destroy();
  apis = [];
  document.body.innerHTML = "";
  document.documentElement.removeAttribute("data-time-zone");
});

describe("timeZoneOptions", () => {
  test("is ordered by offset and carries id, offset, name and label", () => {
    const o = options();
    expect(o.map((z) => z.id)).toEqual(ORDERED);
    expect(o[3]).toMatchObject({ id: "Asia/Kolkata", offset: "UTC+05:30", offsetMinutes: 330, name: "India Standard Time", label: "UTC+05:30 – India Standard Time" });
  });
  test("follows the date and the locale, and labelFor", () => {
    expect(options({ date: SUMMER, zones: ["Europe/Paris"] })[0].label).toBe("UTC+02:00 – Central European Summer Time");
    expect(options({ locale: "fr", zones: ["Europe/Paris"] })[0].name).toMatch(/Europe centrale/);
    expect(options({ labelFor: (z: { name: string }) => z.name, zones: ["UTC"] })[0].label).toBe("Coordinated Universal Time");
  });
  test("offers the default zones when none are given", () => {
    expect(timeZoneOptions({ locale: "en", date: WINTER }).length).toBe(DEFAULT_ZONES.length);
  });
});

describe("timeZoneOptions: supplied names (CLDR packs)", () => {
  const names = { "Asia/Kolkata": "Bharat Standard", "Europe/Paris": ["Paris Standard", "Paris Summer"] } as const;

  test("win over Intl for the zones they name, and a daylight pair follows the date", () => {
    expect(options({ names }).map((z) => z.label)).toContain("UTC+05:30 – Bharat Standard");
    expect(options({ names }).map((z) => z.label)).toContain("UTC+01:00 – Paris Standard");
    expect(options({ names }).map((z) => z.label)).toContain("UTC+09:00 – Japan Standard Time");
    expect(options({ names, date: SUMMER }).map((z) => z.label)).toContain("UTC+02:00 – Paris Summer");
  });
});

describe("macro markup", () => {
  test("a div root with a button controlling a listbox, a tooltip and a hidden input", () => {
    mountIntoBody(renderMacro({}));
    expect(document.querySelector(".time-zone-picker")!.tagName).toBe("DIV");
    expect(button().getAttribute("aria-haspopup")).toBe("listbox");
    expect(button().getAttribute("aria-expanded")).toBe("false");
    expect(button().getAttribute("aria-controls")).toBe(list().id);
    expect(list().getAttribute("role")).toBe("listbox");
    expect(list().hasAttribute("hidden")).toBe(true);
    expect(tip().getAttribute("role")).toBe("tooltip");
    expect(hidden().name).toBe("time-zone");
  });

  test("the label names the button, the listbox and the tooltip", () => {
    mountIntoBody(renderMacro({ label: "Choose a time zone" }));
    expect(button().getAttribute("aria-label")).toBe("Choose a time zone");
    expect(list().getAttribute("aria-label")).toBe("Choose a time zone");
    expect(tip().textContent).toBe("Choose a time zone");
    expect(button().hasAttribute("aria-describedby")).toBe(false);
  });

  test("one option per zone, in order, with offset and full name", () => {
    mountIntoBody(renderMacro({}));
    expect(opts().map((o) => o.getAttribute("data-value"))).toEqual(ORDERED);
    expect(opts().map((o) => o.textContent)).toContain("UTC+01:00 – Central European Standard Time");
    expect(opts()[3].getAttribute("data-offset")).toBe("UTC+05:30");
  });

  test("the icon is a bundled SVG, hidden from assistive technology; a caller replaces it", () => {
    mountIntoBody(renderMacro({}));
    expect(document.querySelector(".time-zone-picker-icon")!.getAttribute("aria-hidden")).toBe("true");
    document.body.innerHTML = renderWithCaller({}, `<b data-testid="glyph">Z</b>`);
    expect(document.querySelector('[data-testid="glyph"]')).toBeTruthy();
    expect(document.querySelector(".time-zone-picker-icon")).toBeNull();
  });

  test("exactly one option is aria-selected on the server: value, then defaultValue, then UTC, then the first", () => {
    const sel = (over: Record<string, unknown>) => {
      mountIntoBody(renderMacro(over));
      return opts().filter((o) => o.getAttribute("aria-selected") === "true").map((o) => o.getAttribute("data-value"));
    };
    expect(sel({ value: "Asia/Tokyo", defaultValue: "UTC" })).toEqual(["Asia/Tokyo"]);
    expect(sel({ defaultValue: "Asia/Kolkata" })).toEqual(["Asia/Kolkata"]);
    expect(sel({})).toEqual(["UTC"]);
    expect(sel({ value: "Nowhere/Land" })).toEqual(["UTC"]);
    expect(sel({ options: options({ zones: ["Asia/Tokyo", "America/New_York"] }) })).toEqual(["America/New_York"]);
  });

  test("open and disabled render the matching state; classes and attributes land on the root", () => {
    mountIntoBody(renderMacro({ open: true }));
    expect(button().getAttribute("aria-expanded")).toBe("true");
    expect(list().hasAttribute("hidden")).toBe(false);
    mountIntoBody(renderMacro({ open: true, disabled: true }));
    expect(button().disabled).toBe(true);
    expect(list().hasAttribute("hidden")).toBe(true);
    mountIntoBody(renderMacro({ classes: "extra", attributes: { "data-x": "1" }, name: "tz" }));
    expect(document.querySelector(".time-zone-picker")!.className).toBe("time-zone-picker extra");
    expect(document.querySelector(".time-zone-picker")!.getAttribute("data-x")).toBe("1");
    expect(hidden().name).toBe("tz");
  });

  test("escapes markup in labels", () => {
    mountIntoBody(renderMacro({ label: `<img src=x onerror=alert(1)>` }));
    expect(document.querySelector("img")).toBeNull();
  });
});

describe("client: applying", () => {
  test("choosing a zone sets the hidden input, aria-selected and data-time-zone, and closes", () => {
    mount({ defaultValue: "UTC" });
    pick("Asia/Kolkata");
    expect(hidden().value).toBe("Asia/Kolkata");
    expect(document.documentElement.getAttribute("data-time-zone")).toBe("Asia/Kolkata");
    expect(opts()[ORDERED.indexOf("Asia/Kolkata")].getAttribute("aria-selected")).toBe("true");
    expect(opts()[ORDERED.indexOf("UTC")].getAttribute("aria-selected")).toBe("false");
    expect(button().getAttribute("aria-expanded")).toBe("false");
    expect(list().hasAttribute("hidden")).toBe(true);
  });

  test("onChange fires once per change, with the IANA id", () => {
    const onChange = vi.fn();
    mount({ defaultValue: "UTC" }, { onChange });
    expect(onChange.mock.calls.map((c) => c[0])).toEqual(["UTC"]);
    pick("Asia/Tokyo");
    pick("Asia/Tokyo");
    expect(onChange.mock.calls.map((c) => c[0])).toEqual(["UTC", "Asia/Tokyo"]);
  });

  test("setZone applies from outside", () => {
    const api = mount({ defaultValue: "UTC" }) as unknown as { setZone: (z: string) => void };
    api.setZone("Europe/Paris");
    expect(hidden().value).toBe("Europe/Paris");
  });

  test("data-time-zone goes onto the target element when one is given", () => {
    const target = document.createElement("section");
    document.body.append(target);
    mount({ defaultValue: "Asia/Tokyo" }, { target });
    expect(target.getAttribute("data-time-zone")).toBe("Asia/Tokyo");
    expect(document.documentElement.hasAttribute("data-time-zone")).toBe(false);
  });

  test("autoInit wires every root", () => {
    document.body.innerHTML = renderMacro({ name: "a", defaultValue: "UTC" }) + renderMacro({ name: "b", defaultValue: "UTC" });
    const wired = autoInit();
    apis.push(...wired);
    expect(wired.length).toBe(2);
  });
});

describe("client: initial value", () => {
  const system = (zone: string) =>
    vi.spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions").mockReturnValue({ timeZone: zone } as Intl.ResolvedDateTimeFormatOptions);

  test("the value attribute wins, then defaultValue", () => {
    mount({ value: "Asia/Tokyo", defaultValue: "UTC" });
    expect(hidden().value).toBe("Asia/Tokyo");
  });

  test.each([
    ["Europe/Paris", "Europe/Paris"],
    ["Europe/Berlin", "Europe/Paris"],
    ["Nowhere/Land", "UTC"],
  ])("system zone %s resolves to %s (own zone, listed twin, UTC)", (sys, expected) => {
    const spy = system(sys);
    mount({});
    spy.mockRestore();
    expect(hidden().value).toBe(expected);
  });

  test("the first zone when UTC is not offered either", () => {
    const spy = system("Nowhere/Land");
    mount({ options: options({ zones: ["Asia/Tokyo", "America/New_York"] }) });
    spy.mockRestore();
    expect(hidden().value).toBe("America/New_York");
  });

  test("a stored zone is restored, and one that is no longer offered is not", () => {
    localStorage.setItem("tz", "Asia/Kolkata");
    mount({ storageKey: "tz", defaultValue: "UTC" });
    expect(hidden().value).toBe("Asia/Kolkata");
    apis.pop()!.destroy();
    localStorage.setItem("tz", "Pacific/Auckland");
    mount({ storageKey: "tz", defaultValue: "UTC" });
    expect(hidden().value).toBe("UTC");
  });

  test("the choice is stored under storageKey; nothing is written without one", () => {
    mount({ storageKey: "tz", defaultValue: "UTC" });
    pick("Asia/Tokyo");
    expect(localStorage.getItem("tz")).toBe("Asia/Tokyo");
    apis.pop()!.destroy();
    localStorage.clear();
    mount({ defaultValue: "UTC" });
    pick("Asia/Tokyo");
    expect(localStorage.length).toBe(0);
  });
});

describe("client: keyboard (APG listbox)", () => {
  const active = () => list().getAttribute("aria-activedescendant");

  test("ArrowDown on the button opens the list on the selected option; ArrowUp on the last", () => {
    mount({ defaultValue: "Asia/Kolkata" });
    press(button(), "ArrowDown");
    expect(button().getAttribute("aria-expanded")).toBe("true");
    expect(active()).toBe(opts()[ORDERED.indexOf("Asia/Kolkata")].id);
    press(list(), "Escape");
    press(button(), "ArrowUp");
    expect(active()).toBe(opts()[ORDERED.length - 1].id);
  });

  test("arrows clamp, Home and End jump, Enter selects and closes", () => {
    mount({ defaultValue: "UTC" });
    press(button(), "ArrowDown");
    press(list(), "End");
    press(list(), "ArrowDown");
    expect(active()).toBe(opts()[ORDERED.length - 1].id);
    press(list(), "Home");
    expect(active()).toBe(opts()[0].id);
    press(list(), "Enter");
    expect(hidden().value).toBe("America/New_York");
    expect(button().getAttribute("aria-expanded")).toBe("false");
  });

  test("typing an offset jumps to it", () => {
    mount({ defaultValue: "UTC" });
    press(button(), "ArrowDown");
    for (const ch of "UTC+05") press(list(), ch);
    expect(active()).toBe(opts()[ORDERED.indexOf("Asia/Kolkata")].id);
  });

  test("Escape closes without changing the value", () => {
    mount({ defaultValue: "UTC" });
    press(button(), "ArrowDown");
    press(list(), "ArrowDown");
    press(list(), "Escape");
    expect(button().getAttribute("aria-expanded")).toBe("false");
    expect(hidden().value).toBe("UTC");
  });
});

describe("client: open state, disabled, tooltip", () => {
  test("setOpen and setDisabled work from outside", () => {
    const api = mount({}) as unknown as { setOpen: (o: boolean) => void; setDisabled: (d: boolean) => void; isOpen: () => boolean };
    api.setOpen(true);
    expect(api.isOpen()).toBe(true);
    api.setDisabled(true);
    expect(button().disabled).toBe(true);
    expect(api.isOpen()).toBe(false);
  });

  test("the tooltip shows on hover and Escape dismisses it", () => {
    mount({});
    expect(tip().hasAttribute("hidden")).toBe(true);
    button().dispatchEvent(new MouseEvent("mouseenter"));
    expect(tip().hasAttribute("hidden")).toBe(false);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(tip().hasAttribute("hidden")).toBe(true);
  });
});
