import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import {
    TextSizeChooser,
    sizeName,
    LATIN_CAPITAL_LETTER_A,
} from "./text-size-chooser.js";

// Ensure the custom element is registered exactly once for the suite.
if (typeof customElements !== "undefined" && !customElements.get("text-size-chooser")) {
    customElements.define("text-size-chooser", TextSizeChooser);
}

const SIZES = ["small", "medium", "large", "x-large"];

function flush(): Promise<void> {
    return new Promise((r) => setTimeout(r, 0));
}

function resetRoot(): void {
    document.documentElement.removeAttribute("data-text-size");
}

function mount(attrs: Record<string, string>): TextSizeChooser {
    const el = document.createElement("text-size-chooser") as TextSizeChooser;
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    document.body.appendChild(el);
    return el;
}

function button(): HTMLButtonElement {
    return document.body.querySelector<HTMLButtonElement>(".text-size-chooser-button")!;
}

function list(): HTMLUListElement {
    return document.body.querySelector<HTMLUListElement>(".text-size-chooser-list")!;
}

function options(): HTMLLIElement[] {
    return [...document.body.querySelectorAll<HTMLLIElement>(".text-size-chooser-option")];
}

function hiddenInput(): HTMLInputElement {
    return document.body.querySelector<HTMLInputElement>('input[type="hidden"]')!;
}

function press(el: Element, key: string): void {
    el.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
}

function click(el: Element): void {
    el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
}

/** Open the listbox and click the option for `slug`. */
function pick(slug: string, sizes: string[] = SIZES): void {
    click(button());
    click(options()[sizes.indexOf(slug)]);
}

beforeEach(() => {
    resetRoot();
    document.body.replaceChildren();
    try {
        localStorage.clear();
    } catch {
        /* ignore */
    }
});

afterEach(() => {
    resetRoot();
    document.body.replaceChildren();
});

describe("<text-size-chooser> — pure helpers", () => {
    // sizeName is the exported mirror of theme-chooser's themeName.
    test("sizeName title-cases a single-word slug", () => {
        expect(sizeName("small")).toBe("Small");
    });

    test("sizeName title-cases every hyphen-separated word", () => {
        expect(sizeName("x-large")).toBe("X Large");
        expect(sizeName("extra-extra-large")).toBe("Extra Extra Large");
    });

    test("sizeName leaves an empty slug empty", () => {
        expect(sizeName("")).toBe("");
    });
});

describe("<text-size-chooser> — markup contract (§7.1–§7.5)", () => {
    test("§7.1 renders a div root containing a button that controls a listbox", async () => {
        mount({ label: "Text size", sizes: SIZES.join(",") });
        await flush();
        const root = document.body.querySelector("div.text-size-chooser")!;
        expect(root.tagName).toBe("DIV");
        const btn = button();
        expect(btn.tagName).toBe("BUTTON");
        expect(btn.getAttribute("type")).toBe("button");
        expect(btn.getAttribute("aria-haspopup")).toBe("listbox");
        expect(btn.getAttribute("aria-expanded")).toBe("false");
        const listId = btn.getAttribute("aria-controls");
        expect(listId).toBeTruthy();
        expect(document.getElementById(listId!)?.getAttribute("role")).toBe("listbox");
        expect(document.getElementById(listId!)).toBe(list());
    });

    test("§7.1 the button renders the 'A' glyph, hidden from assistive tech", async () => {
        mount({ label: "Text size", sizes: SIZES.join(",") });
        await flush();
        const icon = document.body.querySelector<HTMLElement>(".text-size-chooser-icon")!;
        // U+0041 LATIN CAPITAL LETTER A — a letter, not a pictograph.
        expect(icon.textContent).toBe("A");
        expect(LATIN_CAPITAL_LETTER_A).toBe("A");
        expect(icon.getAttribute("aria-hidden")).toBe("true");
        expect(icon.closest("button")).toBe(button());
    });

    test("§7.1 no native <select> is rendered any more", async () => {
        mount({ label: "Text size", sizes: SIZES.join(",") });
        await flush();
        expect(document.body.querySelector("select")).toBeNull();
        expect(document.body.querySelector("option")).toBeNull();
    });

    test("§7.2 aria-label names the button and the listbox", async () => {
        mount({ label: "Choose text size", sizes: SIZES.join(",") });
        await flush();
        expect(button().getAttribute("aria-label")).toBe("Choose text size");
        expect(list().getAttribute("aria-label")).toBe("Choose text size");
    });

    test("§7.3 one option per size; the hidden input carries the supplied name and value", async () => {
        mount({ label: "Text size", sizes: SIZES.join(","), name: "scale" });
        await flush();
        expect(options().length).toBe(SIZES.length);
        expect(hiddenInput().name).toBe("scale");
        expect(hiddenInput().value).toBe("medium");
    });

    test("§7.4 the listbox is hidden until the button is activated", async () => {
        mount({ label: "Text size", sizes: SIZES.join(",") });
        await flush();
        expect(list().hasAttribute("hidden")).toBe(true);
        expect(list().getAttribute("tabindex")).toBe("-1");
        click(button());
        expect(list().hasAttribute("hidden")).toBe(false);
        expect(button().getAttribute("aria-expanded")).toBe("true");
    });

    test("§7.4 the active size is the aria-selected option", async () => {
        mount({ label: "Text size", sizes: SIZES.join(",") });
        await flush();
        click(button());
        const selected = document.body.querySelectorAll('[role="option"][aria-selected="true"]');
        expect(selected.length).toBe(1);
        expect(selected[0].textContent?.trim()).toBe("Medium");
    });

    test("§7.4 clicking an option selects it, applies it, and closes the listbox", async () => {
        mount({ label: "Text size", sizes: SIZES.join(",") });
        await flush();
        pick("x-large");
        await flush();
        expect(document.documentElement.dataset.textSize).toBe("x-large");
        expect(list().hasAttribute("hidden")).toBe(true);
        expect(button().getAttribute("aria-expanded")).toBe("false");
        expect(hiddenInput().value).toBe("x-large");
    });

    test("§7.5 default labels title-case the slug (no 'default' string)", async () => {
        mount({ label: "Text size", sizes: "small,x-large" });
        await flush();
        const text = document.body.textContent ?? "";
        expect(text).toContain("Small");
        expect(text).toContain("X Large");
        expect(text).not.toMatch(/default/i);
    });

    test("§7.5 sizeLabels override the default title-case label", async () => {
        mount({
            label: "Text size",
            sizes: "small,large",
            "size-labels": JSON.stringify({ small: "Compact", large: "Comfortable" }),
        });
        await flush();
        const text = document.body.textContent ?? "";
        expect(text).toContain("Compact");
        expect(text).toContain("Comfortable");
    });

    test("§7.5 labelFor delegates to sizeName so there is one title-casing rule", async () => {
        const el = mount({
            label: "Text size",
            sizes: "x-large",
            "size-labels": JSON.stringify({ small: "Compact" }),
        });
        await flush();
        // Unmapped slug → sizeName. Mapped slug → the override.
        expect(el.labelFor("x-large")).toBe(sizeName("x-large"));
        expect(el.labelFor("x-large")).toBe("X Large");
        expect(el.labelFor("small")).toBe("Compact");
    });
});

describe("<text-size-chooser> — application (§7.6–§7.11)", () => {
    test("§7.6 default initial value is 'medium' when present in sizes", async () => {
        mount({ label: "Text size", sizes: SIZES.join(",") });
        await flush();
        expect(document.documentElement.dataset.textSize).toBe("medium");
    });

    test("§7.6 default initial value falls back to sizes[0] when 'medium' is absent", async () => {
        mount({ label: "Text size", sizes: "small,large" });
        await flush();
        expect(document.documentElement.dataset.textSize).toBe("small");
    });

    test("§7.7 sets data-text-size on documentElement", async () => {
        mount({ label: "Text size", sizes: SIZES.join(",") });
        await flush();
        expect(document.documentElement.getAttribute("data-text-size")).toBe("medium");
    });

    test("§7.8 selecting an option updates data-text-size and fires textsizechange", async () => {
        const onChange = vi.fn();
        const el = mount({ label: "Text size", sizes: SIZES.join(",") });
        el.addEventListener("textsizechange", (e) => {
            onChange((e as CustomEvent<{ size: string }>).detail.size);
        });
        await flush();
        pick("x-large");
        await flush();
        expect(document.documentElement.dataset.textSize).toBe("x-large");
        expect(onChange).toHaveBeenLastCalledWith("x-large");
    });

    test("§7.9 persists to localStorage and reads back on a fresh mount", async () => {
        const first = mount({
            label: "Text size",
            sizes: SIZES.join(","),
            "storage-key": "lily-text-size",
        });
        await flush();
        pick("large");
        await flush();
        expect(localStorage.getItem("lily-text-size")).toBe("large");
        first.remove();
        resetRoot();

        mount({
            label: "Text size",
            sizes: SIZES.join(","),
            "storage-key": "lily-text-size",
        });
        await flush();
        expect(document.documentElement.dataset.textSize).toBe("large");
    });

    test("§7.10 a supplied non-empty value attribute wins over storage and defaults", async () => {
        localStorage.setItem("lily-text-size", "x-large");
        mount({
            label: "Text size",
            sizes: SIZES.join(","),
            value: "small",
            "storage-key": "lily-text-size",
            "default-value": "large",
        });
        await flush();
        expect(document.documentElement.dataset.textSize).toBe("small");
    });

    test("§7.11 a custom target receives data-text-size", async () => {
        const target = document.createElement("section");
        document.body.appendChild(target);
        const el = document.createElement("text-size-chooser") as TextSizeChooser;
        el.setAttribute("label", "Text size");
        el.setAttribute("sizes", SIZES.join(","));
        el.setAttribute("default-value", "large");
        el.target = target;
        document.body.appendChild(el);
        await flush();
        expect(target.getAttribute("data-text-size")).toBe("large");
        // Document root must remain untouched.
        expect(document.documentElement.hasAttribute("data-text-size")).toBe(false);
        target.remove();
    });
});

describe("<text-size-chooser> — element shape + property API (§7.12–§7.13)", () => {
    test("§7.12 element survives a re-render with its id/data-* intact", async () => {
        const el = mount({ label: "Text size", sizes: SIZES.join(",") });
        el.id = "ts";
        el.setAttribute("data-testid", "ts");
        await flush();
        // Force a re-render by changing sizes.
        el.setAttribute("sizes", "small,large");
        await flush();
        expect(document.getElementById("ts")).toBe(el);
        expect(el.getAttribute("data-testid")).toBe("ts");
        expect(el.querySelectorAll(".text-size-chooser-option").length).toBe(2);
    });

    test("§7.12 the consumer class is appended to the root class hook", async () => {
        mount({ label: "Text size", sizes: SIZES.join(","), class: "my-sizer" });
        await flush();
        const root = document.body.querySelector("div.text-size-chooser")!;
        expect(root.className).toBe("text-size-chooser my-sizer");
    });

    test("§7.13 setting el.sizes as an array mirrors the CSV attribute and re-renders", async () => {
        const el = mount({ label: "Text size", sizes: "small,large" });
        await flush();
        el.sizes = ["small", "medium", "large"];
        await flush();
        expect(el.getAttribute("sizes")).toBe("small,medium,large");
        expect(el.querySelectorAll(".text-size-chooser-option").length).toBe(3);
    });

    test("§7.13 setting el.sizeLabels as an object mirrors the JSON attribute and re-renders", async () => {
        const el = mount({ label: "Text size", sizes: "small,large" });
        await flush();
        el.sizeLabels = { small: "Compact", large: "Comfortable" };
        await flush();
        expect(el.getAttribute("size-labels")).toBe(
            JSON.stringify({ small: "Compact", large: "Comfortable" }),
        );
        const text = document.body.textContent ?? "";
        expect(text).toContain("Compact");
    });

    test("§7.13 list and option ids are unique across instances", async () => {
        mount({ label: "A", sizes: "small,large" });
        mount({ label: "B", sizes: "small,large" });
        await flush();
        const ids = options().map((o) => o.id);
        expect(new Set(ids).size).toBe(ids.length);
        const listIds = [...document.body.querySelectorAll(".text-size-chooser-list")].map(
            (l) => l.id,
        );
        expect(new Set(listIds).size).toBe(2);
    });
});

describe("<text-size-chooser> — keyboard contract (APG listbox, §7.14–§7.18)", () => {
    async function openWith(key: string): Promise<void> {
        mount({ label: "Text size", sizes: SIZES.join(",") });
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
        // "medium" is the resolved initial value, index 1.
        expect(list().getAttribute("aria-activedescendant")).toBe(options()[1].id);
        expect(options()[1].hasAttribute("data-active")).toBe(true);
    });

    test("§7.14 ArrowUp opens with the last option active", async () => {
        await openWith("ArrowUp");
        expect(list().getAttribute("aria-activedescendant")).toBe(
            options()[SIZES.length - 1].id,
        );
    });

    test("§7.15 ArrowDown / ArrowUp move the active descendant and clamp", async () => {
        await openWith("ArrowDown");
        expect(list().getAttribute("aria-activedescendant")).toBe(options()[1].id);
        press(list(), "ArrowUp");
        expect(list().getAttribute("aria-activedescendant")).toBe(options()[0].id);
        // Clamp at the top.
        press(list(), "ArrowUp");
        expect(list().getAttribute("aria-activedescendant")).toBe(options()[0].id);
        // Clamp at the bottom.
        for (let i = 0; i < SIZES.length + 2; i++) press(list(), "ArrowDown");
        expect(list().getAttribute("aria-activedescendant")).toBe(
            options()[SIZES.length - 1].id,
        );
    });

    test("§7.15 Home and End jump to the first and last option", async () => {
        await openWith("ArrowDown");
        press(list(), "End");
        expect(list().getAttribute("aria-activedescendant")).toBe(
            options()[SIZES.length - 1].id,
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
        // medium (index 1) → ArrowDown → large (index 2).
        expect(document.documentElement.dataset.textSize).toBe("large");
        expect(document.activeElement).toBe(button());
        expect(list().hasAttribute("aria-activedescendant")).toBe(false);
    });

    test("§7.16 Space also selects the active option", async () => {
        await openWith("ArrowDown");
        press(list(), "End");
        press(list(), " ");
        await flush();
        expect(document.documentElement.dataset.textSize).toBe("x-large");
        expect(list().hasAttribute("hidden")).toBe(true);
    });

    test("§7.17 Escape closes without changing the size and refocuses the button", async () => {
        await openWith("ArrowDown");
        press(list(), "ArrowDown");
        press(list(), "Escape");
        await flush();
        expect(list().hasAttribute("hidden")).toBe(true);
        expect(document.documentElement.dataset.textSize).toBe("medium");
        expect(document.activeElement).toBe(button());
    });

    test("§7.17 Tab closes without stealing focus back to the button", async () => {
        await openWith("ArrowDown");
        press(list(), "Tab");
        await flush();
        expect(list().hasAttribute("hidden")).toBe(true);
        expect(document.activeElement).not.toBe(button());
    });

    test("§7.18 typeahead moves the active descendant by label prefix", async () => {
        await openWith("ArrowDown");
        press(list(), "s");
        // "Small" is index 0 in SIZES.
        expect(list().getAttribute("aria-activedescendant")).toBe(options()[0].id);
    });

    test("§7.18 a click outside the root closes the listbox", async () => {
        await openWith("ArrowDown");
        expect(list().hasAttribute("hidden")).toBe(false);
        click(document.body);
        expect(list().hasAttribute("hidden")).toBe(true);
    });
});

describe("<text-size-chooser> — custom rendering by subclass (§7.19)", () => {
    class GlyphlessTextSizeChooser extends TextSizeChooser {
        renderButtonContent(): Node {
            const span = document.createElement("span");
            span.setAttribute("data-testid", "custom");
            span.setAttribute("data-open", String(this.open));
            span.setAttribute("data-value", this.value);
            span.setAttribute("data-label-x-large", this.labelFor("x-large"));
            span.textContent = "custom glyph";
            return span;
        }
    }
    if (!customElements.get("glyphless-text-size-chooser")) {
        customElements.define("glyphless-text-size-chooser", GlyphlessTextSizeChooser);
    }

    test("§7.19 renderButtonContent replaces the glyph and keeps the aria wiring", async () => {
        const el = document.createElement(
            "glyphless-text-size-chooser",
        ) as GlyphlessTextSizeChooser;
        el.setAttribute("label", "Text size");
        el.setAttribute("sizes", SIZES.join(","));
        el.setAttribute("value", "large");
        document.body.appendChild(el);
        await flush();

        const custom = el.querySelector<HTMLElement>('[data-testid="custom"]')!;
        expect(custom.closest("button")?.className).toBe("text-size-chooser-button");
        expect(el.querySelector(".text-size-chooser-icon")).toBeNull();
        expect(custom.getAttribute("data-open")).toBe("false");
        expect(custom.getAttribute("data-value")).toBe("large");
        expect(custom.getAttribute("data-label-x-large")).toBe("X Large");

        // The button/listbox structure and aria wiring are untouched.
        const btn = el.querySelector<HTMLButtonElement>(".text-size-chooser-button")!;
        expect(btn.getAttribute("aria-haspopup")).toBe("listbox");
        expect(btn.getAttribute("aria-label")).toBe("Text size");
        expect(el.querySelector(`#${btn.getAttribute("aria-controls")}`)).not.toBeNull();
    });

    test("§7.19 renderButtonContent re-runs when value or open changes", async () => {
        const el = document.createElement(
            "glyphless-text-size-chooser",
        ) as GlyphlessTextSizeChooser;
        el.setAttribute("label", "Text size");
        el.setAttribute("sizes", SIZES.join(","));
        document.body.appendChild(el);
        await flush();
        const read = (attr: string) =>
            el.querySelector('[data-testid="custom"]')!.getAttribute(attr);

        expect(read("data-value")).toBe("medium");

        // A value change must refresh the button content, mirroring the
        // reactive `children` snippet in the other frameworks.
        el.value = "x-large";
        await flush();
        expect(read("data-value")).toBe("x-large");

        // So must opening the listbox.
        el.openList();
        expect(read("data-open")).toBe("true");
        el.closeList();
        expect(read("data-open")).toBe("false");
    });

    test("§7.19 a subclass still fires textsizechange through the base lifecycle", async () => {
        const el = document.createElement(
            "glyphless-text-size-chooser",
        ) as GlyphlessTextSizeChooser;
        el.setAttribute("label", "Text size");
        el.setAttribute("sizes", SIZES.join(","));
        document.body.appendChild(el);
        await flush();
        let detail: { size: string } | undefined;
        el.addEventListener("textsizechange", (e) => {
            detail = (e as CustomEvent<{ size: string }>).detail;
        });
        el.value = "large";
        expect(detail).toEqual({ size: "large" });
    });
});
