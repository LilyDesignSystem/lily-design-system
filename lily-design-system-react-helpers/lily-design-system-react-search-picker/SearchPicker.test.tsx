import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

import SearchPicker, {
    RETURN_SYMBOL,
    nextSearchPickerId,
    searchHref,
    type Props,
} from "./SearchPicker";

const LABELS = {
    label: "Search this site",
    inputLabel: "Search terms",
    submitLabel: "Search",
};

/** Render with a spy `navigate`, open the panel, and return the parts. */
function openPanel(props: Partial<Props> = {}) {
    const navigate = vi.fn();
    render(<SearchPicker {...LABELS} navigate={navigate} {...props} />);
    const button = screen.getByRole("button", { name: LABELS.label });
    fireEvent.click(button);
    const panel = document.querySelector(".search-picker-panel") as HTMLElement;
    const input = screen.getByRole("searchbox", { name: LABELS.inputLabel }) as HTMLInputElement;
    const submit = screen.getByRole("button", { name: LABELS.submitLabel });
    const form = document.querySelector(".search-picker-form") as HTMLFormElement;
    return { navigate, button, panel, input, submit, form };
}

/** Type into the field (fires the `change` React listens to). */
function type(input: HTMLInputElement, text: string): void {
    fireEvent.change(input, { target: { value: text } });
}

afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

describe("SearchPicker — structure (§7.1–§7.6)", () => {
    test("§7.1 renders a named disclosure button controlling the panel", () => {
        render(<SearchPicker {...LABELS} />);
        const button = screen.getByRole("button", { name: LABELS.label });
        expect(button.className).toContain("search-picker-button");
        expect(button.getAttribute("type")).toBe("button");
        expect(button.getAttribute("aria-expanded")).toBe("false");
        const panel = document.querySelector(".search-picker-panel")!;
        expect(panel.id).not.toBe("");
        expect(button.getAttribute("aria-controls")).toBe(panel.id);
    });

    test("§7.2 the panel is hidden until the button is activated, and toggles", () => {
        render(<SearchPicker {...LABELS} />);
        const button = screen.getByRole("button", { name: LABELS.label });
        const panel = document.querySelector(".search-picker-panel")!;
        expect(panel.hasAttribute("hidden")).toBe(true);
        fireEvent.click(button);
        expect(panel.hasAttribute("hidden")).toBe(false);
        expect(button.getAttribute("aria-expanded")).toBe("true");
        fireEvent.click(button);
        expect(panel.hasAttribute("hidden")).toBe(true);
        expect(button.getAttribute("aria-expanded")).toBe("false");
    });

    test("§7.3 the default icon is an aria-hidden magnifying-glass SVG", () => {
        render(<SearchPicker {...LABELS} />);
        const icon = document.querySelector(".search-picker-icon")!;
        expect(icon.tagName.toLowerCase()).toBe("svg");
        expect(icon.getAttribute("aria-hidden")).toBe("true");
        expect(icon.getAttribute("stroke-width")).toBe("1.6");
        expect(icon.closest("button")?.className).toContain("search-picker-button");
        expect(icon.querySelector("circle")).not.toBeNull();
        expect(icon.querySelector("path")?.getAttribute("d")).toBe("M10.5 10.5 14 14");
    });

    test("§7.4 children replaces the icon and receives ChildArgs", () => {
        render(
            <SearchPicker {...LABELS} defaultValue="foo">
                {({ open, query }) => (
                    <span data-testid="custom" data-open={String(open)} data-query={query} />
                )}
            </SearchPicker>,
        );
        const custom = screen.getByTestId("custom");
        expect(custom.closest("button")?.className).toContain("search-picker-button");
        expect(document.querySelector(".search-picker-icon")).toBeNull();
        expect(custom.getAttribute("data-open")).toBe("false");
        expect(custom.getAttribute("data-query")).toBe("foo");
        fireEvent.click(screen.getByRole("button", { name: LABELS.label }));
        expect(screen.getByTestId("custom").getAttribute("data-open")).toBe("true");
    });

    test("§7.5 the panel holds a named search form, field, and submit button after the field", () => {
        const { input, submit, form } = openPanel();
        expect(form.getAttribute("role")).toBe("search");
        expect(form.getAttribute("aria-label")).toBe(LABELS.label);
        expect(form.getAttribute("method")).toBe("get");
        expect(input.getAttribute("type")).toBe("search");
        expect(input.getAttribute("enterkeyhint")).toBe("search");
        expect(input.className).toContain("search-picker-input");
        expect(submit.getAttribute("type")).toBe("submit");
        expect(submit.className).toContain("search-picker-submit");
        expect(input.compareDocumentPosition(submit) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    test("§7.6 the submit button shows ⏎ in an aria-hidden span", () => {
        const { submit } = openPanel();
        const symbol = submit.querySelector(".search-picker-submit-symbol")!;
        expect(symbol.textContent).toBe("⏎");
        expect(symbol.getAttribute("aria-hidden")).toBe("true");
    });
});

describe("SearchPicker — searching (§7.7–§7.15)", () => {
    test("§7.7 opening focuses the search field with preventScroll", () => {
        const focusSpy = vi.spyOn(HTMLElement.prototype, "focus");
        const { input } = openPanel();
        expect(document.activeElement).toBe(input);
        expect(focusSpy).toHaveBeenLastCalledWith({ preventScroll: true });
    });

    test("§7.8 Return in the field (form submit) navigates to /?<query>", () => {
        const { navigate, input, form } = openPanel();
        type(input, "foo");
        // dispatchEvent returns false when cancelled: the native GET (which
        // would send /?name=value) must never run.
        expect(fireEvent.submit(form)).toBe(false);
        expect(navigate).toHaveBeenCalledWith("/?foo");
    });

    test("§7.9 clicking the submit button navigates the same way", () => {
        const { navigate, input, submit } = openPanel();
        type(input, "foo");
        fireEvent.click(submit);
        expect(navigate).toHaveBeenCalledWith("/?foo");
    });

    test("§7.10 the query is trimmed and URI-encoded", () => {
        const { navigate, input, form } = openPanel();
        type(input, "  foo bar ");
        fireEvent.submit(form);
        expect(navigate).toHaveBeenLastCalledWith("/?foo%20bar");
        fireEvent.click(screen.getByRole("button", { name: LABELS.label }));
        type(input, "a&b");
        fireEvent.submit(form);
        expect(navigate).toHaveBeenLastCalledWith("/?a%26b");
    });

    test("§7.11 an empty or whitespace-only query does nothing and stays open", () => {
        const { navigate, input, form, panel } = openPanel();
        fireEvent.submit(form);
        type(input, "   ");
        fireEvent.submit(form);
        expect(navigate).not.toHaveBeenCalled();
        expect(panel.hasAttribute("hidden")).toBe(false);
    });

    test("§7.12 action changes the path", () => {
        const { navigate, input, form } = openPanel({ action: "/search" });
        expect(form.getAttribute("action")).toBe("/search");
        type(input, "foo");
        fireEvent.submit(form);
        expect(navigate).toHaveBeenCalledWith("/search?foo");
    });

    test("§7.13 onSearch fires with the query and href before navigate", () => {
        const calls: string[] = [];
        const onSearch = vi.fn((q: string, h: string) => calls.push(`search:${q}:${h}`));
        const navigate = vi.fn((h: string) => calls.push(`navigate:${h}`));
        render(<SearchPicker {...LABELS} onSearch={onSearch} navigate={navigate} />);
        fireEvent.click(screen.getByRole("button", { name: LABELS.label }));
        const input = screen.getByRole("searchbox", { name: LABELS.inputLabel }) as HTMLInputElement;
        type(input, " foo ");
        fireEvent.submit(document.querySelector(".search-picker-form")!);
        expect(calls).toEqual(["search:foo:/?foo", "navigate:/?foo"]);
    });

    test("§7.14 without navigate, the default calls location.assign", () => {
        const assign = vi.fn();
        vi.stubGlobal("location", { assign });
        render(<SearchPicker {...LABELS} />);
        fireEvent.click(screen.getByRole("button", { name: LABELS.label }));
        const input = screen.getByRole("searchbox", { name: LABELS.inputLabel }) as HTMLInputElement;
        type(input, "foo");
        fireEvent.submit(document.querySelector(".search-picker-form")!);
        expect(assign).toHaveBeenCalledWith("/?foo");
    });

    test("§7.15 a search closes the panel", () => {
        const { input, form, panel, button } = openPanel();
        type(input, "foo");
        fireEvent.submit(form);
        expect(panel.hasAttribute("hidden")).toBe(true);
        expect(button.getAttribute("aria-expanded")).toBe("false");
    });
});

describe("SearchPicker — closing (§7.16–§7.18)", () => {
    test("§7.16 Escape closes and returns focus to the button with preventScroll", () => {
        const { input, panel, button } = openPanel();
        const focusSpy = vi.spyOn(HTMLElement.prototype, "focus");
        fireEvent.keyDown(input, { key: "Escape" });
        expect(panel.hasAttribute("hidden")).toBe(true);
        expect(document.activeElement).toBe(button);
        expect(focusSpy).toHaveBeenLastCalledWith({ preventScroll: true });
    });

    test("§7.17 clicking outside closes the panel", () => {
        const { panel } = openPanel();
        fireEvent.click(document.body);
        expect(panel.hasAttribute("hidden")).toBe(true);
    });

    test("§7.18 focus moving to an element outside the root closes the panel", () => {
        const outside = document.createElement("button");
        document.body.appendChild(outside);
        const { input, panel } = openPanel();
        fireEvent.blur(input, { relatedTarget: outside });
        expect(panel.hasAttribute("hidden")).toBe(true);
        outside.remove();
    });
});

describe("SearchPicker — value, exports, root (§7.19–§7.23)", () => {
    test("§7.19 an initial defaultValue pre-fills the field, and typing replaces it", () => {
        const { navigate, input, form } = openPanel({ defaultValue: "preset" });
        expect(input.value).toBe("preset");
        type(input, "typed");
        fireEvent.submit(form);
        expect(navigate).toHaveBeenCalledWith("/?typed");
    });

    test("§7.19 a controlled value + onChange receives every edit", () => {
        const seen: string[] = [];
        const navigate = vi.fn();
        function Controlled() {
            const [v, setV] = React.useState("preset");
            return (
                <SearchPicker
                    {...LABELS}
                    navigate={navigate}
                    value={v}
                    onChange={(next) => {
                        seen.push(next);
                        setV(next);
                    }}
                />
            );
        }
        render(<Controlled />);
        fireEvent.click(screen.getByRole("button", { name: LABELS.label }));
        const input = screen.getByRole("searchbox", { name: LABELS.inputLabel }) as HTMLInputElement;
        expect(input.value).toBe("preset");
        type(input, "typed");
        expect(seen).toEqual(["typed"]);
        expect(input.value).toBe("typed");
        fireEvent.submit(document.querySelector(".search-picker-form")!);
        expect(navigate).toHaveBeenCalledWith("/?typed");
    });

    test("§7.20 searchHref builds the destination the component uses", () => {
        expect(searchHref("foo")).toBe("/?foo");
        expect(searchHref(" foo bar ")).toBe("/?foo%20bar");
        expect(searchHref("a&b")).toBe("/?a%26b");
        expect(searchHref("foo", "/search")).toBe("/search?foo");
        expect(nextSearchPickerId()).toMatch(/^search-picker-\d+$/);
    });

    test("§7.21 RETURN_SYMBOL is the bare ⏎ (U+23CE)", () => {
        expect(RETURN_SYMBOL).toBe("⏎");
        expect(RETURN_SYMBOL.codePointAt(0)).toBe(0x23ce);
        expect(RETURN_SYMBOL.length).toBe(1);
    });

    test("§7.22 className and rest props land on the root", () => {
        render(<SearchPicker {...LABELS} className="site-search" data-testid="root" id="s" />);
        const root = screen.getByTestId("root");
        expect(root.className).toBe("search-picker site-search");
        expect(root.id).toBe("s");
    });

    test("§7.23 no user-facing text of its own beyond the hidden ⏎", () => {
        const { input } = openPanel();
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
    test("§7.24 a focusout with no relatedTarget leaves the panel open", () => {
        // Safari does not focus a <button> on click, so pressing ⏎ blurs the
        // field with relatedTarget = null; closing then hid the panel before
        // the click landed (reproduced in real WebKit, 2026-10-02).
        const { navigate, input, submit, panel } = openPanel();
        type(input, "foo");
        fireEvent.focusOut(input, { relatedTarget: null });
        expect(panel.hasAttribute("hidden")).toBe(false);
        fireEvent.click(submit);
        expect(navigate).toHaveBeenCalledWith("/?foo");
    });
});
