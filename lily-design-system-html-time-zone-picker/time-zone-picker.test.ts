import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { DEFAULT_ZONES, TimeZonePicker } from "./time-zone-picker.js";

// Ensure the custom element is registered exactly once for the suite.
if (typeof customElements !== "undefined" && !customElements.get("time-zone-picker")) {
  customElements.define("time-zone-picker", TimeZonePicker);
}

// A fixed date, so offsets and names do not depend on the day the tests run: January, standard time in the north.
const WINTER = "2026-01-15T12:00:00Z";
const SUMMER = "2026-07-15T12:00:00Z";
const ZONES = ["Asia/Tokyo", "America/New_York", "Europe/Paris", "UTC", "Asia/Kolkata"];
// ...and the order the picker must show them in: west to east.
const ORDERED = ["America/New_York", "UTC", "Europe/Paris", "Asia/Kolkata", "Asia/Tokyo"];

const flush = (): Promise<void> => new Promise((r) => setTimeout(r, 0));

function mount(attrs: Record<string, string> = {}): TimeZonePicker {
  const el = document.createElement("time-zone-picker") as TimeZonePicker;
  const all: Record<string, string> = { label: "Time zone", locale: "en", zones: ZONES.join(","), date: WINTER, ...attrs };
  for (const [k, v] of Object.entries(all)) el.setAttribute(k, v);
  document.body.appendChild(el);
  return el;
}

const button = () => document.body.querySelector<HTMLButtonElement>(".time-zone-picker-button")!;
const list = () => document.body.querySelector<HTMLUListElement>(".time-zone-picker-list")!;
const options = () => [...document.body.querySelectorAll<HTMLLIElement>(".time-zone-picker-option")];
const hidden = () => document.body.querySelector<HTMLInputElement>('input[type="hidden"]')!;
const tip = () => document.body.querySelector<HTMLElement>(".time-zone-picker-tooltip")!;
const text = () => options().map((o) => o.textContent!.trim());

function press(el: Element, key: string): void {
  el.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
}
function click(el: Element): void {
  el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
}
function pick(zone: string): void {
  click(button());
  click(options()[ORDERED.indexOf(zone)]);
}

beforeEach(() => {
  document.documentElement.removeAttribute("data-time-zone");
  document.body.replaceChildren();
  try {
    localStorage.clear();
  } catch {
    /* ignore */
  }
});

afterEach(() => {
  document.body.replaceChildren();
  document.documentElement.removeAttribute("data-time-zone");
});

describe("markup contract", () => {
  test("a button that controls a listbox", () => {
    mount();
    expect(button().tagName).toBe("BUTTON");
    expect(button().getAttribute("type")).toBe("button");
    expect(button().getAttribute("aria-haspopup")).toBe("listbox");
    expect(button().getAttribute("aria-expanded")).toBe("false");
    expect(list().id).toBe(button().getAttribute("aria-controls"));
    expect(list().getAttribute("role")).toBe("listbox");
  });

  test("the root carries the base class and the element's class", () => {
    mount({ class: "extra" });
    expect(document.querySelector(".time-zone-picker")!.className).toBe("time-zone-picker extra");
  });

  test("the icon is a bundled SVG, hidden from assistive technology", () => {
    mount();
    const icon = document.querySelector(".time-zone-picker-icon")!;
    expect(icon.tagName.toLowerCase()).toBe("svg");
    expect(icon.getAttribute("aria-hidden")).toBe("true");
    expect(icon.querySelector("path")).toBeTruthy();
  });

  test("the label names the button and the listbox, and is the tooltip text", () => {
    mount({ label: "Choose a time zone" });
    expect(button().getAttribute("aria-label")).toBe("Choose a time zone");
    expect(list().getAttribute("aria-label")).toBe("Choose a time zone");
    expect(tip().textContent).toBe("Choose a time zone");
    expect(tip().getAttribute("role")).toBe("tooltip");
    expect(button().hasAttribute("aria-describedby")).toBe(false);
  });

  test("one option per zone, each an option with aria-selected", () => {
    mount();
    expect(options().length).toBe(ZONES.length);
    for (const o of options()) {
      expect(o.getAttribute("role")).toBe("option");
      expect(o.getAttribute("aria-selected")).toMatch(/true|false/);
    }
  });

  test("the hidden input carries the name and the IANA id", () => {
    mount({ name: "tz", "default-value": "Asia/Tokyo" });
    expect(hidden().name).toBe("tz");
    expect(hidden().value).toBe("Asia/Tokyo");
  });

  test("the hidden input is named time-zone by default", () => {
    mount();
    expect(hidden().name).toBe("time-zone");
  });

  test("the list is hidden until opened", () => {
    mount();
    expect(list().hasAttribute("hidden")).toBe(true);
  });
});

describe("options: offsets and full names, ordered by offset", () => {
  test("ordered west to east, whatever order the zones were given", () => {
    mount();
    expect(text().map((t) => t.slice(0, 9))).toEqual(["UTC-05:00", "UTC+00:00", "UTC+01:00", "UTC+05:30", "UTC+09:00"]);
  });

  test("each option shows its offset and its full name", () => {
    mount();
    expect(text()).toContain("UTC-05:00 – Eastern Standard Time");
    expect(text()).toContain("UTC+01:00 – Central European Standard Time");
    expect(text()).toContain("UTC+05:30 – India Standard Time");
    expect(text()).toContain("UTC+09:00 – Japan Standard Time");
    expect(options()[3].getAttribute("data-offset")).toBe("UTC+05:30");
  });

  test("the names are in the locale it is given", () => {
    mount({ locale: "fr", zones: "Europe/Paris" });
    expect(text()[0]).toMatch(/UTC\+01:00 – .*Europe centrale/);
  });

  test("the date decides the offsets: summer time shows the summer offset", () => {
    mount({ date: SUMMER, zones: "Europe/Paris,America/New_York" });
    expect(text()).toEqual(["UTC-04:00 – Eastern Daylight Time", "UTC+02:00 – Central European Summer Time"]);
  });

  test("the zones and date properties work like the attributes", () => {
    const el = mount();
    el.zones = ["Asia/Tokyo", "UTC"];
    el.date = new Date(SUMMER);
    expect(text()).toEqual(["UTC+00:00 – Coordinated Universal Time", "UTC+09:00 – Japan Standard Time"]);
    expect(el.zones).toEqual(["Asia/Tokyo", "UTC"]);
  });

  test("labelFor builds the text", () => {
    const el = mount();
    el.labelFor = (z) => `${z.name} [${z.offset}]`;
    expect(text()).toContain("India Standard Time [UTC+05:30]");
  });

  test("infoFor returns the offset, name and label of a zone", () => {
    const info = mount().infoFor("Asia/Kolkata")!;
    expect(info.offset).toBe("UTC+05:30");
    expect(info.name).toBe("India Standard Time");
  });

  test("an unknown zone is left out, not shown unnamed", () => {
    mount({ zones: "UTC,Nowhere/Land" });
    expect(options().length).toBe(1);
  });

  test("the default list is offered when no zones are given, ordered by offset", () => {
    const el = document.createElement("time-zone-picker");
    el.setAttribute("label", "Time zone");
    el.setAttribute("locale", "en");
    el.setAttribute("date", WINTER);
    document.body.appendChild(el);
    const offsets = options().map((o) => o.getAttribute("data-offset")!);
    expect(offsets.length).toBe(DEFAULT_ZONES.length);
    const minutes = offsets.map((t) => (t[3] === "-" ? -1 : 1) * (Number(t.slice(4, 6)) * 60 + Number(t.slice(7, 9))));
    expect(minutes).toEqual([...minutes].sort((a, b) => a - b));
  });
});

describe("supplied names (CLDR packs)", () => {
  const names = { "Asia/Kolkata": "Bharat Standard", "Europe/Paris": ["Paris Standard", "Paris Summer"] } as const;

  test("win over Intl for the zones they name, and the rest stay Intl's", () => {
    const el = mount();
    el.names = names;
    expect(text()).toContain("UTC+05:30 – Bharat Standard");
    expect(text()).toContain("UTC+01:00 – Paris Standard");
    expect(text()).toContain("UTC+09:00 – Japan Standard Time");
  });

  test("a daylight pair follows the date", () => {
    const el = mount({ date: SUMMER });
    el.names = names;
    expect(text()).toContain("UTC+02:00 – Paris Summer");
  });
});

describe("selection and applying", () => {
  test("choosing a zone sets the value, the hidden input, aria-selected and data-time-zone, and closes", () => {
    mount({ "default-value": "UTC" });
    pick("Asia/Kolkata");
    expect(hidden().value).toBe("Asia/Kolkata");
    expect(document.documentElement.getAttribute("data-time-zone")).toBe("Asia/Kolkata");
    expect(options()[ORDERED.indexOf("Asia/Kolkata")].getAttribute("aria-selected")).toBe("true");
    expect(options()[ORDERED.indexOf("UTC")].getAttribute("aria-selected")).toBe("false");
    expect(button().getAttribute("aria-expanded")).toBe("false");
    expect(list().hasAttribute("hidden")).toBe(true);
  });

  test("timezonechange fires once per change, with the IANA id in detail.zone", () => {
    const el = mount({ "default-value": "UTC" });
    const zones: string[] = [];
    el.addEventListener("timezonechange", (e) => zones.push((e as CustomEvent).detail.zone));
    pick("Asia/Tokyo");
    pick("Asia/Tokyo");
    expect(zones).toEqual(["Asia/Tokyo"]);
  });

  test("data-time-zone goes onto the target element when one is given", () => {
    const target = document.createElement("section");
    document.body.append(target);
    const el = document.createElement("time-zone-picker") as TimeZonePicker;
    el.target = target;
    for (const [k, v] of Object.entries({ label: "Time zone", locale: "en", zones: ZONES.join(","), date: WINTER, "default-value": "Asia/Tokyo" })) el.setAttribute(k, v);
    document.body.appendChild(el);
    expect(target.getAttribute("data-time-zone")).toBe("Asia/Tokyo");
    expect(document.documentElement.hasAttribute("data-time-zone")).toBe(false);
  });
});

describe("initial value", () => {
  const system = (zone: string) =>
    vi.spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions").mockReturnValue({ timeZone: zone } as Intl.ResolvedDateTimeFormatOptions);

  test("the value attribute wins, then defaultValue", () => {
    mount({ value: "Asia/Tokyo", "default-value": "UTC" });
    expect(hidden().value).toBe("Asia/Tokyo");
  });

  test.each([
    ["Europe/Paris", "Europe/Paris"],
    ["Europe/Berlin", "Europe/Paris"],
    ["Nowhere/Land", "UTC"],
  ])("system zone %s resolves to %s (own zone, listed twin, UTC)", (sys, expected) => {
    const spy = system(sys);
    mount();
    spy.mockRestore();
    expect(hidden().value).toBe(expected);
  });

  test("the first zone when UTC is not offered either", () => {
    const spy = system("Nowhere/Land");
    mount({ zones: "Asia/Tokyo,America/New_York" });
    spy.mockRestore();
    expect(hidden().value).toBe("America/New_York");
  });

  test("an empty list leaves the value empty and applies nothing", () => {
    const empty = document.createElement("time-zone-picker") as TimeZonePicker;
    for (const [k, v] of Object.entries({ label: "Time zone", locale: "en", date: WINTER })) empty.setAttribute(k, v);
    empty.zones = [];
    document.body.appendChild(empty);
    expect(hidden().value).toBe("");
    expect(document.documentElement.hasAttribute("data-time-zone")).toBe(false);
  });
});

describe("persistence", () => {
  test("the choice is stored under storage-key, and restored", () => {
    mount({ "storage-key": "tz", "default-value": "UTC" });
    pick("Asia/Tokyo");
    expect(localStorage.getItem("tz")).toBe("Asia/Tokyo");
    document.body.replaceChildren();
    mount({ "storage-key": "tz", "default-value": "UTC" });
    expect(hidden().value).toBe("Asia/Tokyo");
  });

  test("a stored zone that is no longer offered is not restored", () => {
    localStorage.setItem("tz", "Pacific/Auckland");
    mount({ "storage-key": "tz", "default-value": "UTC" });
    expect(hidden().value).toBe("UTC");
  });

  test("nothing is written without a storage-key", () => {
    mount({ "default-value": "UTC" });
    pick("Asia/Tokyo");
    expect(localStorage.length).toBe(0);
  });
});

describe("keyboard (APG listbox)", () => {
  const active = () => list().getAttribute("aria-activedescendant");

  test("ArrowDown on the button opens the list on the selected option", () => {
    mount({ "default-value": "Asia/Kolkata" });
    press(button(), "ArrowDown");
    expect(button().getAttribute("aria-expanded")).toBe("true");
    expect(active()).toBe(options()[ORDERED.indexOf("Asia/Kolkata")].id);
  });

  test("ArrowUp on the button opens the list on the last option", () => {
    mount({ "default-value": "UTC" });
    press(button(), "ArrowUp");
    expect(active()).toBe(options()[ORDERED.length - 1].id);
  });

  test("arrows clamp, Home and End jump, Enter selects and closes", () => {
    mount({ "default-value": "UTC" });
    press(button(), "ArrowDown");
    press(list(), "End");
    press(list(), "ArrowDown");
    expect(active()).toBe(options()[ORDERED.length - 1].id);
    press(list(), "Home");
    expect(active()).toBe(options()[0].id);
    press(list(), "Enter");
    expect(hidden().value).toBe("America/New_York");
    expect(button().getAttribute("aria-expanded")).toBe("false");
  });

  test("typing an offset jumps to it", () => {
    mount({ "default-value": "UTC" });
    press(button(), "ArrowDown");
    for (const ch of "UTC+05") press(list(), ch);
    expect(active()).toBe(options()[ORDERED.indexOf("Asia/Kolkata")].id);
  });

  test("Escape closes without changing the value", () => {
    mount({ "default-value": "UTC" });
    press(button(), "ArrowDown");
    press(list(), "ArrowDown");
    press(list(), "Escape");
    expect(button().getAttribute("aria-expanded")).toBe("false");
    expect(hidden().value).toBe("UTC");
  });
});

describe("open state, disabled, tooltip, button content", () => {
  test("openchange is dispatched for opening and closing", () => {
    const el = mount();
    const states: boolean[] = [];
    el.addEventListener("openchange", (e) => states.push((e as CustomEvent).detail));
    click(button());
    click(button());
    expect(states).toEqual([true, false]);
  });

  test("the open property opens and closes it without moving focus", () => {
    const el = mount();
    el.open = true;
    expect(button().getAttribute("aria-expanded")).toBe("true");
    el.open = false;
    expect(button().getAttribute("aria-expanded")).toBe("false");
  });

  test("a disabled picker cannot be opened", () => {
    mount({ disabled: "" });
    expect(button().disabled).toBe(true);
  });

  test("the tooltip shows on hover and Escape dismisses it", () => {
    mount();
    expect(tip().hasAttribute("hidden")).toBe(true);
    button().dispatchEvent(new MouseEvent("mouseenter"));
    expect(tip().hasAttribute("hidden")).toBe(false);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(tip().hasAttribute("hidden")).toBe(true);
  });

  test("a subclass can replace the icon with renderButtonContent and read infoFor", () => {
    class Custom extends TimeZonePicker {
      override renderButtonContent(): Node {
        const span = document.createElement("span");
        span.setAttribute("data-testid", "glyph");
        span.textContent = this.infoFor(this.value)?.offset ?? "";
        return span;
      }
    }
    customElements.define("custom-time-zone-picker", Custom);
    const el = document.createElement("custom-time-zone-picker");
    for (const [k, v] of Object.entries({ label: "Time zone", locale: "en", zones: ZONES.join(","), date: WINTER, "default-value": "Asia/Kolkata" })) el.setAttribute(k, v);
    document.body.appendChild(el);
    expect(el.querySelector('[data-testid="glyph"]')!.textContent).toBe("UTC+05:30");
    expect(el.querySelector(".time-zone-picker-icon")).toBeNull();
  });
});
