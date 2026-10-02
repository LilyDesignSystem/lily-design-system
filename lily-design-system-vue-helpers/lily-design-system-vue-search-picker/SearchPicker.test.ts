import { mount, type VueWrapper } from "@vue/test-utils";
import { afterEach, describe, expect, test, vi } from "vitest";
import { h, nextTick } from "vue";

import SearchPicker, { RETURN_SYMBOL, searchHref } from "./SearchPicker.vue";

const LABELS = {
    label: "Search this site",
    inputLabel: "Search terms",
    submitLabel: "Search",
};

/** Let Vue's scheduler and the nextTick-chained focus moves settle. */
async function flush(): Promise<void> {
    await nextTick();
    await new Promise((r) => setTimeout(r, 0));
    await nextTick();
}

const wrappers: VueWrapper<any>[] = [];

function build(props: Record<string, unknown> = {}, options: Record<string, unknown> = {}) {
    const wrapper = mount(SearchPicker, {
        props: { ...LABELS, ...props },
        attachTo: document.body,
        ...options,
    });
    wrappers.push(wrapper);
    return wrapper;
}

function parts(wrapper: VueWrapper<any>) {
    return {
        button: wrapper.find("button.search-picker-button"),
        panel: wrapper.find("div.search-picker-panel"),
        form: wrapper.find("form.search-picker-form"),
        input: wrapper.find("input.search-picker-input"),
        submit: wrapper.find("button.search-picker-submit"),
    };
}

/** Render with a spy `navigate`, open the panel, and return the parts. */
async function openPanel(props: Record<string, unknown> = {}) {
    const navigate = vi.fn();
    const wrapper = build({ navigate, ...props });
    const p = parts(wrapper);
    await p.button.trigger("click");
    await flush();
    return { wrapper, navigate, ...p };
}

/** Dispatch a cancelable submit; returns dispatchEvent's result (false = cancelled). */
async function submit(form: { element: Element }): Promise<boolean> {
    const result = form.element.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true }),
    );
    await flush();
    return result;
}

afterEach(() => {
    while (wrappers.length) wrappers.pop()!.unmount();
    document.body.innerHTML = "";
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

describe("SearchPicker — structure (§7.1–§7.6)", () => {
    test("§7.1 renders a named disclosure button controlling the panel", () => {
        const { button, panel } = parts(build());
        expect(button.attributes("aria-label")).toBe(LABELS.label);
        expect(button.attributes("type")).toBe("button");
        expect(button.attributes("aria-expanded")).toBe("false");
        expect(panel.attributes("id")).toBeTruthy();
        expect(button.attributes("aria-controls")).toBe(panel.attributes("id"));
    });

    test("§7.2 the panel is hidden until the button is activated, and toggles", async () => {
        const wrapper = build();
        const { button, panel } = parts(wrapper);
        expect(panel.element.hasAttribute("hidden")).toBe(true);
        await button.trigger("click");
        await flush();
        expect(panel.element.hasAttribute("hidden")).toBe(false);
        expect(button.attributes("aria-expanded")).toBe("true");
        await button.trigger("click");
        await flush();
        expect(panel.element.hasAttribute("hidden")).toBe(true);
        expect(button.attributes("aria-expanded")).toBe("false");
    });

    test("§7.3 the default icon is an aria-hidden magnifying-glass SVG", () => {
        const wrapper = build();
        const icon = wrapper.find(".search-picker-icon");
        expect(icon.element.tagName.toLowerCase()).toBe("svg");
        expect(icon.attributes("aria-hidden")).toBe("true");
        expect(icon.element.closest("button")?.className).toContain("search-picker-button");
        expect(icon.find("circle").exists()).toBe(true);
        expect(icon.find("path").exists()).toBe(true);
    });

    test("§7.4 the default slot replaces the icon and receives SlotArgs", async () => {
        const wrapper = build(
            { value: "foo" },
            {
                slots: {
                    default: (args: { open: boolean; query: string }) =>
                        h("span", {
                            "data-testid": "custom",
                            "data-open": String(args.open),
                            "data-query": args.query,
                        }),
                },
            },
        );
        await flush();
        const custom = wrapper.find('[data-testid="custom"]');
        expect(custom.element.closest("button")?.className).toContain("search-picker-button");
        expect(wrapper.find(".search-picker-icon").exists()).toBe(false);
        expect(custom.attributes("data-open")).toBe("false");
        expect(custom.attributes("data-query")).toBe("foo");
    });

    test("§7.5 the panel holds a named search form, field, and submit button after the field", async () => {
        const { form, input, submit: btn } = await openPanel();
        expect(form.attributes("role")).toBe("search");
        expect(form.attributes("aria-label")).toBe(LABELS.label);
        expect(form.attributes("method")).toBe("get");
        expect(input.attributes("type")).toBe("search");
        expect(input.attributes("aria-label")).toBe(LABELS.inputLabel);
        expect(input.attributes("enterkeyhint")).toBe("search");
        expect(btn.attributes("type")).toBe("submit");
        expect(btn.attributes("aria-label")).toBe(LABELS.submitLabel);
        expect(
            input.element.compareDocumentPosition(btn.element) & Node.DOCUMENT_POSITION_FOLLOWING,
        ).toBeTruthy();
    });

    test("§7.6 the submit button shows ⏎ in an aria-hidden span", async () => {
        const { submit: btn } = await openPanel();
        const symbol = btn.find(".search-picker-submit-symbol");
        expect(symbol.text()).toBe("⏎");
        expect(symbol.attributes("aria-hidden")).toBe("true");
    });
});

describe("SearchPicker — searching (§7.7–§7.15)", () => {
    test("§7.7 opening focuses the search field with preventScroll", async () => {
        const focusSpy = vi.spyOn(HTMLElement.prototype, "focus");
        const { input } = await openPanel();
        expect(document.activeElement).toBe(input.element);
        expect(focusSpy).toHaveBeenLastCalledWith({ preventScroll: true });
    });

    test("§7.8 Return in the field (form submit) navigates to /?<query>, cancelling the native submit", async () => {
        const { navigate, input, form } = await openPanel();
        await input.setValue("foo");
        // dispatchEvent returns false when cancelled: the native GET (which
        // would send /?name=value) must never run.
        expect(await submit(form)).toBe(false);
        expect(navigate).toHaveBeenCalledWith("/?foo");
    });

    test("§7.9 clicking the submit button navigates the same way", async () => {
        const { navigate, input, submit: btn } = await openPanel();
        await input.setValue("foo");
        // jsdom implements implicit submission: clicking a submit button
        // fires the form's submit event.
        await btn.trigger("click");
        await flush();
        expect(navigate).toHaveBeenCalledWith("/?foo");
    });

    test("§7.10 the query is trimmed and URI-encoded", async () => {
        const { navigate, input, form, button } = await openPanel();
        await input.setValue("  foo bar ");
        await submit(form);
        expect(navigate).toHaveBeenLastCalledWith("/?foo%20bar");
        await button.trigger("click");
        await flush();
        await input.setValue("a&b");
        await submit(form);
        expect(navigate).toHaveBeenLastCalledWith("/?a%26b");
    });

    test("§7.11 an empty or whitespace-only query does nothing and stays open", async () => {
        const { navigate, input, form, panel } = await openPanel();
        await submit(form);
        await input.setValue("   ");
        await submit(form);
        expect(navigate).not.toHaveBeenCalled();
        expect(panel.element.hasAttribute("hidden")).toBe(false);
    });

    test("§7.12 action changes the path", async () => {
        const { navigate, input, form } = await openPanel({ action: "/search" });
        expect(form.attributes("action")).toBe("/search");
        await input.setValue("foo");
        await submit(form);
        expect(navigate).toHaveBeenCalledWith("/search?foo");
    });

    test("§7.13 the search event fires with the query and href before navigate", async () => {
        const calls: string[] = [];
        const navigate = vi.fn((href: string) => calls.push(`navigate:${href}`));
        const onSearch = (q: string, href: string) => calls.push(`search:${q}:${href}`);
        const { wrapper, input, form } = await openPanel({ navigate, onSearch });
        await input.setValue(" foo ");
        await submit(form);
        expect(wrapper.emitted("search")).toEqual([["foo", "/?foo"]]);
        expect(calls).toEqual(["search:foo:/?foo", "navigate:/?foo"]);
    });

    test("§7.14 without navigate, the default calls location.assign", async () => {
        const assign = vi.fn();
        vi.stubGlobal("location", { assign });
        const wrapper = build();
        const { button, input, form } = parts(wrapper);
        await button.trigger("click");
        await flush();
        await input.setValue("foo");
        await submit(form);
        expect(assign).toHaveBeenCalledWith("/?foo");
    });

    test("§7.15 a search closes the panel", async () => {
        const { input, form, panel, button } = await openPanel();
        await input.setValue("foo");
        await submit(form);
        expect(panel.element.hasAttribute("hidden")).toBe(true);
        expect(button.attributes("aria-expanded")).toBe("false");
    });
});

describe("SearchPicker — closing (§7.16–§7.18)", () => {
    test("§7.16 Escape closes and returns focus to the button with preventScroll", async () => {
        const { input, panel, button } = await openPanel();
        const focusSpy = vi.spyOn(HTMLElement.prototype, "focus");
        await input.trigger("keydown", { key: "Escape" });
        await flush();
        expect(panel.element.hasAttribute("hidden")).toBe(true);
        expect(document.activeElement).toBe(button.element);
        expect(focusSpy).toHaveBeenLastCalledWith({ preventScroll: true });
    });

    test("§7.17 clicking outside closes the panel", async () => {
        const { panel } = await openPanel();
        document.body.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        await flush();
        expect(panel.element.hasAttribute("hidden")).toBe(true);
    });

    test("§7.18 focus moving to an element outside the root closes the panel", async () => {
        const outside = document.createElement("button");
        document.body.appendChild(outside);
        const { input, panel } = await openPanel();
        await input.trigger("focusout", { relatedTarget: outside });
        await flush();
        expect(panel.element.hasAttribute("hidden")).toBe(true);
    });
});

describe("SearchPicker — Safari focus regression (§7.24)", () => {
    test("§7.24 a focusout with no relatedTarget leaves the panel open, and ⏎ still searches", async () => {
        const { navigate, input, panel, submit: btn } = await openPanel();
        await input.setValue("foo");
        // Safari does not focus a <button> on click: pressing ⏎ blurs the
        // field with relatedTarget = null before the click lands.
        await input.trigger("focusout", { relatedTarget: null });
        await flush();
        expect(panel.element.hasAttribute("hidden")).toBe(false);
        await btn.trigger("click");
        await flush();
        expect(navigate).toHaveBeenCalledWith("/?foo");
    });
});

describe("SearchPicker — value, exports, root (§7.19–§7.23)", () => {
    test("§7.19 an initial value pre-fills the field, and typing updates v-model:value", async () => {
        const { wrapper, navigate, input, form } = await openPanel({ value: "preset" });
        expect((input.element as HTMLInputElement).value).toBe("preset");
        await input.setValue("typed");
        expect(wrapper.emitted("update:value")?.at(-1)).toEqual(["typed"]);
        await submit(form);
        expect(navigate).toHaveBeenCalledWith("/?typed");
        // A controlled value written back from the parent reaches the field.
        await wrapper.setProps({ value: "from-parent" });
        expect((input.element as HTMLInputElement).value).toBe("from-parent");
    });

    test("§7.20 searchHref builds the destination the component uses", () => {
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

    test("§7.22 class is appended to the root and attrs fall through onto it", () => {
        const wrapper = build({}, { attrs: { "data-testid": "root", id: "site-search" } });
        const root = wrapper.find('[data-testid="root"]');
        expect(root.element).toBe(wrapper.element);
        expect(root.attributes("id")).toBe("site-search");
        const withClass = build({ class: "site-search" });
        expect(withClass.element.className).toBe("search-picker site-search");
    });

    test("§7.23 no user-facing text of its own beyond the hidden ⏎", async () => {
        const { wrapper, input } = await openPanel();
        expect(input.element.hasAttribute("placeholder")).toBe(false);
        const texts: string[] = [];
        const walker = document.createTreeWalker(wrapper.element, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
            const t = walker.currentNode.textContent!.trim();
            if (t) texts.push(t);
        }
        expect(texts).toEqual(["⏎"]);
    });
});
