import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import {
  MotionPicker,
  motionName,
  prefersReducedMotion,
} from "./motion-picker.js";

// Ensure the custom element is registered exactly once for the suite.
if (
  typeof customElements !== "undefined" &&
  !customElements.get("lily-motion-picker")
) {
  customElements.define("lily-motion-picker", MotionPicker);
}

const MOTIONS = ["no-preference", "reduce"];

function flush(): Promise<void> {
  return new Promise((r) => setTimeout(r, 0));
}

function resetRoot(): void {
  document.documentElement.removeAttribute("data-motion");
}

/** Set (or clear) window.matchMedia's answer to (prefers-reduced-motion: reduce). */
function mockReducedMotion(matches: boolean): void {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query === "(prefers-reduced-motion: reduce)" ? matches : false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia;
}

function mount(attrs: Record<string, string>): MotionPicker {
  const el = document.createElement("lily-motion-picker") as MotionPicker;
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  document.body.appendChild(el);
  return el;
}

function button(): HTMLButtonElement {
  return document.body.querySelector<HTMLButtonElement>(
    ".motion-picker-button",
  )!;
}

function list(): HTMLUListElement {
  return document.body.querySelector<HTMLUListElement>(
    ".motion-picker-list",
  )!;
}

function options(): HTMLLIElement[] {
  return [
    ...document.body.querySelectorAll<HTMLLIElement>(
      ".motion-picker-option",
    ),
  ];
}

function hiddenInput(): HTMLInputElement {
  return document.body.querySelector<HTMLInputElement>('input[type="hidden"]')!;
}

function press(el: Element, key: string): void {
  el.dispatchEvent(
    new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }),
  );
}

function click(el: Element): void {
  el.dispatchEvent(
    new MouseEvent("click", { bubbles: true, cancelable: true }),
  );
}

/** Open the listbox and click the option for `slug`. */
function pick(slug: string, motions: string[] = MOTIONS): void {
  click(button());
  click(options()[motions.indexOf(slug)]);
}

beforeEach(() => {
  resetRoot();
  document.body.replaceChildren();
  mockReducedMotion(false);
  try {
    localStorage.clear();
  } catch {
    /* ignore */
  }
});

afterEach(() => {
  resetRoot();
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

describe("<lily-motion-picker> — pure helpers", () => {
  test("motionName title-cases a single-word slug", () => {
    expect(motionName("reduce")).toBe("Reduce");
  });

  test("motionName title-cases every hyphen-separated word", () => {
    expect(motionName("no-preference")).toBe("No Preference");
  });

  test("motionName leaves an empty slug empty", () => {
    expect(motionName("")).toBe("");
  });

  test("prefersReducedMotion reads (prefers-reduced-motion: reduce)", () => {
    mockReducedMotion(true);
    expect(prefersReducedMotion()).toBe(true);
    mockReducedMotion(false);
    expect(prefersReducedMotion()).toBe(false);
  });
});

describe("<lily-motion-picker> — markup contract (§7.1–§7.5)", () => {
  test("§7.1 renders a div root containing a button that controls a listbox", async () => {
    mount({ label: "Motion", motions: MOTIONS.join(",") });
    await flush();
    const root = document.body.querySelector("div.motion-picker")!;
    expect(root.tagName).toBe("DIV");
    const btn = button();
    expect(btn.tagName).toBe("BUTTON");
    expect(btn.getAttribute("type")).toBe("button");
    expect(btn.getAttribute("aria-haspopup")).toBe("listbox");
    expect(btn.getAttribute("aria-expanded")).toBe("false");
    const listId = btn.getAttribute("aria-controls");
    expect(listId).toBeTruthy();
    expect(document.getElementById(listId!)?.getAttribute("role")).toBe(
      "listbox",
    );
    expect(document.getElementById(listId!)).toBe(list());
  });

  test("§7.1 the button renders the pause glyph, hidden from assistive tech", async () => {
    mount({ label: "Motion", motions: MOTIONS.join(",") });
    await flush();
    const icon = document.body.querySelector<HTMLElement>(
      ".motion-picker-icon",
    )!;
    // U+23F8 PAUSE SIGN + U+FE0E (text presentation).
    expect(icon.textContent).toBe("⏸︎");
    expect(icon.getAttribute("aria-hidden")).toBe("true");
    expect(icon.closest("button")).toBe(button());
  });

  test("§7.1 no native <select> is rendered", async () => {
    mount({ label: "Motion", motions: MOTIONS.join(",") });
    await flush();
    expect(document.body.querySelector("select")).toBeNull();
    expect(document.body.querySelector("option")).toBeNull();
  });

  test("§7.2 aria-label names the button and the listbox", async () => {
    mount({ label: "Choose motion", motions: MOTIONS.join(",") });
    await flush();
    expect(button().getAttribute("aria-label")).toBe("Choose motion");
    expect(list().getAttribute("aria-label")).toBe("Choose motion");
  });

  test("§7.3 one option per motion; the hidden input carries the supplied name and value", async () => {
    mount({ label: "Motion", motions: MOTIONS.join(","), name: "reduced-motion" });
    await flush();
    expect(options().length).toBe(MOTIONS.length);
    expect(hiddenInput().name).toBe("reduced-motion");
    expect(hiddenInput().value).toBe("no-preference");
  });

  test("§7.4 the listbox is hidden until the button is activated", async () => {
    mount({ label: "Motion", motions: MOTIONS.join(",") });
    await flush();
    expect(list().hasAttribute("hidden")).toBe(true);
    expect(list().getAttribute("tabindex")).toBe("-1");
    click(button());
    expect(list().hasAttribute("hidden")).toBe(false);
    expect(button().getAttribute("aria-expanded")).toBe("true");
  });

  test("§7.4 the active motion is the aria-selected option", async () => {
    mount({ label: "Motion", motions: MOTIONS.join(",") });
    await flush();
    click(button());
    const selected = document.body.querySelectorAll(
      '[role="option"][aria-selected="true"]',
    );
    expect(selected.length).toBe(1);
    expect(selected[0].textContent?.trim()).toBe("No Preference");
  });

  test("§7.4 clicking an option selects it, applies it, and closes the listbox", async () => {
    mount({ label: "Motion", motions: MOTIONS.join(",") });
    await flush();
    pick("reduce");
    await flush();
    expect(document.documentElement.dataset.motion).toBe("reduce");
    expect(list().hasAttribute("hidden")).toBe(true);
    expect(button().getAttribute("aria-expanded")).toBe("false");
    expect(hiddenInput().value).toBe("reduce");
  });

  test("§7.5 default labels title-case the slug (no 'default' string)", async () => {
    mount({ label: "Motion", motions: "no-preference,reduce" });
    await flush();
    const text = document.body.textContent ?? "";
    expect(text).toContain("No Preference");
    expect(text).toContain("Reduce");
    expect(text).not.toMatch(/\bdefault\b/i);
  });

  test("§7.5 motionLabels override the default title-case label", async () => {
    mount({
      label: "Motion",
      motions: "no-preference,reduce",
      "motion-labels": JSON.stringify({ "no-preference": "Full motion", reduce: "Reduced motion" }),
    });
    await flush();
    const text = document.body.textContent ?? "";
    expect(text).toContain("Full motion");
    expect(text).toContain("Reduced motion");
  });

  test("§7.5 labelFor delegates to motionName so there is one title-casing rule", async () => {
    const el = mount({
      label: "Motion",
      motions: "reduce",
      "motion-labels": JSON.stringify({ "no-preference": "Full motion" }),
    });
    await flush();
    expect(el.labelFor("reduce")).toBe(motionName("reduce"));
    expect(el.labelFor("reduce")).toBe("Reduce");
    expect(el.labelFor("no-preference")).toBe("Full motion");
  });
});

describe("<lily-motion-picker> — application (§7.6–§7.11)", () => {
  test("§7.6 default initial value is 'no-preference' when the OS reports no preference", async () => {
    mockReducedMotion(false);
    mount({ label: "Motion", motions: MOTIONS.join(",") });
    await flush();
    expect(document.documentElement.dataset.motion).toBe("no-preference");
  });

  test("§7.6 default initial value is 'reduce' when the OS reports prefers-reduced-motion", async () => {
    mockReducedMotion(true);
    mount({ label: "Motion", motions: MOTIONS.join(",") });
    await flush();
    expect(document.documentElement.dataset.motion).toBe("reduce");
  });

  test("§7.6 falls back to motions[0] when neither OS slug is offered", async () => {
    mockReducedMotion(true);
    mount({ label: "Motion", motions: "standard,minimal" });
    await flush();
    expect(document.documentElement.dataset.motion).toBe("standard");
  });

  test("§7.7 sets data-motion on documentElement", async () => {
    mount({ label: "Motion", motions: MOTIONS.join(",") });
    await flush();
    expect(document.documentElement.getAttribute("data-motion")).toBe(
      "no-preference",
    );
  });

  test("§7.8 selecting an option updates data-motion and fires motionchange", async () => {
    const onChange = vi.fn();
    const el = mount({ label: "Motion", motions: MOTIONS.join(",") });
    el.addEventListener("motionchange", (e) => {
      onChange((e as CustomEvent<{ motion: string }>).detail.motion);
    });
    await flush();
    pick("reduce");
    await flush();
    expect(document.documentElement.dataset.motion).toBe("reduce");
    expect(onChange).toHaveBeenLastCalledWith("reduce");
  });

  test("§7.9 persists to localStorage and reads back on a fresh mount", async () => {
    const first = mount({
      label: "Motion",
      motions: MOTIONS.join(","),
      "storage-key": "lily-motion",
    });
    await flush();
    pick("reduce");
    await flush();
    expect(localStorage.getItem("lily-motion")).toBe("reduce");
    first.remove();
    resetRoot();

    mount({
      label: "Motion",
      motions: MOTIONS.join(","),
      "storage-key": "lily-motion",
    });
    await flush();
    expect(document.documentElement.dataset.motion).toBe("reduce");
  });

  test("§7.10 a supplied non-empty value attribute wins over storage, OS preference, and defaults", async () => {
    mockReducedMotion(true);
    localStorage.setItem("lily-motion", "reduce");
    mount({
      label: "Motion",
      motions: MOTIONS.join(","),
      value: "no-preference",
      "storage-key": "lily-motion",
    });
    await flush();
    expect(document.documentElement.dataset.motion).toBe("no-preference");
  });

  test("§7.11 a custom target receives data-motion", async () => {
    const target = document.createElement("section");
    document.body.appendChild(target);
    const el = document.createElement("lily-motion-picker") as MotionPicker;
    el.setAttribute("label", "Motion");
    el.setAttribute("motions", MOTIONS.join(","));
    el.setAttribute("default-value", "reduce");
    el.target = target;
    document.body.appendChild(el);
    await flush();
    expect(target.getAttribute("data-motion")).toBe("reduce");
    expect(document.documentElement.hasAttribute("data-motion")).toBe(false);
    target.remove();
  });
});

describe("<lily-motion-picker> — element shape + property API (§7.12–§7.13)", () => {
  test("§7.12 element survives a re-render with its id/data-* intact", async () => {
    const el = mount({ label: "Motion", motions: MOTIONS.join(",") });
    el.id = "mp";
    el.setAttribute("data-testid", "mp");
    await flush();
    el.setAttribute("motions", "no-preference,reduce,less");
    await flush();
    expect(document.getElementById("mp")).toBe(el);
    expect(el.getAttribute("data-testid")).toBe("mp");
    expect(el.querySelectorAll(".motion-picker-option").length).toBe(3);
  });

  test("§7.12 the consumer class is appended to the root class hook", async () => {
    mount({ label: "Motion", motions: MOTIONS.join(","), class: "my-motion" });
    await flush();
    const root = document.body.querySelector("div.motion-picker")!;
    expect(root.className).toBe("motion-picker my-motion");
  });

  test("§7.13 setting el.motions as an array mirrors the CSV attribute and re-renders", async () => {
    const el = mount({ label: "Motion", motions: "no-preference,reduce" });
    await flush();
    el.motions = ["no-preference", "reduce", "less"];
    await flush();
    expect(el.getAttribute("motions")).toBe("no-preference,reduce,less");
    expect(el.querySelectorAll(".motion-picker-option").length).toBe(3);
  });

  test("§7.13 setting el.motionLabels as an object mirrors the JSON attribute and re-renders", async () => {
    const el = mount({ label: "Motion", motions: "no-preference,reduce" });
    await flush();
    el.motionLabels = { "no-preference": "Full motion", reduce: "Reduced motion" };
    await flush();
    expect(el.getAttribute("motion-labels")).toBe(
      JSON.stringify({ "no-preference": "Full motion", reduce: "Reduced motion" }),
    );
    const text = document.body.textContent ?? "";
    expect(text).toContain("Full motion");
  });

  test("§7.13 list and option ids are unique across instances", async () => {
    mount({ label: "A", motions: "no-preference,reduce" });
    mount({ label: "B", motions: "no-preference,reduce" });
    await flush();
    const ids = options().map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
    const listIds = [
      ...document.body.querySelectorAll(".motion-picker-list"),
    ].map((l) => l.id);
    expect(new Set(listIds).size).toBe(2);
  });
});

describe("<lily-motion-picker> — keyboard contract (APG listbox, §7.14–§7.18)", () => {
  async function openWith(key: string): Promise<void> {
    mount({ label: "Motion", motions: MOTIONS.join(",") });
    await flush();
    press(button(), key);
  }

  test("§7.14 ArrowDown, Enter and Space all open the listbox", async () => {
    for (const key of ["ArrowDown", "Enter", " "]) {
      await openWith(key);
      expect(list().hasAttribute("hidden")).toBe(false);
      document.body.replaceChildren();
    }
  });

  test("§7.14 opening moves focus to the listbox and activates the selected option", async () => {
    await openWith("ArrowDown");
    expect(document.activeElement).toBe(list());
    // "no-preference" is the resolved initial value, index 0.
    expect(list().getAttribute("aria-activedescendant")).toBe(options()[0].id);
    expect(options()[0].hasAttribute("data-active")).toBe(true);
  });

  test("§7.14 ArrowUp opens with the last option active", async () => {
    await openWith("ArrowUp");
    expect(list().getAttribute("aria-activedescendant")).toBe(
      options()[MOTIONS.length - 1].id,
    );
  });

  test("§7.15 ArrowDown / ArrowUp move the active descendant and clamp", async () => {
    await openWith("ArrowDown");
    expect(list().getAttribute("aria-activedescendant")).toBe(options()[0].id);
    press(list(), "ArrowDown");
    expect(list().getAttribute("aria-activedescendant")).toBe(options()[1].id);
    // Clamp at the bottom.
    press(list(), "ArrowDown");
    expect(list().getAttribute("aria-activedescendant")).toBe(options()[1].id);
    // Clamp at the top.
    press(list(), "ArrowUp");
    press(list(), "ArrowUp");
    expect(list().getAttribute("aria-activedescendant")).toBe(options()[0].id);
  });

  test("§7.15 Home and End jump to the first and last option", async () => {
    await openWith("ArrowDown");
    press(list(), "End");
    expect(list().getAttribute("aria-activedescendant")).toBe(
      options()[MOTIONS.length - 1].id,
    );
    press(list(), "Home");
    expect(list().getAttribute("aria-activedescendant")).toBe(options()[0].id);
  });

  test("§7.16 Enter selects the active option, applies it, closes, and refocuses the button", async () => {
    await openWith("ArrowDown");
    press(list(), "ArrowDown");
    press(list(), "Enter");
    await flush();
    expect(list().hasAttribute("hidden")).toBe(true);
    expect(button().getAttribute("aria-expanded")).toBe("false");
    // no-preference (index 0) → ArrowDown → reduce (index 1).
    expect(document.documentElement.dataset.motion).toBe("reduce");
    expect(document.activeElement).toBe(button());
    expect(list().hasAttribute("aria-activedescendant")).toBe(false);
  });

  test("§7.16 Space also selects the active option", async () => {
    await openWith("ArrowDown");
    press(list(), "End");
    press(list(), " ");
    await flush();
    expect(document.documentElement.dataset.motion).toBe("reduce");
    expect(list().hasAttribute("hidden")).toBe(true);
  });

  test("§7.17 Escape closes without changing the motion and refocuses the button", async () => {
    await openWith("ArrowDown");
    press(list(), "ArrowDown");
    press(list(), "Escape");
    await flush();
    expect(list().hasAttribute("hidden")).toBe(true);
    expect(document.documentElement.dataset.motion).toBe("no-preference");
    expect(document.activeElement).toBe(button());
  });

  test("§7.17 Tab closes the list; the hardening contract (§7.20) moves focus to the button first", async () => {
    await openWith("ArrowDown");
    press(list(), "Tab");
    await flush();
    expect(list().hasAttribute("hidden")).toBe(true);
  });

  test("§7.18 typeahead moves the active descendant by label prefix", async () => {
    await openWith("ArrowDown");
    press(list(), "r");
    // "Reduce" is index 1 in MOTIONS.
    expect(list().getAttribute("aria-activedescendant")).toBe(options()[1].id);
  });

  test("§7.18 a click outside the root closes the listbox", async () => {
    await openWith("ArrowDown");
    expect(list().hasAttribute("hidden")).toBe(false);
    click(document.body);
    expect(list().hasAttribute("hidden")).toBe(true);
  });
});

describe("<lily-motion-picker> — custom rendering by subclass (§7.19)", () => {
  class GlyphlessMotionPicker extends MotionPicker {
    renderButtonContent(): Node {
      const span = document.createElement("span");
      span.setAttribute("data-testid", "custom");
      span.setAttribute("data-open", String(this.open));
      span.setAttribute("data-value", this.value);
      span.setAttribute("data-label-reduce", this.labelFor("reduce"));
      span.textContent = "custom glyph";
      return span;
    }
  }
  if (!customElements.get("glyphless-motion-picker")) {
    customElements.define(
      "glyphless-motion-picker",
      GlyphlessMotionPicker,
    );
  }

  test("§7.19 renderButtonContent replaces the glyph and keeps the aria wiring", async () => {
    const el = document.createElement(
      "glyphless-motion-picker",
    ) as GlyphlessMotionPicker;
    el.setAttribute("label", "Motion");
    el.setAttribute("motions", MOTIONS.join(","));
    el.setAttribute("value", "reduce");
    document.body.appendChild(el);
    await flush();

    const custom = el.querySelector<HTMLElement>('[data-testid="custom"]')!;
    expect(custom.closest("button")?.className).toBe(
      "motion-picker-button",
    );
    expect(el.querySelector(".motion-picker-icon")).toBeNull();
    expect(custom.getAttribute("data-open")).toBe("false");
    expect(custom.getAttribute("data-value")).toBe("reduce");
    expect(custom.getAttribute("data-label-reduce")).toBe("Reduce");

    const btn = el.querySelector<HTMLButtonElement>(
      ".motion-picker-button",
    )!;
    expect(btn.getAttribute("aria-haspopup")).toBe("listbox");
    expect(btn.getAttribute("aria-label")).toBe("Motion");
    expect(
      el.querySelector(`#${btn.getAttribute("aria-controls")}`),
    ).not.toBeNull();
  });

  test("§7.19 renderButtonContent re-runs when value or open changes", async () => {
    const el = document.createElement(
      "glyphless-motion-picker",
    ) as GlyphlessMotionPicker;
    el.setAttribute("label", "Motion");
    el.setAttribute("motions", MOTIONS.join(","));
    document.body.appendChild(el);
    await flush();
    const read = (attr: string) =>
      el.querySelector('[data-testid="custom"]')!.getAttribute(attr);

    expect(read("data-value")).toBe("no-preference");

    el.value = "reduce";
    await flush();
    expect(read("data-value")).toBe("reduce");

    el.openList();
    expect(read("data-open")).toBe("true");
    el.closeList();
    expect(read("data-open")).toBe("false");
  });

  test("§7.19 a subclass still fires motionchange through the base lifecycle", async () => {
    const el = document.createElement(
      "glyphless-motion-picker",
    ) as GlyphlessMotionPicker;
    el.setAttribute("label", "Motion");
    el.setAttribute("motions", MOTIONS.join(","));
    document.body.appendChild(el);
    await flush();
    let detail: { motion: string } | undefined;
    el.addEventListener("motionchange", (e) => {
      detail = (e as CustomEvent<{ motion: string }>).detail;
    });
    el.value = "reduce";
    expect(detail).toEqual({ motion: "reduce" });
  });
});

describe("<lily-motion-picker> — accessibility hardening (§7.20–§7.23; canonical Svelte §7.14–§7.17)", () => {
  async function openPicker(
    motions: string[] = MOTIONS,
    extra: Record<string, string> = {},
  ) {
    mount({ label: "Motion", motions: motions.join(","), ...extra });
    await flush();
    click(button());
    await flush();
    return { button: button(), list: list() };
  }

  const active = (listEl: HTMLElement) =>
    listEl.querySelector("[data-active]")?.textContent?.trim();

  test("§7.20 Tab from the open list puts focus on the button before closing", async () => {
    const { button: btn, list: listEl } = await openPicker();
    expect(document.activeElement).toBe(listEl);
    press(listEl, "Tab");
    expect(document.activeElement).toBe(btn);
    expect(listEl.hasAttribute("hidden")).toBe(true);
  });

  test("§7.21 a repeated typeahead character cycles through its matches", async () => {
    const { list: listEl } = await openPicker(["r1", "r2", "r3", "m"], {
      "motion-labels": JSON.stringify({
        r1: "Reduce a lot",
        r2: "Reduce more",
        r3: "Reduce most",
        m: "Minimal",
      }),
      "default-value": "m",
    });
    press(listEl, "r");
    expect(active(listEl)).toBe("Reduce a lot");
    press(listEl, "r");
    expect(active(listEl)).toBe("Reduce more");
    press(listEl, "r");
    expect(active(listEl)).toBe("Reduce most");
  });

  test("§7.22 PageUp and PageDown move the cursor by ten, clamped", async () => {
    const many = Array.from(
      { length: 25 },
      (_, i) => `s${String(i).padStart(2, "0")}`,
    );
    const { list: listEl } = await openPicker(many);
    press(listEl, "PageDown");
    expect(active(listEl)).toBe("S10");
    press(listEl, "PageDown");
    expect(active(listEl)).toBe("S20");
    press(listEl, "PageDown");
    expect(active(listEl)).toBe("S24");
    press(listEl, "PageUp");
    expect(active(listEl)).toBe("S14");
  });

  test("§7.23 an empty list opens without aria-activedescendant", async () => {
    const { list: listEl } = await openPicker([]);
    expect(listEl.hasAttribute("hidden")).toBe(false);
    expect(listEl.getAttribute("aria-activedescendant")).toBeNull();
  });
});

describe("MotionPicker — idempotent apply (§7.24)", () => {
    test("§7.24 a listener that mirrors the value back does not re-enter apply", async () => {
        // Built by hand, not via mount(): the listener has to be attached
        // before the element connects, because connecting applies the
        // initial motion.
        const el = document.createElement("lily-motion-picker") as MotionPicker;
        el.setAttribute("label", "Motion");
        el.setAttribute("motions", MOTIONS.join(","));
        let calls = 0;
        el.addEventListener("motionchange", (event) => {
            calls += 1;
            if (calls > 50) return; // stop a runaway before the stack blows
            el.setAttribute("value", (event as CustomEvent).detail.motion);
        });
        document.body.appendChild(el);
        await flush();
        expect(calls).toBe(1);

        pick("reduce");
        await flush();
        expect(calls).toBe(2);
        expect(el.getAttribute("value")).toBe("reduce");
        expect(button().getAttribute("aria-expanded")).toBe("false");
        expect(list().hasAttribute("hidden")).toBe(true);

        el.remove();
    });
});

describe("pointer open survives the button content swap (regression)", () => {
  // Same defect family as theme-picker: opening replaceChildren()s the
  // button content, detaching the clicked icon span mid-event; the
  // document click handler must judge by composedPath(), not by
  // containment of the (now detached) target.
  test("clicking the icon span opens and STAYS open", async () => {
    const el = document.createElement("lily-motion-picker");
    el.setAttribute("label", "Motion");
    el.setAttribute("motions", "no-preference,reduce");
    document.body.appendChild(el);
    try {
      const icon = el.querySelector(".motion-picker-icon") as HTMLElement;
      icon.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));
      await Promise.resolve();
      const btn = el.querySelector(".motion-picker-button")!;
      expect(btn.getAttribute("aria-expanded")).toBe("true");
      expect(el.querySelector(".motion-picker-list")!.hasAttribute("hidden")).toBe(false);
    } finally {
      el.remove();
    }
  });
});
