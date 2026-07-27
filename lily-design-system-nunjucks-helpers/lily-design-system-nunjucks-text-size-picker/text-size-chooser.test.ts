// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import nunjucks from "nunjucks";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import {
    autoInit,
    initTextSizeChooser,
    LATIN_CAPITAL_LETTER_A,
    sizeName,
} from "./text-size-chooser.client.js";

// ---------------------------------------------------------------------
// Nunjucks env that can resolve `./text-size-chooser.njk` from this dir.
// ---------------------------------------------------------------------

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = nunjucks.configure(__dirname, {
    autoescape: true,
    throwOnUndefined: false,
    trimBlocks: true,
    lstripBlocks: true,
});

const SIZES = ["small", "medium", "large", "x-large"];

function renderMacro(opts: Record<string, unknown>): string {
    const src =
        `{% from "./text-size-chooser.njk" import textSizeChooser %}` +
        `{{ textSizeChooser(opts) }}`;
    return env.renderString(src, { opts });
}

function renderMacroWithCaller(
    opts: Record<string, unknown>,
    body: string,
): string {
    const src =
        `{% from "./text-size-chooser.njk" import textSizeChooser %}` +
        `{% call textSizeChooser(opts) %}${body}{% endcall %}`;
    return env.renderString(src, { opts });
}

function mountIntoBody(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.querySelector(
        "[data-lily-text-size-chooser-root]",
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
            ".text-size-chooser-button",
        ) as HTMLButtonElement,
        list: root.querySelector(".text-size-chooser-list") as HTMLElement,
        options: Array.from(
            root.querySelectorAll<HTMLElement>(".text-size-chooser-option"),
        ),
        input: root.querySelector(
            "[data-lily-text-size-chooser-input]",
        ) as HTMLInputElement,
    };
}

/** Render + mount + init in one step, returning the DOM parts. */
function setup(
    opts: Record<string, unknown> = {},
    initOpts: Record<string, unknown> = {},
) {
    const root = mountIntoBody(
        renderMacro({
            label: "Text size",
            sizes: SIZES,
            ...opts,
        }),
    );
    const controller = initTextSizeChooser(root, initOpts);
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
    document.documentElement.removeAttribute("data-text-size");
}

beforeEach(() => {
    resetRoot();
    document.body.innerHTML = "";
    try {
        localStorage.clear();
    } catch {
        /* ignore */
    }
});

afterEach(() => {
    resetRoot();
});

describe("TextSizeChooser — macro markup contract (§7.1–§7.6)", () => {
    test("§7.1 macro renders a div root containing a button that controls a listbox", () => {
        const root = mountIntoBody(
            renderMacro({ label: "Text size", sizes: SIZES }),
        );
        expect(root.tagName).toBe("DIV");
        expect(root.classList.contains("text-size-chooser")).toBe(true);

        const { button, list } = partsOf(root);
        expect(button.tagName).toBe("BUTTON");
        expect(button.getAttribute("type")).toBe("button");
        expect(button.getAttribute("aria-haspopup")).toBe("listbox");
        expect(button.getAttribute("aria-expanded")).toBe("false");
        expect(button.getAttribute("aria-controls")).toBe(list.id);
        expect(list.getAttribute("role")).toBe("listbox");
        expect(list.getAttribute("tabindex")).toBe("-1");
    });

    test("§7.1 the button renders the 'A' glyph, hidden from assistive tech", () => {
        const root = mountIntoBody(
            renderMacro({ label: "Text size", sizes: SIZES }),
        );
        const icon = root.querySelector(
            ".text-size-chooser-icon",
        ) as HTMLElement;
        expect(icon.textContent).toBe(LATIN_CAPITAL_LETTER_A);
        expect(LATIN_CAPITAL_LETTER_A).toBe("A");
        expect(icon.getAttribute("aria-hidden")).toBe("true");
        // The glyph must never be the accessible name.
        const button = root.querySelector(".text-size-chooser-button")!;
        expect(button.textContent).not.toBe(button.getAttribute("aria-label"));
    });

    test("§7.2 aria-label names both the button and the listbox", () => {
        const root = mountIntoBody(
            renderMacro({ label: "Choose text size", sizes: SIZES }),
        );
        const { button, list } = partsOf(root);
        expect(button.getAttribute("aria-label")).toBe("Choose text size");
        expect(list.getAttribute("aria-label")).toBe("Choose text size");
    });

    test("§7.3 one option per size; the hidden input carries the supplied name", () => {
        const root = mountIntoBody(
            renderMacro({ label: "Text size", sizes: SIZES, name: "size" }),
        );
        const { options, input } = partsOf(root);
        expect(options.length).toBe(SIZES.length);
        expect(input.type).toBe("hidden");
        expect(input.name).toBe("size");
    });

    test("§7.3 the hidden input name defaults to text-size", () => {
        const root = mountIntoBody(
            renderMacro({ label: "Text size", sizes: SIZES }),
        );
        expect(partsOf(root).input.name).toBe("text-size");
    });

    test("§7.4 each option carries the slug on data-value and a stable unique id", () => {
        const root = mountIntoBody(
            renderMacro({ label: "Text size", sizes: SIZES }),
        );
        const { options } = partsOf(root);
        expect(options.map((o) => o.getAttribute("data-value"))).toEqual(SIZES);

        const ids = options.map((o) => o.id);
        // Unique, non-empty, and deterministic (no Math.random / Date.now).
        expect(new Set(ids).size).toBe(ids.length);
        expect(ids.every((id) => id.length > 0)).toBe(true);

        const again = mountIntoBody(
            renderMacro({ label: "Text size", sizes: SIZES }),
        );
        expect(partsOf(again).options.map((o) => o.id)).toEqual(ids);
    });

    test("§7.4 an explicit id namespaces the listbox and its options", () => {
        const root = mountIntoBody(
            renderMacro({
                label: "Text size",
                sizes: SIZES,
                id: "sidebar-text-size",
            }),
        );
        const { list, options } = partsOf(root);
        expect(list.id).toBe("sidebar-text-size-list");
        expect(options[0].id).toBe("sidebar-text-size-option-0");
    });

    test("§7.5 default labels title-case the slug per hyphen-word", () => {
        const root = mountIntoBody(
            renderMacro({ label: "Text size", sizes: SIZES }),
        );
        expect(
            partsOf(root).options.map((o) => (o.textContent || "").trim()),
        ).toEqual(["Small", "Medium", "Large", "X Large"]);
    });

    test("§7.6 sizeLabels override the default title-case label", () => {
        const root = mountIntoBody(
            renderMacro({
                label: "Text size",
                sizes: ["small", "x-large", "huge"],
                sizeLabels: { small: "Small", "x-large": "Extra large" },
            }),
        );
        const labels = partsOf(root).options.map((o) =>
            (o.textContent || "").trim(),
        );
        expect(labels[0]).toBe("Small");
        expect(labels[1]).toBe("Extra large");
        // Unmapped slugs still fall back to the title-cased slug.
        expect(labels[2]).toBe("Huge");
    });
});

describe("TextSizeChooser — server-rendered listbox state (§7.14–§7.16)", () => {
    test("§7.14 the listbox renders hidden and the button collapsed, before any JS runs", () => {
        const root = mountIntoBody(
            renderMacro({ label: "Text size", sizes: SIZES, value: "large" }),
        );
        const { button, list } = partsOf(root);
        expect(list.hasAttribute("hidden")).toBe(true);
        expect(button.getAttribute("aria-expanded")).toBe("false");
        // Nothing is "active" until the listbox opens.
        expect(list.hasAttribute("aria-activedescendant")).toBe(false);
        expect(root.querySelector("[data-active]")).toBeNull();
    });

    test("§7.15 exactly one option is aria-selected in the server markup, and it is opts.value", () => {
        const root = mountIntoBody(
            renderMacro({ label: "Text size", sizes: SIZES, value: "large" }),
        );
        const { options } = partsOf(root);
        const selected = options.filter(
            (o) => o.getAttribute("aria-selected") === "true",
        );
        expect(selected.length).toBe(1);
        expect(selected[0].getAttribute("data-value")).toBe("large");
        // Every other option is explicitly false, never absent.
        expect(options.every((o) => o.hasAttribute("aria-selected"))).toBe(true);
    });

    test("§7.15 with no value, the server marks 'medium' selected; without 'medium', the first size", () => {
        const withMedium = mountIntoBody(
            renderMacro({ label: "Text size", sizes: SIZES }),
        );
        expect(
            partsOf(withMedium)
                .options.find((o) => o.getAttribute("aria-selected") === "true")!
                .getAttribute("data-value"),
        ).toBe("medium");

        const withoutMedium = mountIntoBody(
            renderMacro({ label: "Text size", sizes: ["sm", "lg", "xl"] }),
        );
        expect(
            partsOf(withoutMedium)
                .options.find((o) => o.getAttribute("aria-selected") === "true")!
                .getAttribute("data-value"),
        ).toBe("sm");
    });

    test("§7.15 defaultValue resolves the server-selected option when value is absent", () => {
        const root = mountIntoBody(
            renderMacro({
                label: "Text size",
                sizes: SIZES,
                defaultValue: "x-large",
            }),
        );
        expect(
            partsOf(root)
                .options.find((o) => o.getAttribute("aria-selected") === "true")!
                .getAttribute("data-value"),
        ).toBe("x-large");
    });

    test("§7.16 the hidden input is pre-filled server-side so a no-JS form submit still carries a size", () => {
        const root = mountIntoBody(
            renderMacro({ label: "Text size", sizes: SIZES, value: "large" }),
        );
        expect(partsOf(root).input.value).toBe("large");
    });
});

describe("TextSizeChooser — keyboard contract (APG listbox, §7.20–§7.24)", () => {
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
            options[SIZES.length - 1].id,
        );
    });

    test("§7.21 opening puts the active descendant on the selected size", () => {
        // "medium" resolves as the initial size, so it is index 1.
        const { button, list, options } = setup();
        key(button, "ArrowDown");
        expect(list.getAttribute("aria-activedescendant")).toBe(options[1].id);
        expect(options[1].hasAttribute("data-active")).toBe(true);
    });

    test("§7.21 ArrowDown / ArrowUp move the active descendant and clamp", () => {
        const { button, list, options } = setup();
        key(button, "ArrowDown"); // opens on index 1 ("medium")
        key(list, "ArrowDown");
        expect(list.getAttribute("aria-activedescendant")).toBe(options[2].id);
        key(list, "ArrowUp");
        expect(list.getAttribute("aria-activedescendant")).toBe(options[1].id);
        // Clamps at the top rather than wrapping.
        key(list, "Home");
        key(list, "ArrowUp");
        expect(list.getAttribute("aria-activedescendant")).toBe(options[0].id);
        // ...and at the bottom.
        key(list, "End");
        key(list, "ArrowDown");
        expect(list.getAttribute("aria-activedescendant")).toBe(
            options[SIZES.length - 1].id,
        );
    });

    test("§7.21 Home and End jump to the first and last option", () => {
        const { button, list, options } = setup();
        key(button, "ArrowDown");
        key(list, "End");
        expect(list.getAttribute("aria-activedescendant")).toBe(
            options[SIZES.length - 1].id,
        );
        key(list, "Home");
        expect(list.getAttribute("aria-activedescendant")).toBe(options[0].id);
    });

    test("§7.22 Enter selects the active option, applies it, closes, and returns focus", () => {
        const onChange = vi.fn();
        const { button, list, input } = setup({}, { onChange });
        key(button, "ArrowDown"); // active = "medium"
        key(list, "ArrowDown"); // active = "large"
        key(list, "Enter");
        expect(list.hasAttribute("hidden")).toBe(true);
        expect(button.getAttribute("aria-expanded")).toBe("false");
        expect(document.documentElement.dataset.textSize).toBe("large");
        expect(input.value).toBe("large");
        expect(onChange).toHaveBeenLastCalledWith("large");
        expect(document.activeElement).toBe(button);
    });

    test("§7.22 Space also selects the active option", () => {
        const { button, list } = setup();
        key(button, "ArrowDown");
        key(list, "End");
        key(list, " ");
        expect(document.documentElement.dataset.textSize).toBe("x-large");
        expect(list.hasAttribute("hidden")).toBe(true);
    });

    test("§7.23 Escape closes and returns focus without changing the size", () => {
        const onChange = vi.fn();
        const { button, list } = setup({}, { onChange });
        onChange.mockClear(); // ignore the initial apply
        key(button, "ArrowDown");
        key(list, "ArrowDown");
        key(list, "Escape");
        expect(list.hasAttribute("hidden")).toBe(true);
        expect(document.documentElement.dataset.textSize).toBe("medium");
        expect(onChange).not.toHaveBeenCalled();
        expect(document.activeElement).toBe(button);
    });

    test("§7.23 Tab closes without stealing focus back to the button", () => {
        const { button, list } = setup();
        key(button, "ArrowDown");
        expect(document.activeElement).toBe(list);
        key(list, "Tab");
        expect(list.hasAttribute("hidden")).toBe(true);
        // Focus is left alone so the browser's own Tab handling proceeds.
        expect(document.activeElement).not.toBe(button);
    });

    test("§7.24 typeahead moves the active descendant by label prefix", () => {
        const { button, list, options } = setup();
        key(button, "ArrowDown"); // active = index 1 ("Medium")
        key(list, "s"); // "Small" — found by wrapping past the end
        expect(list.getAttribute("aria-activedescendant")).toBe(options[0].id);
    });

    test("§7.24 the typeahead buffer accumulates, then resets after 500ms", () => {
        vi.useFakeTimers();
        try {
            const { button, list, options } = setup();
            key(button, "ArrowDown"); // active = index 1 ("Medium")
            // "la" matches only "Large".
            key(list, "l");
            key(list, "a");
            expect(list.getAttribute("aria-activedescendant")).toBe(
                options[2].id,
            );
            // After the reset window, a lone "x" starts a fresh search.
            vi.advanceTimersByTime(600);
            key(list, "x");
            expect(list.getAttribute("aria-activedescendant")).toBe(
                options[3].id,
            );
        } finally {
            vi.useRealTimers();
        }
    });

    test("§7.24 typeahead matches the overridden sizeLabels, not the raw slug", () => {
        const { button, list, options } = setup({
            sizeLabels: { "x-large": "Huge" },
        });
        key(button, "ArrowDown");
        key(list, "h"); // "Huge" — would not match the slug "x-large"
        expect(list.getAttribute("aria-activedescendant")).toBe(options[3].id);
    });

    test("§7.24 modifier chords are not treated as typeahead", () => {
        const { button, list, options } = setup();
        key(button, "ArrowDown");
        key(list, "s", { ctrlKey: true });
        expect(list.getAttribute("aria-activedescendant")).toBe(options[1].id);
    });

    test("§7.24 clicking an option selects and applies it", () => {
        const { button, list, options } = setup();
        click(button);
        click(options[3]);
        expect(document.documentElement.dataset.textSize).toBe("x-large");
        expect(list.hasAttribute("hidden")).toBe(true);
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

    test("§7.24 aria-selected follows the applied size, not merely the active option", () => {
        const { button, list, options } = setup();
        key(button, "ArrowDown");
        key(list, "ArrowDown"); // active = large, but not chosen yet
        expect(options[1].getAttribute("aria-selected")).toBe("true");
        expect(options[2].getAttribute("aria-selected")).toBe("false");
        key(list, "Enter");
        expect(options[1].getAttribute("aria-selected")).toBe("false");
        expect(options[2].getAttribute("aria-selected")).toBe("true");
    });
});

describe("TextSizeChooser — pure helpers (§7.25)", () => {
    test("§7.25 sizeName title-cases each hyphen-separated word", () => {
        expect(sizeName("small")).toBe("Small");
        expect(sizeName("x-large")).toBe("X Large");
        expect(sizeName("extra-extra-large")).toBe("Extra Extra Large");
    });

    test("§7.25 sizeName is the JS statement of the rule the macro renders", () => {
        // A Nunjucks macro cannot call into the client module, and
        // delegating would force consumers to register a custom filter,
        // so the two implementations are held in agreement by this test
        // rather than by delegation.
        const slugs = ["small", "medium", "large", "x-large", "xx-large"];
        const root = mountIntoBody(
            renderMacro({ label: "Text size", sizes: slugs }),
        );
        expect(
            partsOf(root).options.map((o) => (o.textContent || "").trim()),
        ).toEqual(slugs.map(sizeName));
    });
});

describe("TextSizeChooser — initial-value resolution (§7.26–§7.28)", () => {
    test("§7.26 the initial size defaults to 'medium' when present", () => {
        setup();
        expect(document.documentElement.dataset.textSize).toBe("medium");
    });

    test("§7.26 the initial size falls back to the first option when 'medium' is absent", () => {
        setup({ sizes: ["sm", "lg", "xl"] });
        expect(document.documentElement.dataset.textSize).toBe("sm");
    });

    test("§7.27 persists to localStorage and reads back on a fresh init", () => {
        const { controller } = setup({ storageKey: "lily-text-size" });
        controller.setSize("large");
        expect(localStorage.getItem("lily-text-size")).toBe("large");
        controller.destroy();
        resetRoot();

        setup({ storageKey: "lily-text-size" });
        expect(document.documentElement.dataset.textSize).toBe("large");
    });

    test("§7.28 opts.value beats storage, defaultValue, and 'medium'", () => {
        localStorage.setItem("lily-text-size", "x-large");
        setup({
            value: "small",
            storageKey: "lily-text-size",
            defaultValue: "large",
        });
        expect(document.documentElement.dataset.textSize).toBe("small");
    });

    test("§7.28 storage still applies when opts.value is absent", () => {
        localStorage.setItem("lily-text-size", "x-large");
        setup({ storageKey: "lily-text-size" });
        expect(document.documentElement.dataset.textSize).toBe("x-large");
    });

    test("§7.28 the full order is value > storage > default > 'medium' > first", () => {
        // default beats "medium"
        setup({ defaultValue: "large" });
        expect(document.documentElement.dataset.textSize).toBe("large");

        // "medium" beats first-option
        resetRoot();
        setup({ sizes: ["small", "medium", "large"] });
        expect(document.documentElement.dataset.textSize).toBe("medium");

        // first-option is the last resort
        resetRoot();
        setup({ sizes: ["sm", "lg"] });
        expect(document.documentElement.dataset.textSize).toBe("sm");
    });
});

describe("TextSizeChooser — client.js lifecycle (§7.7–§7.13, §7.17–§7.19)", () => {
    test("§7.7 initial apply sets data-text-size on documentElement", () => {
        setup();
        expect(document.documentElement.dataset.textSize).toBe("medium");
    });

    test("§7.8 a custom target receives data-text-size instead", () => {
        const target = document.createElement("section");
        document.body.appendChild(target);
        setup({ defaultValue: "large" }, { target });
        expect(target.getAttribute("data-text-size")).toBe("large");
        expect(document.documentElement.hasAttribute("data-text-size")).toBe(
            false,
        );
        target.remove();
    });

    test("§7.9 choosing an option updates data-text-size, the hidden input, and fires onChange", () => {
        const onChange = vi.fn();
        const { button, options, input } = setup({}, { onChange });
        click(button);
        click(options[3]);
        expect(document.documentElement.dataset.textSize).toBe("x-large");
        expect(input.value).toBe("x-large");
        expect(onChange).toHaveBeenLastCalledWith("x-large");
    });

    test("§7.10 setSize applies a size programmatically", () => {
        const onChange = vi.fn();
        const { controller, input } = setup({}, { onChange });
        controller.setSize("large");
        expect(document.documentElement.dataset.textSize).toBe("large");
        expect(input.value).toBe("large");
        expect(onChange).toHaveBeenLastCalledWith("large");
    });

    test("§7.13 extra attributes spread onto the root div", () => {
        const root = mountIntoBody(
            renderMacro({
                label: "Text size",
                sizes: SIZES,
                attributes: { "data-testid": "ts" },
            }),
        );
        expect(root.getAttribute("data-testid")).toBe("ts");
    });

    test("§7.13 classes append to the base class hook on the root", () => {
        const root = mountIntoBody(
            renderMacro({
                label: "Text size",
                sizes: SIZES,
                classes: "toolbar-control",
            }),
        );
        expect(root.classList.contains("text-size-chooser")).toBe(true);
        expect(root.classList.contains("toolbar-control")).toBe(true);
    });

    test("§7.13 destroy() detaches the listeners", () => {
        const { button, list, controller } = setup();
        controller.destroy();
        key(button, "ArrowDown");
        expect(list.hasAttribute("hidden")).toBe(true);
    });

    test("§7.17 opts.value is carried on data-lily-text-size-chooser-value and resolves the initial size", () => {
        const root = mountIntoBody(
            renderMacro({
                label: "Text size",
                sizes: SIZES,
                value: "x-large",
                defaultValue: "large",
            }),
        );
        expect(root.getAttribute("data-lily-text-size-chooser-value")).toBe(
            "x-large",
        );
        initTextSizeChooser(root);
        expect(document.documentElement.dataset.textSize).toBe("x-large");
    });

    test("§7.18 the value data attribute is omitted entirely when opts.value is unset", () => {
        const root = mountIntoBody(
            renderMacro({ label: "Text size", sizes: SIZES }),
        );
        expect(root.hasAttribute("data-lily-text-size-chooser-value")).toBe(
            false,
        );
    });

    test("§7.19 a call block replaces the glyph inside the button", () => {
        const root = mountIntoBody(
            renderMacroWithCaller(
                { label: "Text size", sizes: SIZES },
                `<span class="my-glyph" aria-hidden="true">Aa</span>`,
            ),
        );
        const { button } = partsOf(root);
        expect(button.querySelector(".my-glyph")).not.toBeNull();
        expect(button.querySelector(".text-size-chooser-icon")).toBeNull();
        // The accessible name still comes from aria-label, not the glyph.
        expect(button.getAttribute("aria-label")).toBe("Text size");
    });

    test("§7.11 autoInit wires every root on the page", () => {
        const html1 = renderMacro({
            label: "A",
            sizes: ["small", "medium"],
            name: "a",
            defaultValue: "small",
        });
        const html2 = renderMacro({
            label: "B",
            sizes: ["large", "x-large"],
            name: "b",
            defaultValue: "x-large",
        });
        document.body.innerHTML = html1 + html2;
        const controllers = autoInit();
        expect(controllers.length).toBe(2);
        // Last init wins for the shared documentElement; both should have run.
        expect(document.documentElement.dataset.textSize).toBe("x-large");
        // Distinct names give distinct id namespaces, so the two listboxes
        // do not collide.
        const lists = document.querySelectorAll(".text-size-chooser-list");
        expect(lists[0].id).not.toBe(lists[1].id);
    });

    test("§7.12 init is a no-op on a root missing its button and list", () => {
        document.body.innerHTML = `<div data-lily-text-size-chooser-root></div>`;
        const root = document.body.firstElementChild as HTMLElement;
        const controller = initTextSizeChooser(root);
        expect(() => controller.setSize("large")).not.toThrow();
        expect(document.documentElement.hasAttribute("data-text-size")).toBe(
            false,
        );
    });
});
