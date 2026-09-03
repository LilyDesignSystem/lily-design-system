// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import nunjucks from "nunjucks";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import {
  autoInit,
  initMotionPicker,
  motionName,
  prefersReducedMotion,
} from "./motion-picker.client.js";

// ---------------------------------------------------------------------
// Nunjucks env that can resolve `./motion-picker.njk` from this dir.
// ---------------------------------------------------------------------

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = nunjucks.configure(__dirname, {
  autoescape: true,
  throwOnUndefined: false,
  trimBlocks: true,
  lstripBlocks: true,
});

const MOTIONS = ["no-preference", "reduce"];

function renderMacro(opts: Record<string, unknown>): string {
  const src =
    `{% from "./motion-picker.njk" import motionPicker %}` +
    `{{ motionPicker(opts) }}`;
  return env.renderString(src, { opts });
}

function renderMacroWithCaller(
  opts: Record<string, unknown>,
  body: string,
): string {
  const src =
    `{% from "./motion-picker.njk" import motionPicker %}` +
    `{% call motionPicker(opts) %}${body}{% endcall %}`;
  return env.renderString(src, { opts });
}

function mountIntoBody(html: string): HTMLElement {
  document.body.innerHTML = html;
  return document.body.querySelector(
    "[data-lily-motion-picker-root]",
  ) as HTMLElement;
}

type Parts = {
  root: HTMLElement;
  button: HTMLButtonElement;
  list: HTMLElement;
  options: HTMLElement[];
  input: HTMLInputElement;
};

function partsOf(root: HTMLElement): Parts {
  return {
    root,
    button: root.querySelector(
      ".motion-picker-button",
    ) as HTMLButtonElement,
    list: root.querySelector(".motion-picker-list") as HTMLElement,
    options: Array.from(
      root.querySelectorAll<HTMLElement>(".motion-picker-option"),
    ),
    input: root.querySelector(
      "[data-lily-motion-picker-input]",
    ) as HTMLInputElement,
  };
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

/** Render + mount + init in one step, returning the DOM parts. */
function setup(
  opts: Record<string, unknown> = {},
  initOpts: Record<string, unknown> = {},
) {
  const root = mountIntoBody(
    renderMacro({
      label: "Motion",
      motions: MOTIONS,
      ...opts,
    }),
  );
  const controller = initMotionPicker(root, initOpts);
  return { ...partsOf(root), controller };
}

function key(el: Element, k: string, init: KeyboardEventInit = {}) {
  el.dispatchEvent(
    new KeyboardEvent("keydown", { key: k, bubbles: true, ...init }),
  );
}

function click(el: Element) {
  el.dispatchEvent(new MouseEvent("click", { bubbles: true }));
}

function resetRoot(): void {
  document.documentElement.removeAttribute("data-motion");
}

beforeEach(() => {
  resetRoot();
  document.body.innerHTML = "";
  mockReducedMotion(false);
  try {
    localStorage.clear();
  } catch {
    /* ignore */
  }
});

afterEach(() => {
  resetRoot();
  vi.restoreAllMocks();
});

describe("MotionPicker — macro markup contract (§7.1–§7.6)", () => {
  test("§7.1 macro renders a div root containing a button that controls a listbox", () => {
    const root = mountIntoBody(
      renderMacro({ label: "Motion", motions: MOTIONS }),
    );
    expect(root.tagName).toBe("DIV");
    expect(root.classList.contains("motion-picker")).toBe(true);

    const { button, list } = partsOf(root);
    expect(button.tagName).toBe("BUTTON");
    expect(button.getAttribute("type")).toBe("button");
    expect(button.getAttribute("aria-haspopup")).toBe("listbox");
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(button.getAttribute("aria-controls")).toBe(list.id);
    expect(list.getAttribute("role")).toBe("listbox");
    expect(list.getAttribute("tabindex")).toBe("-1");
  });

  test("§7.1 the button renders the pause glyph, hidden from assistive tech", () => {
    const root = mountIntoBody(
      renderMacro({ label: "Motion", motions: MOTIONS }),
    );
    const icon = root.querySelector(".motion-picker-icon") as HTMLElement;
    // U+23F8 PAUSE SIGN + U+FE0E (text presentation).
    expect(icon.textContent).toBe("⏸︎");
    expect(icon.getAttribute("aria-hidden")).toBe("true");
    // The glyph must never be the accessible name.
    const button = root.querySelector(".motion-picker-button")!;
    expect(button.textContent).not.toBe(button.getAttribute("aria-label"));
  });

  test("§7.2 aria-label names both the button and the listbox", () => {
    const root = mountIntoBody(
      renderMacro({ label: "Choose motion", motions: MOTIONS }),
    );
    const { button, list } = partsOf(root);
    expect(button.getAttribute("aria-label")).toBe("Choose motion");
    expect(list.getAttribute("aria-label")).toBe("Choose motion");
  });

  test("§7.3 one option per motion; the hidden input carries the supplied name", () => {
    const root = mountIntoBody(
      renderMacro({ label: "Motion", motions: MOTIONS, name: "reduced-motion" }),
    );
    const { options, input } = partsOf(root);
    expect(options.length).toBe(MOTIONS.length);
    expect(input.type).toBe("hidden");
    expect(input.name).toBe("reduced-motion");
  });

  test("§7.3 the hidden input name defaults to motion", () => {
    const root = mountIntoBody(
      renderMacro({ label: "Motion", motions: MOTIONS }),
    );
    expect(partsOf(root).input.name).toBe("motion");
  });

  test("§7.4 each option carries the slug on data-value and a stable unique id", () => {
    const root = mountIntoBody(
      renderMacro({ label: "Motion", motions: MOTIONS }),
    );
    const { options } = partsOf(root);
    expect(options.map((o) => o.getAttribute("data-value"))).toEqual(MOTIONS);

    const ids = options.map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => id.length > 0)).toBe(true);

    const again = mountIntoBody(
      renderMacro({ label: "Motion", motions: MOTIONS }),
    );
    expect(partsOf(again).options.map((o) => o.id)).toEqual(ids);
  });

  test("§7.4 an explicit id namespaces the listbox and its options", () => {
    const root = mountIntoBody(
      renderMacro({
        label: "Motion",
        motions: MOTIONS,
        id: "sidebar-motion",
      }),
    );
    const { list, options } = partsOf(root);
    expect(list.id).toBe("sidebar-motion-list");
    expect(options[0].id).toBe("sidebar-motion-option-0");
  });

  test("§7.5 default labels title-case the slug per hyphen-word", () => {
    const root = mountIntoBody(
      renderMacro({ label: "Motion", motions: MOTIONS }),
    );
    expect(
      partsOf(root).options.map((o) => (o.textContent || "").trim()),
    ).toEqual(["No Preference", "Reduce"]);
  });

  test("§7.6 motionLabels override the default title-case label", () => {
    const root = mountIntoBody(
      renderMacro({
        label: "Motion",
        motions: ["no-preference", "reduce", "less"],
        motionLabels: { "no-preference": "Full", reduce: "Reduced" },
      }),
    );
    const labels = partsOf(root).options.map((o) =>
      (o.textContent || "").trim(),
    );
    expect(labels[0]).toBe("Full");
    expect(labels[1]).toBe("Reduced");
    // Unmapped slugs still fall back to the title-cased slug.
    expect(labels[2]).toBe("Less");
  });
});

describe("MotionPicker — server-rendered listbox state (§7.14–§7.16)", () => {
  test("§7.14 the listbox renders hidden and the button collapsed, before any JS runs", () => {
    const root = mountIntoBody(
      renderMacro({ label: "Motion", motions: MOTIONS, value: "reduce" }),
    );
    const { button, list } = partsOf(root);
    expect(list.hasAttribute("hidden")).toBe(true);
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(list.hasAttribute("aria-activedescendant")).toBe(false);
    expect(root.querySelector("[data-active]")).toBeNull();
  });

  test("§7.15 exactly one option is aria-selected in the server markup, and it is opts.value", () => {
    const root = mountIntoBody(
      renderMacro({ label: "Motion", motions: MOTIONS, value: "reduce" }),
    );
    const { options } = partsOf(root);
    const selected = options.filter(
      (o) => o.getAttribute("aria-selected") === "true",
    );
    expect(selected.length).toBe(1);
    expect(selected[0].getAttribute("data-value")).toBe("reduce");
    expect(options.every((o) => o.hasAttribute("aria-selected"))).toBe(true);
  });

  test("§7.15 with no value, the server marks motions[0] selected (no OS signal at render time)", () => {
    const root = mountIntoBody(
      renderMacro({ label: "Motion", motions: MOTIONS }),
    );
    expect(
      partsOf(root)
        .options.find((o) => o.getAttribute("aria-selected") === "true")!
        .getAttribute("data-value"),
    ).toBe("no-preference");

    const reordered = mountIntoBody(
      renderMacro({ label: "Motion", motions: ["reduce", "no-preference"] }),
    );
    expect(
      partsOf(reordered)
        .options.find((o) => o.getAttribute("aria-selected") === "true")!
        .getAttribute("data-value"),
    ).toBe("reduce");
  });

  test("§7.15 defaultValue resolves the server-selected option when value is absent", () => {
    const root = mountIntoBody(
      renderMacro({
        label: "Motion",
        motions: MOTIONS,
        defaultValue: "reduce",
      }),
    );
    expect(
      partsOf(root)
        .options.find((o) => o.getAttribute("aria-selected") === "true")!
        .getAttribute("data-value"),
    ).toBe("reduce");
  });

  test("§7.16 the hidden input is pre-filled server-side so a no-JS form submit still carries a motion", () => {
    const root = mountIntoBody(
      renderMacro({ label: "Motion", motions: MOTIONS, value: "reduce" }),
    );
    expect(partsOf(root).input.value).toBe("reduce");
  });
});

describe("MotionPicker — keyboard contract (APG listbox, §7.20–§7.24)", () => {
  test("§7.20 ArrowDown, Enter and Space all open the listbox and focus it", () => {
    for (const k of ["ArrowDown", "Enter", " "]) {
      const { button, list } = setup();
      key(button, k);
      expect(list.hasAttribute("hidden")).toBe(false);
      expect(button.getAttribute("aria-expanded")).toBe("true");
      expect(document.activeElement).toBe(list);
    }
  });

  test("§7.20 ArrowUp opens with the last option active", () => {
    const { button, list, options } = setup();
    key(button, "ArrowUp");
    expect(list.getAttribute("aria-activedescendant")).toBe(
      options[MOTIONS.length - 1].id,
    );
  });

  test("§7.21 opening puts the active descendant on the selected motion", () => {
    // "no-preference" resolves as the initial motion, so it is index 0.
    const { button, list, options } = setup();
    key(button, "ArrowDown");
    expect(list.getAttribute("aria-activedescendant")).toBe(options[0].id);
    expect(options[0].hasAttribute("data-active")).toBe(true);
  });

  test("§7.21 ArrowDown / ArrowUp move the active descendant and clamp", () => {
    const { button, list, options } = setup();
    key(button, "ArrowDown"); // opens on index 0 ("no-preference")
    key(list, "ArrowDown");
    expect(list.getAttribute("aria-activedescendant")).toBe(options[1].id);
    // Clamps at the bottom rather than wrapping.
    key(list, "ArrowDown");
    expect(list.getAttribute("aria-activedescendant")).toBe(options[1].id);
    // ...and at the top.
    key(list, "Home");
    key(list, "ArrowUp");
    expect(list.getAttribute("aria-activedescendant")).toBe(options[0].id);
  });

  test("§7.21 Home and End jump to the first and last option", () => {
    const { button, list, options } = setup();
    key(button, "ArrowDown");
    key(list, "End");
    expect(list.getAttribute("aria-activedescendant")).toBe(
      options[MOTIONS.length - 1].id,
    );
    key(list, "Home");
    expect(list.getAttribute("aria-activedescendant")).toBe(options[0].id);
  });

  test("§7.22 Enter selects the active option, applies it, closes, and returns focus", () => {
    const onChange = vi.fn();
    const { button, list, input } = setup({}, { onChange });
    key(button, "ArrowDown"); // active = "no-preference"
    key(list, "ArrowDown"); // active = "reduce"
    key(list, "Enter");
    expect(list.hasAttribute("hidden")).toBe(true);
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(document.documentElement.dataset.motion).toBe("reduce");
    expect(input.value).toBe("reduce");
    expect(onChange).toHaveBeenLastCalledWith("reduce");
    expect(document.activeElement).toBe(button);
  });

  test("§7.22 Space also selects the active option", () => {
    const { button, list } = setup();
    key(button, "ArrowDown");
    key(list, "End");
    key(list, " ");
    expect(document.documentElement.dataset.motion).toBe("reduce");
    expect(list.hasAttribute("hidden")).toBe(true);
  });

  test("§7.23 Escape closes and returns focus without changing the motion", () => {
    const onChange = vi.fn();
    const { button, list } = setup({}, { onChange });
    onChange.mockClear(); // ignore the initial apply
    key(button, "ArrowDown");
    key(list, "ArrowDown");
    key(list, "Escape");
    expect(list.hasAttribute("hidden")).toBe(true);
    expect(document.documentElement.dataset.motion).toBe("no-preference");
    expect(onChange).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(button);
  });

  test("§7.23 Tab closes and puts focus on the button so the default Tab proceeds from the picker", () => {
    const { button, list } = setup();
    key(button, "ArrowDown");
    expect(document.activeElement).toBe(list);
    key(list, "Tab");
    expect(list.hasAttribute("hidden")).toBe(true);
    expect(document.activeElement).toBe(button);
  });

  test("§7.24 typeahead moves the active descendant by label prefix", () => {
    const { button, list, options } = setup();
    key(button, "ArrowDown"); // active = index 0 ("No Preference")
    key(list, "r"); // "Reduce"
    expect(list.getAttribute("aria-activedescendant")).toBe(options[1].id);
  });

  test("§7.24 the typeahead buffer accumulates, then resets after 500ms", () => {
    vi.useFakeTimers();
    try {
      const { button, list, options } = setup({
        motions: ["no-preference", "reduce", "less"],
      });
      key(button, "ArrowDown"); // active = index 0
      key(list, "l");
      expect(list.getAttribute("aria-activedescendant")).toBe(options[2].id);
      // After the reset window, a lone "n" starts a fresh search.
      vi.advanceTimersByTime(600);
      key(list, "n");
      expect(list.getAttribute("aria-activedescendant")).toBe(options[0].id);
    } finally {
      vi.useRealTimers();
    }
  });

  test("§7.24 typeahead matches the overridden motionLabels, not the raw slug", () => {
    const { button, list, options } = setup({
      motionLabels: { reduce: "Calmer" },
    });
    key(button, "ArrowDown");
    key(list, "c"); // "Calmer" — would not match the slug "reduce"
    expect(list.getAttribute("aria-activedescendant")).toBe(options[1].id);
  });

  test("§7.24 modifier chords are not treated as typeahead", () => {
    const { button, list, options } = setup();
    key(button, "ArrowDown");
    key(list, "r", { ctrlKey: true });
    expect(list.getAttribute("aria-activedescendant")).toBe(options[0].id);
  });

  test("§7.24 clicking an option selects it, applies it, and closes the listbox", () => {
    const { button, list, options } = setup();
    click(button);
    click(options[1]);
    expect(document.documentElement.dataset.motion).toBe("reduce");
    expect(list.hasAttribute("hidden")).toBe(true);
    expect(button.getAttribute("aria-expanded")).toBe("false");
  });

  test("§7.24 clicking the button toggles the listbox shut again", () => {
    const { button, list } = setup();
    click(button);
    expect(list.hasAttribute("hidden")).toBe(false);
    click(button);
    expect(list.hasAttribute("hidden")).toBe(true);
  });

  test("§7.24 clicking outside the root closes the listbox", () => {
    const { button, list } = setup();
    const outside = document.createElement("p");
    document.body.appendChild(outside);
    click(button);
    expect(list.hasAttribute("hidden")).toBe(false);
    click(outside);
    expect(list.hasAttribute("hidden")).toBe(true);
    outside.remove();
  });

  test("§7.24 focus leaving the root closes the listbox", () => {
    const { root, button, list } = setup();
    const outside = document.createElement("button");
    document.body.appendChild(outside);
    key(button, "ArrowDown");
    expect(list.hasAttribute("hidden")).toBe(false);
    root.dispatchEvent(
      new FocusEvent("focusout", {
        bubbles: true,
        relatedTarget: outside,
      }),
    );
    expect(list.hasAttribute("hidden")).toBe(true);
    outside.remove();
  });

  test("§7.24 aria-selected follows the applied motion, not merely the active option", () => {
    const { button, list, options } = setup();
    key(button, "ArrowDown");
    key(list, "ArrowDown"); // active = reduce, but not chosen yet
    expect(options[0].getAttribute("aria-selected")).toBe("true");
    expect(options[1].getAttribute("aria-selected")).toBe("false");
    key(list, "Enter");
    expect(options[0].getAttribute("aria-selected")).toBe("false");
    expect(options[1].getAttribute("aria-selected")).toBe("true");
  });
});

describe("MotionPicker — pure helpers (§7.25)", () => {
  test("§7.25 motionName title-cases each hyphen-separated word", () => {
    expect(motionName("no-preference")).toBe("No Preference");
    expect(motionName("reduce")).toBe("Reduce");
  });

  test("§7.25 motionName is the JS statement of the rule the macro renders", () => {
    const slugs = ["no-preference", "reduce", "extra-reduced-motion"];
    const root = mountIntoBody(
      renderMacro({ label: "Motion", motions: slugs }),
    );
    expect(
      partsOf(root).options.map((o) => (o.textContent || "").trim()),
    ).toEqual(slugs.map(motionName));
  });

  test("§7.25 prefersReducedMotion reads (prefers-reduced-motion: reduce)", () => {
    mockReducedMotion(true);
    expect(prefersReducedMotion()).toBe(true);
    mockReducedMotion(false);
    expect(prefersReducedMotion()).toBe(false);
  });
});

describe("MotionPicker — initial-value resolution (§7.26–§7.28)", () => {
  test("§7.26 the initial motion is 'no-preference' when the OS reports no preference", () => {
    mockReducedMotion(false);
    setup();
    expect(document.documentElement.dataset.motion).toBe("no-preference");
  });

  test("§7.26 the initial motion is 'reduce' when the OS reports prefers-reduced-motion", () => {
    mockReducedMotion(true);
    setup();
    expect(document.documentElement.dataset.motion).toBe("reduce");
  });

  test("§7.26 falls back to motions[0] when neither OS slug is offered", () => {
    mockReducedMotion(true);
    setup({ motions: ["standard", "minimal"] });
    expect(document.documentElement.dataset.motion).toBe("standard");
  });

  test("§7.27 persists to localStorage and reads back on a fresh init", () => {
    const { controller } = setup({ storageKey: "lily-motion" });
    controller.setMotion("reduce");
    expect(localStorage.getItem("lily-motion")).toBe("reduce");
    controller.destroy();
    resetRoot();

    setup({ storageKey: "lily-motion" });
    expect(document.documentElement.dataset.motion).toBe("reduce");
  });

  test("§7.28 opts.value beats storage, OS preference, and defaultValue", () => {
    mockReducedMotion(true);
    localStorage.setItem("lily-motion", "reduce");
    setup({
      value: "no-preference",
      storageKey: "lily-motion",
      defaultValue: "reduce",
    });
    expect(document.documentElement.dataset.motion).toBe("no-preference");
  });

  test("§7.28 storage still applies when opts.value is absent", () => {
    localStorage.setItem("lily-motion", "reduce");
    setup({ storageKey: "lily-motion" });
    expect(document.documentElement.dataset.motion).toBe("reduce");
  });

  test("§7.28 the full order is value > storage > default > OS preference > first", () => {
    // default beats OS preference
    mockReducedMotion(true);
    setup({ defaultValue: "no-preference" });
    expect(document.documentElement.dataset.motion).toBe("no-preference");

    // OS preference beats first-option
    resetRoot();
    mockReducedMotion(true);
    setup({ motions: ["no-preference", "reduce"] });
    expect(document.documentElement.dataset.motion).toBe("reduce");

    // first-option is the last resort
    resetRoot();
    mockReducedMotion(true);
    setup({ motions: ["standard", "minimal"] });
    expect(document.documentElement.dataset.motion).toBe("standard");
  });
});

describe("MotionPicker — client.js lifecycle (§7.7–§7.13, §7.17–§7.19)", () => {
  test("§7.7 initial apply sets data-motion on documentElement", () => {
    setup();
    expect(document.documentElement.dataset.motion).toBe("no-preference");
  });

  test("§7.8 a custom target receives data-motion instead", () => {
    const target = document.createElement("section");
    document.body.appendChild(target);
    setup({ defaultValue: "reduce" }, { target });
    expect(target.getAttribute("data-motion")).toBe("reduce");
    expect(document.documentElement.hasAttribute("data-motion")).toBe(false);
    target.remove();
  });

  test("§7.9 choosing an option updates data-motion, the hidden input, and fires onChange", () => {
    const onChange = vi.fn();
    const { button, options, input } = setup({}, { onChange });
    click(button);
    click(options[1]);
    expect(document.documentElement.dataset.motion).toBe("reduce");
    expect(input.value).toBe("reduce");
    expect(onChange).toHaveBeenLastCalledWith("reduce");
  });

  test("§7.10 setMotion applies a motion programmatically", () => {
    const onChange = vi.fn();
    const { controller, input } = setup({}, { onChange });
    controller.setMotion("reduce");
    expect(document.documentElement.dataset.motion).toBe("reduce");
    expect(input.value).toBe("reduce");
    expect(onChange).toHaveBeenLastCalledWith("reduce");
  });

  test("§7.13 extra attributes spread onto the root div", () => {
    const root = mountIntoBody(
      renderMacro({
        label: "Motion",
        motions: MOTIONS,
        attributes: { "data-testid": "mp" },
      }),
    );
    expect(root.getAttribute("data-testid")).toBe("mp");
  });

  test("§7.13 classes append to the base class hook on the root", () => {
    const root = mountIntoBody(
      renderMacro({
        label: "Motion",
        motions: MOTIONS,
        classes: "toolbar-control",
      }),
    );
    expect(root.classList.contains("motion-picker")).toBe(true);
    expect(root.classList.contains("toolbar-control")).toBe(true);
  });

  test("§7.13 destroy() detaches the listeners", () => {
    const { button, list, controller } = setup();
    controller.destroy();
    key(button, "ArrowDown");
    expect(list.hasAttribute("hidden")).toBe(true);
  });

  test("§7.17 opts.value is carried on data-lily-motion-picker-value and resolves the initial motion", () => {
    const root = mountIntoBody(
      renderMacro({
        label: "Motion",
        motions: MOTIONS,
        value: "reduce",
        defaultValue: "no-preference",
      }),
    );
    expect(root.getAttribute("data-lily-motion-picker-value")).toBe(
      "reduce",
    );
    initMotionPicker(root);
    expect(document.documentElement.dataset.motion).toBe("reduce");
  });

  test("§7.18 the value data attribute is omitted entirely when opts.value is unset", () => {
    const root = mountIntoBody(
      renderMacro({ label: "Motion", motions: MOTIONS }),
    );
    expect(root.hasAttribute("data-lily-motion-picker-value")).toBe(false);
  });

  test("§7.19 a call block replaces the glyph inside the button", () => {
    const root = mountIntoBody(
      renderMacroWithCaller(
        { label: "Motion", motions: MOTIONS },
        `<span class="my-glyph" aria-hidden="true">||</span>`,
      ),
    );
    const { button } = partsOf(root);
    expect(button.querySelector(".my-glyph")).not.toBeNull();
    expect(button.querySelector(".motion-picker-icon")).toBeNull();
    // The accessible name still comes from aria-label, not the glyph.
    expect(button.getAttribute("aria-label")).toBe("Motion");
  });

  test("§7.11 autoInit wires every root on the page", () => {
    const html1 = renderMacro({
      label: "A",
      motions: ["no-preference", "reduce"],
      name: "a",
      defaultValue: "no-preference",
    });
    const html2 = renderMacro({
      label: "B",
      motions: ["standard", "minimal"],
      name: "b",
      defaultValue: "minimal",
    });
    document.body.innerHTML = html1 + html2;
    const controllers = autoInit();
    expect(controllers.length).toBe(2);
    // Last init wins for the shared documentElement; both should have run.
    expect(document.documentElement.dataset.motion).toBe("minimal");
    const lists = document.querySelectorAll(".motion-picker-list");
    expect(lists[0].id).not.toBe(lists[1].id);
  });

  test("§7.12 init is a no-op on a root missing its button and list", () => {
    document.body.innerHTML = `<div data-lily-motion-picker-root></div>`;
    const root = document.body.firstElementChild as HTMLElement;
    const controller = initMotionPicker(root);
    expect(() => controller.setMotion("reduce")).not.toThrow();
    expect(document.documentElement.hasAttribute("data-motion")).toBe(false);
  });
});

describe("MotionPicker — accessibility hardening (§7.29–§7.32; canonical Svelte §7.14–§7.17)", () => {
  function openPicker(
    motions: string[] = MOTIONS,
    extra: Record<string, unknown> = {},
  ) {
    const { button, list } = setup({ motions, ...extra });
    click(button);
    return { button, list };
  }

  const active = (list: HTMLElement) =>
    list.querySelector("[data-active]")?.textContent?.trim();

  test("§7.29 Tab from the open list puts focus on the button before closing", () => {
    const { button, list } = openPicker();
    expect(document.activeElement).toBe(list);
    key(list, "Tab");
    expect(document.activeElement).toBe(button);
    expect(list.hasAttribute("hidden")).toBe(true);
  });

  test("§7.30 a repeated typeahead character cycles through its matches", () => {
    const { list } = openPicker(["r1", "r2", "r3", "m"], {
      motionLabels: { r1: "Reduce a lot", r2: "Reduce more", r3: "Reduce most", m: "Minimal" },
      defaultValue: "m",
    });
    key(list, "r");
    expect(active(list)).toBe("Reduce a lot");
    key(list, "r");
    expect(active(list)).toBe("Reduce more");
    key(list, "r");
    expect(active(list)).toBe("Reduce most");
  });

  test("§7.30 a multi-character buffer refines the match from the active option", () => {
    const { list } = openPicker(["r1", "r2", "r3", "m"], {
      motionLabels: { r1: "Reduce a lot", r2: "Reduce more", r3: "Reduce most", m: "Minimal" },
      defaultValue: "m",
    });
    key(list, "r");
    key(list, "e");
    expect(active(list)).toBe("Reduce a lot");
  });

  test("§7.31 PageUp and PageDown move the cursor by ten, clamped", () => {
    const many = Array.from(
      { length: 25 },
      (_, i) => `s${String(i).padStart(2, "0")}`,
    );
    const { list } = openPicker(many);
    key(list, "PageDown");
    expect(active(list)).toBe("S10");
    key(list, "PageDown");
    expect(active(list)).toBe("S20");
    key(list, "PageDown");
    expect(active(list)).toBe("S24");
    key(list, "PageUp");
    expect(active(list)).toBe("S14");
  });

  test("§7.32 an empty list opens without aria-activedescendant", () => {
    const { list } = openPicker([]);
    expect(list.hasAttribute("hidden")).toBe(false);
    expect(list.getAttribute("aria-activedescendant")).toBeNull();
  });
});

describe("initMotionPicker — idempotent apply (§7.33)", () => {
  test("§7.33 an onChange that mirrors the value back does not re-enter apply", () => {
    const calls: string[] = [];
    let controller: { setMotion: (slug: string) => void } | undefined;
    const parts = setup(
      {},
      {
        onChange: (slug: string) => {
          calls.push(slug);
          if (calls.length > 50) return; // stop a runaway
          controller?.setMotion(slug);
        },
      },
    );
    controller = parts.controller;
    expect(calls).toEqual(["no-preference"]);

    click(parts.button);
    click(parts.options[MOTIONS.indexOf("reduce")]);
    expect(calls).toEqual(["no-preference", "reduce"]);
    expect(parts.button.getAttribute("aria-expanded")).toBe("false");
    expect(parts.list.hasAttribute("hidden")).toBe(true);
  });
});
