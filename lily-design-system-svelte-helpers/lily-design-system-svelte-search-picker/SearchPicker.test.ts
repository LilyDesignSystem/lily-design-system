import { render, screen, fireEvent } from "@testing-library/svelte";
import { afterEach, describe, expect, test, vi } from "vitest";

import SearchPicker, {
    RETURN_SYMBOL,
    searchHref,
} from "./SearchPicker.svelte";

const LABELS = {
    label: "Search this site",
    inputLabel: "Search terms",
    submitLabel: "Search",
};

function flush(): Promise<void> {
    return new Promise((r) => setTimeout(r, 0));
}

/** Render with a spy `navigate`, open the panel, and return the parts. */
async function openPanel(props: Record<string, unknown> = {}) {
    const navigate = vi.fn();
    render(SearchPicker, { props: { ...LABELS, navigate, ...props } });
    const button = screen.getByRole("button", { name: LABELS.label });
    await fireEvent.click(button);
    await flush();
    const panel = document.querySelector(".search-picker-panel") as HTMLElement;
    const input = screen.getByRole("searchbox", { name: LABELS.inputLabel }) as HTMLInputElement;
    const submit = screen.getByRole("button", { name: LABELS.submitLabel });
    const form = document.querySelector(".search-picker-form") as HTMLFormElement;
    return { navigate, button, panel, input, submit, form };
}

/** Type into the field (fires `input`, which the bound value listens to). */
async function type(input: HTMLInputElement, text: string): Promise<void> {
    await fireEvent.input(input, { target: { value: text } });
}

afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

describe("SearchPicker — structure (§7.1–§7.6)", () => {
    test("§7.1 renders a named disclosure button controlling the panel", () => {
        render(SearchPicker, { props: LABELS });
        const button = screen.getByRole("button", { name: LABELS.label });
        expect(button.className).toContain("search-picker-button");
        expect(button.getAttribute("type")).toBe("button");
        expect(button.getAttribute("aria-expanded")).toBe("false");
        const panel = document.querySelector(".search-picker-panel")!;
        expect(button.getAttribute("aria-controls")).toBe(panel.id);
    });

    test("§7.2 the panel is hidden until the button is activated, and toggles", async () => {
        render(SearchPicker, { props: LABELS });
        const button = screen.getByRole("button", { name: LABELS.label });
        const panel = document.querySelector(".search-picker-panel")!;
        expect(panel.hasAttribute("hidden")).toBe(true);
        await fireEvent.click(button);
        expect(panel.hasAttribute("hidden")).toBe(false);
        expect(button.getAttribute("aria-expanded")).toBe("true");
        await fireEvent.click(button);
        expect(panel.hasAttribute("hidden")).toBe(true);
        expect(button.getAttribute("aria-expanded")).toBe("false");
    });

    test("§7.3 the default icon is an aria-hidden magnifying-glass SVG", () => {
        render(SearchPicker, { props: LABELS });
        const icon = document.querySelector(".search-picker-icon")!;
        expect(icon.tagName.toLowerCase()).toBe("svg");
        expect(icon.getAttribute("aria-hidden")).toBe("true");
        expect(icon.closest("button")?.className).toContain("search-picker-button");
        expect(icon.querySelector("circle")).not.toBeNull();
        expect(icon.querySelector("path")).not.toBeNull();
    });

    test("§7.4 children replaces the icon and receives ChildArgs", async () => {
        const customSnippet = (($anchor: Comment, args: any) => {
            const node = document.createElement("span");
            const a = args();
            node.setAttribute("data-testid", "custom");
            node.setAttribute("data-open", String(a.open));
            node.setAttribute("data-query", a.query);
            $anchor.before(node);
        }) as any;
        render(SearchPicker, { props: { ...LABELS, value: "foo", children: customSnippet } });
        await flush();
        const custom = screen.getByTestId("custom");
        expect(custom.closest("button")?.className).toContain("search-picker-button");
        expect(document.querySelector(".search-picker-icon")).toBeNull();
        expect(custom.getAttribute("data-open")).toBe("false");
        expect(custom.getAttribute("data-query")).toBe("foo");
    });

    test("§7.5 the panel holds a named search form, field, and submit button after the field", async () => {
        const { input, submit, form } = await openPanel();
        expect(form.getAttribute("role")).toBe("search");
        expect(form.getAttribute("aria-label")).toBe(LABELS.label);
        expect(input.getAttribute("type")).toBe("search");
        expect(input.className).toContain("search-picker-input");
        expect(submit.getAttribute("type")).toBe("submit");
        expect(submit.className).toContain("search-picker-submit");
        expect(input.compareDocumentPosition(submit) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    test("§7.6 the submit button shows ⏎ in an aria-hidden span", async () => {
        const { submit } = await openPanel();
        const symbol = submit.querySelector(".search-picker-submit-symbol")!;
        expect(symbol.textContent).toBe("⏎");
        expect(symbol.getAttribute("aria-hidden")).toBe("true");
    });
});

describe("SearchPicker — searching (§7.7–§7.15)", () => {
    test("§7.7 opening focuses the search field with preventScroll", async () => {
        const focusSpy = vi.spyOn(HTMLElement.prototype, "focus");
        const { input } = await openPanel();
        expect(document.activeElement).toBe(input);
        expect(focusSpy).toHaveBeenLastCalledWith({ preventScroll: true });
    });

    test("§7.8 Return in the field (form submit) navigates to /?<query>", async () => {
        const { navigate, input, form } = await openPanel();
        await type(input, "foo");
        // dispatchEvent returns false when cancelled: the native GET (which
        // would send /?name=value) must never run.
        expect(await fireEvent.submit(form)).toBe(false);
        expect(navigate).toHaveBeenCalledWith("/?foo");
    });

    test("§7.9 clicking the submit button navigates the same way", async () => {
        const { navigate, input, submit } = await openPanel();
        await type(input, "foo");
        await fireEvent.click(submit);
        expect(navigate).toHaveBeenCalledWith("/?foo");
    });

    test("§7.10 the query is trimmed and URI-encoded", async () => {
        const { navigate, input, form } = await openPanel();
        await type(input, "  foo bar ");
        await fireEvent.submit(form);
        expect(navigate).toHaveBeenLastCalledWith("/?foo%20bar");
        await fireEvent.click(screen.getByRole("button", { name: LABELS.label }));
        await type(input, "a&b");
        await fireEvent.submit(form);
        expect(navigate).toHaveBeenLastCalledWith("/?a%26b");
    });

    test("§7.11 an empty or whitespace-only query does nothing and stays open", async () => {
        const { navigate, input, form, panel } = await openPanel();
        await fireEvent.submit(form);
        await type(input, "   ");
        await fireEvent.submit(form);
        expect(navigate).not.toHaveBeenCalled();
        expect(panel.hasAttribute("hidden")).toBe(false);
    });

    test("§7.12 action changes the path", async () => {
        const { navigate, input, form } = await openPanel({ action: "/search" });
        await type(input, "foo");
        await fireEvent.submit(form);
        expect(navigate).toHaveBeenCalledWith("/search?foo");
    });

    test("§7.13 onSearch fires with the query and href before navigate", async () => {
        const calls: string[] = [];
        const onSearch = vi.fn((q: string, h: string) => calls.push(`search:${q}:${h}`));
        const navigate = vi.fn((h: string) => calls.push(`navigate:${h}`));
        render(SearchPicker, { props: { ...LABELS, onSearch, navigate } });
        await fireEvent.click(screen.getByRole("button", { name: LABELS.label }));
        const input = screen.getByRole("searchbox", { name: LABELS.inputLabel }) as HTMLInputElement;
        await type(input, " foo ");
        await fireEvent.submit(document.querySelector(".search-picker-form")!);
        expect(calls).toEqual(["search:foo:/?foo", "navigate:/?foo"]);
    });

    test("§7.14 without navigate, the default calls location.assign", async () => {
        const assign = vi.fn();
        vi.stubGlobal("location", { assign });
        render(SearchPicker, { props: LABELS });
        await fireEvent.click(screen.getByRole("button", { name: LABELS.label }));
        const input = screen.getByRole("searchbox", { name: LABELS.inputLabel }) as HTMLInputElement;
        await type(input, "foo");
        await fireEvent.submit(document.querySelector(".search-picker-form")!);
        expect(assign).toHaveBeenCalledWith("/?foo");
    });

    test("§7.15 a search closes the panel", async () => {
        const { input, form, panel, button } = await openPanel();
        await type(input, "foo");
        await fireEvent.submit(form);
        expect(panel.hasAttribute("hidden")).toBe(true);
        expect(button.getAttribute("aria-expanded")).toBe("false");
    });
});

describe("SearchPicker — closing (§7.16–§7.18)", () => {
    test("§7.16 Escape closes and returns focus to the button with preventScroll", async () => {
        const { input, panel, button } = await openPanel();
        const focusSpy = vi.spyOn(HTMLElement.prototype, "focus");
        await fireEvent.keyDown(input, { key: "Escape" });
        await flush();
        expect(panel.hasAttribute("hidden")).toBe(true);
        expect(document.activeElement).toBe(button);
        expect(focusSpy).toHaveBeenLastCalledWith({ preventScroll: true });
    });

    test("§7.17 clicking outside closes the panel", async () => {
        const { panel } = await openPanel();
        await fireEvent.click(document.body);
        expect(panel.hasAttribute("hidden")).toBe(true);
    });

    test("§7.18 focus moving outside the root closes the panel", async () => {
        const outside = document.createElement("button");
        document.body.appendChild(outside);
        const { input, panel } = await openPanel();
        await fireEvent.focusOut(input, { relatedTarget: outside });
        expect(panel.hasAttribute("hidden")).toBe(true);
        outside.remove();
    });
});

describe("SearchPicker — value, exports, root (§7.19–§7.23)", () => {
    test("§7.19 an initial value pre-fills the field, and typing replaces it", async () => {
        const { navigate, input, form } = await openPanel({ value: "preset" });
        expect(input.value).toBe("preset");
        await type(input, "typed");
        await fireEvent.submit(form);
        expect(navigate).toHaveBeenCalledWith("/?typed");
    });

    test("§7.20 searchHref builds the destination the component uses", () => {
        expect(searchHref("foo")).toBe("/?foo");
        expect(searchHref(" foo bar ")).toBe("/?foo%20bar");
        expect(searchHref("foo", "/search")).toBe("/search?foo");
    });

    test("§7.21 RETURN_SYMBOL is the bare ⏎ (U+23CE)", () => {
        expect(RETURN_SYMBOL).toBe("⏎");
        expect(RETURN_SYMBOL.codePointAt(0)).toBe(0x23ce);
        expect(RETURN_SYMBOL.length).toBe(1);
    });

    test("§7.22 class and rest props land on the root", () => {
        render(SearchPicker, { props: { ...LABELS, class: "site-search", "data-testid": "root" } });
        const root = screen.getByTestId("root");
        expect(root.className).toBe("search-picker site-search");
    });

    test("§7.23 no user-facing text of its own beyond the hidden ⏎", async () => {
        const { input } = await openPanel();
        expect(input.hasAttribute("placeholder")).toBe(false);
        const root = document.querySelector(".search-picker")!;
        const texts: string[] = [];
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
            const t = walker.currentNode.textContent!.trim();
            if (t) texts.push(t);
        }
        expect(texts).toEqual(["⏎"]);
    });
});

describe("SearchPicker — Safari focus regression (§7.24)", () => {
    test("§7.24 a focusout with no relatedTarget leaves the panel open", async () => {
        // Safari does not focus a <button> on click, so pressing ⏎ blurs the
        // field with relatedTarget = null; closing then hid the panel before
        // the click landed (reproduced in real WebKit, 2026-10-02).
        const { navigate, input, submit, panel } = await openPanel();
        await type(input, "foo");
        await fireEvent.focusOut(input, { relatedTarget: null });
        expect(panel.hasAttribute("hidden")).toBe(false);
        await fireEvent.click(submit);
        expect(navigate).toHaveBeenCalledWith("/?foo");
    });
});
