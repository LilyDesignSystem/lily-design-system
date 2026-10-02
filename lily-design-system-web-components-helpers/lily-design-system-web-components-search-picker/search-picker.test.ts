import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import {
  RETURN_SYMBOL,
  SearchPicker,
  nextSearchPickerId,
  searchHref,
  type SearchPickerSearchDetail,
} from "./search-picker.js";

// Ensure the custom element is registered exactly once for the suite.
if (
  typeof customElements !== "undefined" &&
  !customElements.get("lily-search-picker")
) {
  customElements.define("lily-search-picker", SearchPicker);
}

const LABELS = {
  label: "Search this site",
  "input-label": "Search terms",
  "submit-label": "Search",
};

function flush(): Promise<void> {
  return new Promise((r) => setTimeout(r, 0));
}

function mount(
  attrs: Record<string, string> = {},
  tag = "lily-search-picker",
): SearchPicker {
  const el = document.createElement(tag) as SearchPicker;
  for (const [k, v] of Object.entries({ ...LABELS, ...attrs }))
    el.setAttribute(k, v);
  document.body.appendChild(el);
  return el;
}

const trigger = () =>
  document.body.querySelector<HTMLButtonElement>(".search-picker-button")!;
const panel = () =>
  document.body.querySelector<HTMLDivElement>(".search-picker-panel")!;
const form = () =>
  document.body.querySelector<HTMLFormElement>(".search-picker-form")!;
const input = () =>
  document.body.querySelector<HTMLInputElement>(".search-picker-input")!;
const submit = () =>
  document.body.querySelector<HTMLButtonElement>(".search-picker-submit")!;

function click(el: Element): void {
  el.dispatchEvent(
    new MouseEvent("click", { bubbles: true, cancelable: true, composed: true }),
  );
}

function press(el: Element, key: string): void {
  el.dispatchEvent(
    new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }),
  );
}

/** Type into the field: set its value and fire `input`, as a user would. */
function type(text: string): void {
  input().value = text;
  input().dispatchEvent(new Event("input", { bubbles: true }));
}

/** Submit the form as Return in the field would; returns dispatchEvent's result. */
function submitForm(): boolean {
  return form().dispatchEvent(
    new Event("submit", { bubbles: true, cancelable: true }),
  );
}

/** Mount with a spy `navigate`, open the panel, and return both. */
async function openPanel(attrs: Record<string, string> = {}) {
  const el = mount(attrs);
  const navigate = vi.fn();
  el.navigate = navigate;
  await flush();
  click(trigger());
  await flush();
  return { el, navigate };
}

beforeEach(() => {
  document.body.replaceChildren();
});

afterEach(() => {
  document.body.replaceChildren();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("<lily-search-picker> — structure (§7.1–§7.6)", () => {
  test("§7.1 renders a named disclosure button controlling the panel", async () => {
    mount();
    await flush();
    const btn = trigger();
    expect(btn.tagName).toBe("BUTTON");
    expect(btn.getAttribute("type")).toBe("button");
    expect(btn.getAttribute("aria-label")).toBe(LABELS.label);
    expect(btn.getAttribute("aria-expanded")).toBe("false");
    expect(btn.getAttribute("aria-controls")).toBe(panel().id);
    expect(panel().id).toMatch(/^search-picker-\d+-panel$/);
  });

  test("§7.2 the panel is hidden until the button is activated, and toggles", async () => {
    mount();
    await flush();
    expect(panel().hasAttribute("hidden")).toBe(true);
    click(trigger());
    expect(panel().hasAttribute("hidden")).toBe(false);
    expect(trigger().getAttribute("aria-expanded")).toBe("true");
    click(trigger());
    expect(panel().hasAttribute("hidden")).toBe(true);
    expect(trigger().getAttribute("aria-expanded")).toBe("false");
  });

  test("§7.3 the default icon is an aria-hidden magnifying-glass SVG", async () => {
    mount();
    await flush();
    const icon = document.body.querySelector(".search-picker-icon")!;
    expect(icon.tagName.toLowerCase()).toBe("svg");
    expect(icon.getAttribute("aria-hidden")).toBe("true");
    expect(icon.getAttribute("viewBox")).toBe("0 0 16 16");
    expect(icon.closest("button")).toBe(trigger());
    expect(icon.querySelector("circle")).not.toBeNull();
    expect(icon.querySelector("path")?.getAttribute("d")).toBe(
      "M10.5 10.5 14 14",
    );
  });

  test("§7.4 renderButtonContent replaces the icon and sees open + value", async () => {
    // Light DOM has no <slot>, so subclassing stands in for the
    // `children` snippet; it receives what Svelte passes as ChildArgs.
    class CustomSearchPicker extends SearchPicker {
      renderButtonContent(): Node {
        const span = document.createElement("span");
        span.setAttribute("data-testid", "custom");
        span.setAttribute("data-open", String(this.open));
        span.setAttribute("data-query", this.value);
        return span;
      }
    }
    if (!customElements.get("custom-search-picker")) {
      customElements.define("custom-search-picker", CustomSearchPicker);
    }
    mount({ value: "foo" }, "custom-search-picker");
    await flush();
    const custom = () =>
      document.body.querySelector<HTMLElement>('[data-testid="custom"]')!;
    expect(document.body.querySelector(".search-picker-icon")).toBeNull();
    expect(custom().closest("button")).toBe(trigger());
    expect(custom().getAttribute("data-open")).toBe("false");
    expect(custom().getAttribute("data-query")).toBe("foo");
    // It re-runs, so it stays current like a reactive snippet.
    click(trigger());
    expect(custom().getAttribute("data-open")).toBe("true");
    type("bar");
    expect(custom().getAttribute("data-query")).toBe("bar");
    // The base class's aria wiring survived.
    expect(trigger().getAttribute("aria-label")).toBe(LABELS.label);
  });

  test("§7.5 the panel holds a named search form, field, and submit button after the field", async () => {
    await openPanel();
    expect(form().closest(".search-picker-panel")).toBe(panel());
    expect(form().getAttribute("role")).toBe("search");
    expect(form().getAttribute("aria-label")).toBe(LABELS.label);
    expect(form().getAttribute("method")).toBe("get");
    expect(form().getAttribute("action")).toBe("/");
    expect(input().getAttribute("type")).toBe("search");
    expect(input().getAttribute("aria-label")).toBe(LABELS["input-label"]);
    expect(input().getAttribute("enterkeyhint")).toBe("search");
    expect(submit().getAttribute("type")).toBe("submit");
    expect(submit().getAttribute("aria-label")).toBe(LABELS["submit-label"]);
    expect(
      input().compareDocumentPosition(submit()) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  test("§7.6 the submit button shows ⏎ in an aria-hidden span", async () => {
    await openPanel();
    const symbol = submit().querySelector(".search-picker-submit-symbol")!;
    expect(symbol.tagName).toBe("SPAN");
    expect(symbol.textContent).toBe("⏎");
    expect(symbol.getAttribute("aria-hidden")).toBe("true");
  });
});

describe("<lily-search-picker> — searching (§7.7–§7.15)", () => {
  test("§7.7 opening focuses the search field with preventScroll", async () => {
    const focusSpy = vi.spyOn(HTMLElement.prototype, "focus");
    await openPanel();
    expect(document.activeElement).toBe(input());
    expect(focusSpy).toHaveBeenLastCalledWith({ preventScroll: true });
  });

  test("§7.8 Return in the field (form submit) navigates to /?<query>", async () => {
    const { navigate } = await openPanel();
    type("foo");
    // dispatchEvent returns false when cancelled: the native GET (which
    // would send /?name=value) must never run.
    expect(submitForm()).toBe(false);
    expect(navigate).toHaveBeenCalledWith("/?foo");
  });

  test("§7.9 clicking the submit button navigates the same way", async () => {
    const { navigate } = await openPanel();
    type("foo");
    // jsdom implements implicit submission from a submit button click.
    submit().click();
    expect(navigate).toHaveBeenCalledWith("/?foo");
  });

  test("§7.10 the query is trimmed and URI-encoded", async () => {
    const { navigate } = await openPanel();
    type("  foo bar ");
    submitForm();
    expect(navigate).toHaveBeenLastCalledWith("/?foo%20bar");
    click(trigger());
    type("a&b");
    submitForm();
    expect(navigate).toHaveBeenLastCalledWith("/?a%26b");
  });

  test("§7.11 an empty or whitespace-only query does nothing and stays open", async () => {
    const { navigate } = await openPanel();
    submitForm();
    type("   ");
    submitForm();
    expect(navigate).not.toHaveBeenCalled();
    expect(panel().hasAttribute("hidden")).toBe(false);
  });

  test("§7.12 action changes the path", async () => {
    const { navigate } = await openPanel({ action: "/search" });
    expect(form().getAttribute("action")).toBe("/search");
    type("foo");
    submitForm();
    expect(navigate).toHaveBeenCalledWith("/search?foo");
  });

  test("§7.13 onSearch fires with the query and href before navigate", async () => {
    const calls: string[] = [];
    const { el } = await openPanel();
    el.onSearch = (q, h) => calls.push(`search:${q}:${h}`);
    el.navigate = (h) => calls.push(`navigate:${h}`);
    type(" foo ");
    submitForm();
    expect(calls).toEqual(["search:foo:/?foo", "navigate:/?foo"]);
  });

  test("§7.14 without navigate, the default calls location.assign", async () => {
    const assign = vi.fn();
    vi.stubGlobal("location", { assign });
    mount();
    await flush();
    click(trigger());
    type("foo");
    submitForm();
    expect(assign).toHaveBeenCalledWith("/?foo");
  });

  test("§7.15 a search closes the panel", async () => {
    await openPanel();
    type("foo");
    submitForm();
    expect(panel().hasAttribute("hidden")).toBe(true);
    expect(trigger().getAttribute("aria-expanded")).toBe("false");
  });
});

describe("<lily-search-picker> — closing (§7.16–§7.18)", () => {
  test("§7.16 Escape closes and returns focus to the button with preventScroll", async () => {
    await openPanel();
    const focusSpy = vi.spyOn(HTMLElement.prototype, "focus");
    press(input(), "Escape");
    expect(panel().hasAttribute("hidden")).toBe(true);
    expect(document.activeElement).toBe(trigger());
    expect(focusSpy).toHaveBeenLastCalledWith({ preventScroll: true });
  });

  test("§7.17 clicking outside closes the panel", async () => {
    await openPanel();
    click(document.body);
    expect(panel().hasAttribute("hidden")).toBe(true);
  });

  test("§7.18 focus moving to an element outside the root closes the panel", async () => {
    const outside = document.createElement("button");
    document.body.appendChild(outside);
    await openPanel();
    input().dispatchEvent(
      new FocusEvent("focusout", { bubbles: true, relatedTarget: outside }),
    );
    expect(panel().hasAttribute("hidden")).toBe(true);
  });
});

describe("<lily-search-picker> — Safari focus regression (§7.24)", () => {
  test("§7.24 a focusout with no relatedTarget leaves the panel open, so ⏎ still searches", async () => {
    // Safari does not focus a <button> on click, so pressing ⏎ blurs the
    // field with relatedTarget = null and leaves document.activeElement on
    // <body>; closing then hid the panel before the click landed
    // (reproduced in real WebKit, 2026-10-02). Mirror that state exactly.
    const { navigate } = await openPanel();
    type("foo");
    (document.activeElement as HTMLElement | null)?.blur();
    expect(document.activeElement).toBe(document.body);
    input().dispatchEvent(
      new FocusEvent("focusout", { bubbles: true, relatedTarget: null }),
    );
    await flush();
    expect(panel().hasAttribute("hidden")).toBe(false);
    submit().click();
    expect(navigate).toHaveBeenCalledWith("/?foo");
  });
});

describe("<lily-search-picker> — value, exports, root (§7.19–§7.23)", () => {
  test("§7.19 an initial value pre-fills the field, and typing updates the property", async () => {
    const { el, navigate } = await openPanel({ value: "preset" });
    expect(input().value).toBe("preset");
    expect(el.value).toBe("preset");
    type("typed");
    expect(el.value).toBe("typed");
    // Typing never writes the attribute (native <input> semantics).
    expect(el.getAttribute("value")).toBe("preset");
    submitForm();
    expect(navigate).toHaveBeenCalledWith("/?typed");
  });

  test("§7.20 searchHref builds the destination the element uses", () => {
    expect(searchHref("foo")).toBe("/?foo");
    expect(searchHref(" foo bar ")).toBe("/?foo%20bar");
    expect(searchHref("a&b")).toBe("/?a%26b");
    expect(searchHref("foo", "/search")).toBe("/search?foo");
  });

  test("§7.21 RETURN_SYMBOL is the bare ⏎ (U+23CE)", () => {
    expect(RETURN_SYMBOL).toBe("⏎");
    expect(RETURN_SYMBOL.codePointAt(0)).toBe(0x23ce);
    expect(RETURN_SYMBOL.length).toBe(1);
  });

  test("§7.22 class is appended to search-picker on the rendered root", async () => {
    mount({ class: "site-search" });
    await flush();
    const root = document.body.querySelector("div.search-picker")!;
    expect(root.className).toBe("search-picker site-search");
    expect(root.parentElement?.tagName).toBe("LILY-SEARCH-PICKER");
  });

  test("§7.23 no user-facing text of its own beyond the hidden ⏎", async () => {
    await openPanel();
    expect(input().hasAttribute("placeholder")).toBe(false);
    const root = document.body.querySelector(".search-picker")!;
    const texts: string[] = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const t = walker.currentNode.textContent!.trim();
      if (t) texts.push(t);
    }
    expect(texts).toEqual(["⏎"]);
  });
});

describe("<lily-search-picker> — custom-element surface (§7.25–§7.31)", () => {
  test("§7.25 a search dispatches a bubbling `search` event after onSearch, before navigate", async () => {
    const calls: string[] = [];
    const seen: SearchPickerSearchDetail[] = [];
    document.body.addEventListener("search", (e) => {
      const detail = (e as CustomEvent<SearchPickerSearchDetail>).detail;
      seen.push(detail);
      calls.push("event");
    });
    const { el } = await openPanel({ action: "/find" });
    el.onSearch = () => calls.push("callback");
    el.navigate = () => calls.push("navigate");
    type(" foo ");
    submitForm();
    expect(seen).toEqual([{ query: "foo", href: "/find?foo" }]);
    expect(calls).toEqual(["callback", "event", "navigate"]);
  });

  test("§7.26 attributes and properties mirror each other", async () => {
    const el = mount();
    await flush();
    expect(el.label).toBe(LABELS.label);
    expect(el.inputLabel).toBe(LABELS["input-label"]);
    expect(el.submitLabel).toBe(LABELS["submit-label"]);
    expect(el.action).toBe("/");
    el.inputLabel = "Terms";
    el.submitLabel = "Go";
    el.placeholder = "Search…";
    el.action = "/search";
    expect(el.getAttribute("input-label")).toBe("Terms");
    expect(el.getAttribute("submit-label")).toBe("Go");
    expect(el.getAttribute("placeholder")).toBe("Search…");
    expect(el.getAttribute("action")).toBe("/search");
    el.action = "";
    expect(el.hasAttribute("action")).toBe(false);
    expect(el.action).toBe("/");
    el.value = "written";
    expect(input().value).toBe("written");
    expect(el.value).toBe("written");
  });

  test("§7.27 attribute changes sync in place without losing focus; unchanged writes are no-ops", async () => {
    const { el } = await openPanel();
    const field = input();
    expect(document.activeElement).toBe(field);
    el.setAttribute("label", "Find");
    el.setAttribute("placeholder", "Search…");
    el.setAttribute("submit-label", "Go");
    // Same nodes, still open, focus still in the field.
    expect(input()).toBe(field);
    expect(document.activeElement).toBe(field);
    expect(panel().hasAttribute("hidden")).toBe(false);
    expect(trigger().getAttribute("aria-label")).toBe("Find");
    expect(form().getAttribute("aria-label")).toBe("Find");
    expect(field.getAttribute("placeholder")).toBe("Search…");
    expect(submit().getAttribute("aria-label")).toBe("Go");
    // Re-writing an unchanged `value` attribute must not clobber what
    // the user has typed since.
    el.setAttribute("value", "seed");
    type("typed");
    el.setAttribute("value", "seed");
    expect(el.value).toBe("typed");
    expect(field.value).toBe("typed");
  });

  test("§7.28 disconnecting removes the document click listener", async () => {
    const { el } = await openPanel();
    expect(el.open).toBe(true);
    el.remove();
    click(document.body);
    expect(el.open).toBe(true);
  });

  test("§7.29 module is import-safe under SSR", async () => {
    const original = (globalThis as any).customElements;
    delete (globalThis as any).customElements;
    try {
      const mod = await import("./index.js");
      expect(mod.SearchPicker).toBeDefined();
      expect(mod.RETURN_SYMBOL).toBe("⏎");
    } finally {
      (globalThis as any).customElements = original;
    }
  });

  test("§7.30 a pointer click on the icon opens and STAYS open", async () => {
    // Opening replaceChildren()s the button content, detaching the
    // clicked icon mid-event; the document click handler must judge by
    // composedPath(), not by containment of the (now detached) target.
    const el = mount();
    await flush();
    const icon = el.querySelector(".search-picker-icon")!;
    click(icon);
    await flush();
    expect(trigger().getAttribute("aria-expanded")).toBe("true");
    expect(panel().hasAttribute("hidden")).toBe(false);
  });

  test("§7.31 nothing is written to localStorage or the document root", async () => {
    localStorage.clear();
    const rootAttrs = document.documentElement.getAttributeNames().join(",");
    const { navigate } = await openPanel();
    type("foo");
    submitForm();
    expect(navigate).toHaveBeenCalled();
    expect(localStorage.length).toBe(0);
    expect(document.documentElement.getAttributeNames().join(",")).toBe(
      rootAttrs,
    );
  });

  test("nextSearchPickerId mints unique, prefixed ids", () => {
    const a = nextSearchPickerId();
    const b = nextSearchPickerId();
    expect(a).toMatch(/^search-picker-\d+$/);
    expect(a).not.toBe(b);
  });
});
