// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import nunjucks from "nunjucks";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import {
  autoInit,
  initSearchPicker,
  nextSearchPickerId,
  RETURN_SYMBOL,
  searchHref,
} from "./search-picker.client.js";

// ---------------------------------------------------------------------
// Nunjucks env that can resolve `./search-picker.njk` from this dir.
// ---------------------------------------------------------------------

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = nunjucks.configure(__dirname, {
  autoescape: true,
  throwOnUndefined: false,
  trimBlocks: true,
  lstripBlocks: true,
});

const LABELS = {
  label: "Search this site",
  inputLabel: "Search terms",
  submitLabel: "Search",
};

function renderMacro(opts: Record<string, unknown>): string {
  const src =
    `{% from "./search-picker.njk" import searchPicker %}` +
    `{{ searchPicker(opts) }}`;
  return env.renderString(src, { opts });
}

function renderMacroWithCaller(
  opts: Record<string, unknown>,
  body: string,
): string {
  const src =
    `{% from "./search-picker.njk" import searchPicker %}` +
    `{% call(args) searchPicker(opts) %}${body}{% endcall %}`;
  return env.renderString(src, { opts });
}

function mountIntoBody(html: string): HTMLElement {
  document.body.innerHTML = html;
  return document.body.querySelector(
    "[data-lily-search-picker-root]",
  ) as HTMLElement;
}

type Parts = {
  root: HTMLElement;
  button: HTMLButtonElement;
  panel: HTMLElement;
  form: HTMLFormElement;
  input: HTMLInputElement;
  submit: HTMLButtonElement;
  navigate: ReturnType<typeof vi.fn>;
  api: ReturnType<typeof initSearchPicker>;
};

/** Render + mount + init (with a spy `navigate`), returning the parts. */
function setup(
  opts: Record<string, unknown> = {},
  initOpts: Record<string, unknown> = {},
): Parts {
  const root = mountIntoBody(renderMacro({ ...LABELS, ...opts }));
  const navigate = vi.fn();
  const api = initSearchPicker(root, { navigate, ...initOpts });
  return {
    root,
    button: root.querySelector(".search-picker-button") as HTMLButtonElement,
    panel: root.querySelector(".search-picker-panel") as HTMLElement,
    form: root.querySelector(".search-picker-form") as HTMLFormElement,
    input: root.querySelector(".search-picker-input") as HTMLInputElement,
    submit: root.querySelector(".search-picker-submit") as HTMLButtonElement,
    navigate,
    api,
  };
}

/** setup() and open the panel. */
function openPanel(
  opts: Record<string, unknown> = {},
  initOpts: Record<string, unknown> = {},
): Parts {
  const parts = setup(opts, initOpts);
  click(parts.button);
  return parts;
}

function click(el: Element): void {
  el.dispatchEvent(
    new window.MouseEvent("click", { bubbles: true, cancelable: true }),
  );
}

function keydown(el: Element, key: string): void {
  el.dispatchEvent(
    new window.KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }),
  );
}

/** Submit the form the way Return in the field does; returns !cancelled. */
function submitForm(form: HTMLFormElement): boolean {
  return form.dispatchEvent(
    new window.Event("submit", { bubbles: true, cancelable: true }),
  );
}

/** Type into the field. */
function type(input: HTMLInputElement, text: string): void {
  input.value = text;
  input.dispatchEvent(new window.Event("input", { bubbles: true }));
}

beforeEach(() => {
  document.body.innerHTML = "";
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

// =====================================================================
// §7.1–§7.6 — structure
// =====================================================================

describe("SearchPicker — structure (§7.1–§7.6)", () => {
  test("§7.1 renders a named disclosure button controlling the panel", () => {
    const { button, panel } = setup();
    expect(button.getAttribute("type")).toBe("button");
    expect(button.getAttribute("aria-label")).toBe(LABELS.label);
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(button.getAttribute("aria-controls")).toBe(panel.id);
    expect(panel.id).not.toBe("");
  });

  test("§7.2 the panel is hidden until the button is activated, and toggles", () => {
    const { button, panel } = setup();
    expect(panel.hasAttribute("hidden")).toBe(true);
    click(button);
    expect(panel.hasAttribute("hidden")).toBe(false);
    expect(button.getAttribute("aria-expanded")).toBe("true");
    click(button);
    expect(panel.hasAttribute("hidden")).toBe(true);
    expect(button.getAttribute("aria-expanded")).toBe("false");
  });

  test("§7.3 the default icon is an aria-hidden magnifying-glass SVG", () => {
    const { root } = setup();
    const icon = root.querySelector(".search-picker-icon")!;
    expect(icon.tagName.toLowerCase()).toBe("svg");
    expect(icon.getAttribute("aria-hidden")).toBe("true");
    expect(icon.closest("button")?.className).toBe("search-picker-button");
    expect(icon.getAttribute("viewBox")).toBe("0 0 16 16");
    expect(icon.querySelector("circle")).not.toBeNull();
    expect(icon.querySelector("path")?.getAttribute("d")).toBe(
      "M10.5 10.5 14 14",
    );
  });

  test("§7.4 a {% call %} body replaces the icon and receives ChildArgs", () => {
    const root = mountIntoBody(
      renderMacroWithCaller(
        { ...LABELS, value: "foo" },
        `<span data-testid="custom" data-open="{{ args.open }}" data-query="{{ args.query }}"></span>`,
      ),
    );
    const custom = root.querySelector("[data-testid=custom]")!;
    expect(custom.closest("button")?.className).toBe("search-picker-button");
    expect(root.querySelector(".search-picker-icon")).toBeNull();
    expect(custom.getAttribute("data-open")).toBe("false");
    expect(custom.getAttribute("data-query")).toBe("foo");
  });

  test("§7.5 the panel holds a named search form, field, and submit button after the field", () => {
    const { panel, form, input, submit } = openPanel();
    expect(panel.contains(form)).toBe(true);
    expect(form.getAttribute("role")).toBe("search");
    expect(form.getAttribute("aria-label")).toBe(LABELS.label);
    expect(form.getAttribute("method")).toBe("get");
    expect(input.getAttribute("type")).toBe("search");
    expect(input.getAttribute("aria-label")).toBe(LABELS.inputLabel);
    expect(input.getAttribute("enterkeyhint")).toBe("search");
    expect(submit.getAttribute("type")).toBe("submit");
    expect(submit.getAttribute("aria-label")).toBe(LABELS.submitLabel);
    expect(
      input.compareDocumentPosition(submit) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  test("§7.6 the submit button shows ⏎ in an aria-hidden span", () => {
    const { submit } = openPanel();
    const symbol = submit.querySelector(".search-picker-submit-symbol")!;
    expect(symbol.textContent).toBe("⏎");
    expect(symbol.getAttribute("aria-hidden")).toBe("true");
  });
});

// =====================================================================
// §7.7–§7.15 — searching
// =====================================================================

describe("SearchPicker — searching (§7.7–§7.15)", () => {
  test("§7.7 opening focuses the search field with preventScroll", () => {
    const focusSpy = vi.spyOn(window.HTMLElement.prototype, "focus");
    const { input } = openPanel();
    expect(document.activeElement).toBe(input);
    expect(focusSpy).toHaveBeenLastCalledWith({ preventScroll: true });
  });

  test("§7.8 Return in the field (form submit) navigates to /?<query>", () => {
    const { navigate, input, form } = openPanel();
    type(input, "foo");
    // dispatchEvent returns false when cancelled: the native GET (which
    // would send /?name=value) must never run.
    expect(submitForm(form)).toBe(false);
    expect(navigate).toHaveBeenCalledWith("/?foo");
  });

  test("§7.9 clicking the submit button navigates the same way", () => {
    const { navigate, input, submit } = openPanel();
    type(input, "foo");
    click(submit);
    expect(navigate).toHaveBeenCalledWith("/?foo");
  });

  test("§7.10 the query is trimmed and URI-encoded", () => {
    const { navigate, input, form, button } = openPanel();
    type(input, "  foo bar ");
    submitForm(form);
    expect(navigate).toHaveBeenLastCalledWith("/?foo%20bar");
    click(button);
    type(input, "a&b");
    submitForm(form);
    expect(navigate).toHaveBeenLastCalledWith("/?a%26b");
  });

  test("§7.11 an empty or whitespace-only query does nothing and stays open", () => {
    const { navigate, input, form, panel } = openPanel();
    expect(submitForm(form)).toBe(false);
    type(input, "   ");
    expect(submitForm(form)).toBe(false);
    expect(navigate).not.toHaveBeenCalled();
    expect(panel.hasAttribute("hidden")).toBe(false);
  });

  test("§7.12 action changes the path", () => {
    const { navigate, input, form } = openPanel({ action: "/search" });
    expect(form.getAttribute("action")).toBe("/search");
    type(input, "foo");
    submitForm(form);
    expect(navigate).toHaveBeenCalledWith("/search?foo");
  });

  test("§7.12 an init-time action wins over the rendered one", () => {
    const { navigate, input, form } = openPanel(
      { action: "/search" },
      { action: "/find" },
    );
    type(input, "foo");
    submitForm(form);
    expect(navigate).toHaveBeenCalledWith("/find?foo");
  });

  test("§7.13 onSearch fires with the query and href before navigate", () => {
    const calls: string[] = [];
    const onSearch = vi.fn((q: string, h: string) =>
      calls.push(`search:${q}:${h}`),
    );
    const navigate = vi.fn((h: string) => calls.push(`navigate:${h}`));
    const { input, form } = openPanel({}, { onSearch, navigate });
    type(input, " foo ");
    submitForm(form);
    expect(calls).toEqual(["search:foo:/?foo", "navigate:/?foo"]);
  });

  test("§7.14 without navigate, the default calls location.assign", () => {
    const assign = vi.fn();
    vi.stubGlobal("location", { assign });
    const root = mountIntoBody(renderMacro(LABELS));
    initSearchPicker(root);
    click(root.querySelector(".search-picker-button")!);
    type(root.querySelector(".search-picker-input") as HTMLInputElement, "foo");
    submitForm(root.querySelector(".search-picker-form") as HTMLFormElement);
    expect(assign).toHaveBeenCalledWith("/?foo");
  });

  test("§7.15 a search closes the panel", () => {
    const { input, form, panel, button } = openPanel();
    type(input, "foo");
    submitForm(form);
    expect(panel.hasAttribute("hidden")).toBe(true);
    expect(button.getAttribute("aria-expanded")).toBe("false");
  });
});

// =====================================================================
// §7.16–§7.18 — closing
// =====================================================================

describe("SearchPicker — closing (§7.16–§7.18)", () => {
  test("§7.16 Escape closes and returns focus to the button with preventScroll", () => {
    const { input, panel, button } = openPanel();
    const focusSpy = vi.spyOn(window.HTMLElement.prototype, "focus");
    keydown(input, "Escape");
    expect(panel.hasAttribute("hidden")).toBe(true);
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(button);
    expect(focusSpy).toHaveBeenLastCalledWith({ preventScroll: true });
  });

  test("§7.17 clicking outside closes the panel", () => {
    const { panel } = openPanel();
    click(document.body);
    expect(panel.hasAttribute("hidden")).toBe(true);
  });

  test("§7.17 clicking inside the panel does not close it", () => {
    const { panel, input } = openPanel();
    click(input);
    expect(panel.hasAttribute("hidden")).toBe(false);
  });

  test("§7.18 focus moving to an element outside the root closes the panel", () => {
    const { input, panel, root } = openPanel();
    const outside = document.createElement("button");
    document.body.appendChild(outside);
    input.dispatchEvent(
      new window.FocusEvent("focusout", { bubbles: true, relatedTarget: outside }),
    );
    expect(panel.hasAttribute("hidden")).toBe(true);
    // Focus moving within the root does not close it.
    click(root.querySelector(".search-picker-button")!);
    input.dispatchEvent(
      new window.FocusEvent("focusout", {
        bubbles: true,
        relatedTarget: root.querySelector(".search-picker-submit"),
      }),
    );
    expect(panel.hasAttribute("hidden")).toBe(false);
  });
});

// =====================================================================
// §7.19–§7.24 — value, exports, root
// =====================================================================

describe("SearchPicker — value, exports, root (§7.19–§7.24)", () => {
  test("§7.19 an initial value pre-fills the field, and typing replaces it", () => {
    const { navigate, input, form } = openPanel({ value: "preset" });
    expect(input.value).toBe("preset");
    type(input, "typed");
    submitForm(form);
    expect(navigate).toHaveBeenCalledWith("/?typed");
  });

  test("§7.20 searchHref builds the destination the component uses", () => {
    expect(searchHref("foo")).toBe("/?foo");
    expect(searchHref(" foo bar ")).toBe("/?foo%20bar");
    expect(searchHref("foo", "/search")).toBe("/search?foo");
    const { navigate, input, form } = openPanel();
    type(input, " a&b c ");
    submitForm(form);
    expect(navigate).toHaveBeenCalledWith(searchHref(" a&b c "));
  });

  test("§7.21 RETURN_SYMBOL is the bare ⏎ (U+23CE)", () => {
    expect(RETURN_SYMBOL).toBe("⏎");
    expect(RETURN_SYMBOL.codePointAt(0)).toBe(0x23ce);
    expect(RETURN_SYMBOL.length).toBe(1);
    // The macro renders the same character the client exports.
    const { submit } = setup();
    expect(submit.textContent).toBe(RETURN_SYMBOL);
  });

  test("§7.22 classes and attributes land on the root", () => {
    const { root } = setup({
      classes: "site-search",
      attributes: { "data-testid": "root", id: "top-search" },
    });
    expect(root.className).toBe("search-picker site-search");
    expect(root.getAttribute("data-testid")).toBe("root");
    expect(root.id).toBe("top-search");
  });

  test("§7.23 no user-facing text of its own beyond the hidden ⏎ and the tooltip's label", () => {
    const { input, root } = openPanel();
    expect(input.hasAttribute("placeholder")).toBe(false);
    // The tooltip repeats the button's label; it is not new text.
    root.querySelector(".search-picker-tooltip")!.remove();
    const texts: string[] = [];
    const walker = document.createTreeWalker(root, window.NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const t = walker.currentNode.textContent!.trim();
      if (t) texts.push(t);
    }
    expect(texts).toEqual(["⏎"]);
  });

  test("§7.23 a supplied placeholder is rendered verbatim", () => {
    const { input } = setup({ placeholder: "Search…" });
    expect(input.getAttribute("placeholder")).toBe("Search…");
  });

  test("§7.24 a focusout with no relatedTarget leaves the panel open, so the ⏎ click still lands", () => {
    // Safari does not focus a <button> on click: pressing ⏎ blurs the
    // field with relatedTarget = null, and the click arrives after.
    const { input, panel, submit, navigate } = openPanel();
    type(input, "foo");
    input.dispatchEvent(
      new window.FocusEvent("focusout", { bubbles: true, relatedTarget: null }),
    );
    expect(panel.hasAttribute("hidden")).toBe(false);
    click(submit);
    expect(navigate).toHaveBeenCalledWith("/?foo");
  });
});

// =====================================================================
// §7.25–§7.27 — Nunjucks surface
// =====================================================================

describe("SearchPicker — Nunjucks surface (§7.25–§7.27)", () => {
  test("§7.25 ids are deterministic and derived from name / id", () => {
    const a = setup();
    expect(a.panel.id).toBe("search-picker-search-panel");
    expect(a.input.id).toBe("search-picker-search-input");
    const b = setup({ name: "header" });
    expect(b.panel.id).toBe("search-picker-header-panel");
    expect(b.button.getAttribute("aria-controls")).toBe(b.panel.id);
    const c = setup({ id: "custom" });
    expect(c.panel.id).toBe("custom-panel");
    expect(c.button.getAttribute("aria-controls")).toBe("custom-panel");
    // Rendering twice gives byte-identical output (SSR-safe).
    expect(renderMacro(LABELS)).toBe(renderMacro(LABELS));
  });

  test("§7.26 autoInit wires every root on the page", () => {
    document.body.innerHTML =
      renderMacro({ ...LABELS, name: "one" }) +
      renderMacro({ ...LABELS, name: "two" });
    const navigate = vi.fn();
    const apis = autoInit({ navigate });
    expect(apis).toHaveLength(2);
    const roots = document.querySelectorAll("[data-lily-search-picker-root]");
    for (const root of Array.from(roots)) {
      click(root.querySelector(".search-picker-button")!);
      expect(
        root.querySelector(".search-picker-panel")!.hasAttribute("hidden"),
      ).toBe(false);
    }
  });

  test("§7.26 initSearchPicker is inert on a missing or foreign root", () => {
    expect(() => initSearchPicker(null as any)).not.toThrow();
    const foreign = document.createElement("div");
    const api = initSearchPicker(foreign);
    expect(() => {
      api.open();
      api.close();
      api.search("foo");
      api.destroy();
    }).not.toThrow();
  });

  test("§7.26 destroy() removes the listeners", () => {
    const { api, button, panel } = setup();
    api.destroy();
    click(button);
    expect(panel.hasAttribute("hidden")).toBe(true);
  });

  test("§7.26 the returned api opens, closes, and searches", () => {
    const { api, panel, navigate } = setup();
    api.open();
    expect(panel.hasAttribute("hidden")).toBe(false);
    api.close();
    expect(panel.hasAttribute("hidden")).toBe(true);
    api.search(" foo ");
    expect(navigate).toHaveBeenCalledWith("/?foo");
  });

  test("§7.27 nextSearchPickerId mints stable, incrementing, SSR-safe ids", () => {
    const a = nextSearchPickerId();
    const b = nextSearchPickerId();
    expect(a).toMatch(/^search-picker-\d+$/);
    expect(b).toMatch(/^search-picker-\d+$/);
    expect(Number(b.split("-").pop())).toBe(Number(a.split("-").pop()) + 1);
  });
});

// =====================================================================
// §6 — degradation without JavaScript
// =====================================================================

describe("SearchPicker — no-JS degradation (§6)", () => {
  test("§6 the panel stays hidden and the button is inert without the client", () => {
    const root = mountIntoBody(renderMacro(LABELS));
    const button = root.querySelector(".search-picker-button")!;
    click(button);
    expect(root.querySelector(".search-picker-panel")!.hasAttribute("hidden")).toBe(true);
    expect(button.getAttribute("aria-expanded")).toBe("false");
  });

  test("§6 the macro is pure: no document, storage, or navigator access", () => {
    const before = document.documentElement.outerHTML;
    const html = renderMacro(LABELS);
    expect(document.documentElement.outerHTML).toBe(before);
    expect(html).not.toMatch(/localStorage|data-theme|data-text-size/);
  });
});

// =====================================================================
// Tooltip (§7.28–§7.34): purely visual, hoverable, never over the popup
// =====================================================================

describe("SearchPicker — tooltip (§7.28–§7.35)", () => {
  function tooltipSetup() {
    const { root } = setup();
    const button = root.querySelector(".search-picker-button") as HTMLButtonElement;
    const tip = root.querySelector(".search-picker-tooltip") as HTMLElement;
    return { root, button, tip };
  }
  const mouse = (el: Element, type: string) =>
    el.dispatchEvent(new window.MouseEvent(type, { bubbles: false }));
  const flushObservers = () => new Promise<void>((r) => setTimeout(r, 0));

  test("§7.28 renders a role=tooltip sibling right after the button holding the label, hidden at rest, not aria-describedby-linked", () => {
    const { root, button, tip } = tooltipSetup();
    expect(tip.getAttribute("role")).toBe("tooltip");
    expect(tip.tagName).toBe("DIV");
    expect(tip.textContent).toBe(button.getAttribute("aria-label"));
    expect(tip.hasAttribute("hidden")).toBe(true);
    expect(tip.id).toBeTruthy();
    expect(root.querySelectorAll("#" + tip.id)).toHaveLength(1);
    expect(button.nextElementSibling).toBe(tip);
    expect(button.hasAttribute("aria-describedby")).toBe(false);
  });

  test("§7.29 pointer over the button shows it; leaving hides it", () => {
    const { button, tip } = tooltipSetup();
    mouse(button, "mouseenter");
    expect(tip.hasAttribute("hidden")).toBe(false);
    mouse(button, "mouseleave");
    expect(tip.hasAttribute("hidden")).toBe(true);
  });

  test("§7.30 it stays visible while the pointer is over the tooltip itself", () => {
    const { button, tip } = tooltipSetup();
    mouse(button, "mouseenter");
    mouse(button, "mouseleave");
    mouse(tip, "mouseenter");
    expect(tip.hasAttribute("hidden")).toBe(false);
    mouse(tip, "mouseleave");
    expect(tip.hasAttribute("hidden")).toBe(true);
  });

  test("§7.31 keyboard focus shows it; blur hides it", () => {
    const { button, tip } = tooltipSetup();
    // jsdom has no input-modality tracking; stand in for the keyboard.
    vi.spyOn(button, "matches").mockImplementation((q) => q === ":focus-visible");
    button.focus();
    expect(tip.hasAttribute("hidden")).toBe(false);
    button.blur();
    expect(tip.hasAttribute("hidden")).toBe(true);
  });

  test("§7.31 mouse-induced focus (not :focus-visible) does not show it", () => {
    const { button, tip } = tooltipSetup();
    vi.spyOn(button, "matches").mockReturnValue(false);
    button.focus();
    expect(tip.hasAttribute("hidden")).toBe(true);
  });

  test("§7.32 Escape dismisses it without moving focus; re-entering shows it again", () => {
    const { button, tip } = tooltipSetup();
    button.focus();
    mouse(button, "mouseenter");
    expect(tip.hasAttribute("hidden")).toBe(false);
    button.dispatchEvent(
      new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }),
    );
    expect(tip.hasAttribute("hidden")).toBe(true);
    expect(document.activeElement).toBe(button);
    mouse(button, "mouseleave");
    mouse(button, "mouseenter");
    expect(tip.hasAttribute("hidden")).toBe(false);
  });

  test("§7.33 it is never shown while the panel is open", async () => {
    const { button, tip } = tooltipSetup();
    mouse(button, "mouseenter");
    expect(tip.hasAttribute("hidden")).toBe(false);
    button.dispatchEvent(new window.MouseEvent("click", { bubbles: true, cancelable: true }));
    await flushObservers();
    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(tip.hasAttribute("hidden")).toBe(true);
    mouse(button, "mouseenter");
    expect(tip.hasAttribute("hidden")).toBe(true);
  });

  test("§7.34 initialising twice does not double-wire the tooltip", () => {
    const { root, button, tip } = tooltipSetup();
    const add = vi.spyOn(button, "addEventListener");
    const remove = vi.spyOn(button, "removeEventListener");
    // A second init of the same root replaces, not adds to, the first
    // tooltip wiring: the old listeners come off as the new ones go on.
    initSearchPicker(root);
    const count = (spy: typeof add) =>
      spy.mock.calls.filter((c) => c[0] === "mouseenter").length;
    expect(count(add)).toBe(1);
    expect(count(remove)).toBe(1);
    mouse(button, "mouseenter");
    expect(tip.hasAttribute("hidden")).toBe(false);
    mouse(button, "mouseleave");
    expect(tip.hasAttribute("hidden")).toBe(true);
    add.mockRestore();
    remove.mockRestore();
  });

  test("§7.35 pointer hover shows the tooltip with focus elsewhere; Escape on document.body dismisses it", () => {
    const { button, tip } = tooltipSetup();
    const other = document.createElement("div");
    other.tabIndex = -1;
    document.body.appendChild(other);
    other.focus();
    mouse(button, "mouseenter");
    expect(tip.hasAttribute("hidden")).toBe(false);
    expect(document.activeElement).not.toBe(button);
    const esc = () =>
      new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true });
    const ev = esc();
    document.body.dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(false);
    expect(tip.hasAttribute("hidden")).toBe(true);
    expect(document.activeElement).toBe(other);
    // Dismissal resets on re-entry, and Escape on another element works too.
    mouse(button, "mouseleave");
    mouse(button, "mouseenter");
    expect(tip.hasAttribute("hidden")).toBe(false);
    other.dispatchEvent(esc());
    expect(tip.hasAttribute("hidden")).toBe(true);
    other.remove();
  });

  test("§7.35 the document keydown listener exists only while the tooltip is visible and is gone after hide and re-init", () => {
    const { root, button, tip } = tooltipSetup();
    const add = vi.spyOn(document, "addEventListener");
    const remove = vi.spyOn(document, "removeEventListener");
    const keydowns = (spy: typeof add) =>
      spy.mock.calls.filter((c) => c[0] === "keydown").length;
    expect(keydowns(add)).toBe(0);
    mouse(button, "mouseenter");
    expect(keydowns(add)).toBe(1);
    mouse(tip, "mouseenter"); // still visible: no second listener
    expect(keydowns(add)).toBe(1);
    mouse(button, "mouseleave");
    mouse(tip, "mouseleave");
    expect(tip.hasAttribute("hidden")).toBe(true);
    expect(keydowns(remove)).toBe(1);
    // Escape while hidden does nothing harmful.
    document.body.dispatchEvent(
      new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    expect(tip.hasAttribute("hidden")).toBe(true);
    // Re-initialising while visible removes the old listener.
    mouse(button, "mouseenter");
    expect(keydowns(add)).toBe(2);
    initSearchPicker(root);
    expect(keydowns(remove)).toBe(2);
    add.mockRestore();
    remove.mockRestore();
  });
});
