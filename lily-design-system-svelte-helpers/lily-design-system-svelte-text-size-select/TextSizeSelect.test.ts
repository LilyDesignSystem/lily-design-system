import { render, screen, fireEvent } from "@testing-library/svelte";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import TextSizeSelect, { sizeName } from "./TextSizeSelect.svelte";

const SIZES = ["small", "medium", "large", "x-large"];

function flush(): Promise<void> {
    return new Promise((r) => setTimeout(r, 0));
}

/** Open the listbox and click the option for `slug`. */
async function pick(slug: string, sizes: string[] = SIZES): Promise<void> {
    await fireEvent.click(screen.getByRole("button"));
    const opts = document.querySelectorAll(".text-size-select-option");
    await fireEvent.click(opts[sizes.indexOf(slug)]);
}

beforeEach(() => {
    document.documentElement.removeAttribute("data-text-size");
    try {
        localStorage.clear();
    } catch {
        /* ignore */
    }
});

afterEach(() => {
    document.documentElement.removeAttribute("data-text-size");
});

describe("TextSizeSelect — markup contract (§7.1–§7.5)", () => {
    test("§7.1 renders a button that controls a listbox", () => {
        render(TextSizeSelect, { props: { label: "Text size", sizes: SIZES } });
        const button = screen.getByRole("button");
        expect(button.tagName).toBe("BUTTON");
        expect(button.getAttribute("type")).toBe("button");
        expect(button.getAttribute("aria-haspopup")).toBe("listbox");
        expect(button.getAttribute("aria-expanded")).toBe("false");
        const listId = button.getAttribute("aria-controls");
        expect(listId).toBeTruthy();
        expect(document.getElementById(listId!)?.getAttribute("role")).toBe("listbox");
    });

    test("§7.1 the button renders 'A', hidden from assistive tech", () => {
        render(TextSizeSelect, { props: { label: "Text size", sizes: SIZES } });
        const icon = document.querySelector(".text-size-select-icon") as HTMLElement;
        // U+0041 LATIN CAPITAL LETTER A — an in-font letter, not a
        // pictograph, so it never falls back to a bitmap glyph.
        expect(icon.textContent).toBe("A");
        expect(icon.getAttribute("aria-hidden")).toBe("true");
    });

    test("§7.2 aria-label names the button and the listbox", () => {
        render(TextSizeSelect, { props: { label: "Choose text size", sizes: SIZES } });
        expect(screen.getByRole("button", { name: "Choose text size" })).toBeTruthy();
        const list = document.querySelector(".text-size-select-list") as HTMLElement;
        expect(list.getAttribute("aria-label")).toBe("Choose text size");
    });

    test("§7.3 one option per size; the hidden input carries the supplied name", async () => {
        render(TextSizeSelect, {
            props: { label: "Text size", sizes: SIZES, name: "scale" },
        });
        await flush();
        const options = document.querySelectorAll(".text-size-select-option");
        expect(options.length).toBe(SIZES.length);
        const hidden = document.querySelector('input[type="hidden"]') as HTMLInputElement;
        expect(hidden.name).toBe("scale");
        expect(hidden.value).toBe("medium");
    });

    test("§7.4 the listbox is hidden until the button is activated", async () => {
        render(TextSizeSelect, { props: { label: "Text size", sizes: SIZES } });
        const list = document.querySelector(".text-size-select-list") as HTMLElement;
        expect(list.hasAttribute("hidden")).toBe(true);
        await fireEvent.click(screen.getByRole("button"));
        expect(list.hasAttribute("hidden")).toBe(false);
        expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("true");
    });

    test("§7.4 the active size is the aria-selected option", async () => {
        render(TextSizeSelect, { props: { label: "Text size", sizes: SIZES } });
        await flush();
        await fireEvent.click(screen.getByRole("button"));
        const selected = document.querySelectorAll('[role="option"][aria-selected="true"]');
        expect(selected.length).toBe(1);
        expect(selected[0].textContent?.trim()).toBe("Medium");
    });

    test("§7.5 default labels title-case the slug", () => {
        render(TextSizeSelect, { props: { label: "Text size", sizes: ["small", "x-large"] } });
        expect(screen.getByText("Small")).toBeTruthy();
        expect(screen.getByText("X Large")).toBeTruthy();
    });

    test("§7.5 sizeName is the exported resolver the default labels use", () => {
        expect(sizeName("small")).toBe("Small");
        expect(sizeName("x-large")).toBe("X Large");
        render(TextSizeSelect, { props: { label: "Text size", sizes: ["x-large"] } });
        expect(screen.getByText(sizeName("x-large"))).toBeTruthy();
    });

    test("§7.5 sizeLabels override the default title-case label", () => {
        render(TextSizeSelect, {
            props: {
                label: "Text size",
                sizes: ["small", "large"],
                sizeLabels: { small: "Compact", large: "Comfortable" },
            },
        });
        expect(screen.getByText("Compact")).toBeTruthy();
        expect(screen.getByText("Comfortable")).toBeTruthy();
    });
});

describe("TextSizeSelect — keyboard contract (APG listbox)", () => {
    async function openWith(key: string) {
        render(TextSizeSelect, { props: { label: "Text size", sizes: SIZES } });
        await flush();
        const button = screen.getByRole("button");
        await fireEvent.keyDown(button, { key });
        await flush();
        return {
            button,
            list: document.querySelector(".text-size-select-list") as HTMLElement,
        };
    }

    test("§7.14 ArrowDown, Enter and Space all open the listbox", async () => {
        for (const key of ["ArrowDown", "Enter", " "]) {
            const { list } = await openWith(key);
            expect(list.hasAttribute("hidden")).toBe(false);
            document.body.innerHTML = "";
        }
    });

    test("§7.14 ArrowUp opens with the last option active", async () => {
        const { list } = await openWith("ArrowUp");
        expect(list.getAttribute("aria-activedescendant")).toBe(
            list.children[SIZES.length - 1].id,
        );
    });

    test("§7.15 arrows move the active descendant and clamp", async () => {
        const { list } = await openWith("ArrowDown");
        // "medium" resolves as the initial size, so index 1 is active.
        expect(list.getAttribute("aria-activedescendant")).toBe(list.children[1].id);
        await fireEvent.keyDown(list, { key: "ArrowUp" });
        expect(list.getAttribute("aria-activedescendant")).toBe(list.children[0].id);
        await fireEvent.keyDown(list, { key: "ArrowUp" });
        expect(list.getAttribute("aria-activedescendant")).toBe(list.children[0].id);
    });

    test("§7.15 Home and End jump to the first and last option", async () => {
        const { list } = await openWith("ArrowDown");
        await fireEvent.keyDown(list, { key: "End" });
        expect(list.getAttribute("aria-activedescendant")).toBe(
            list.children[SIZES.length - 1].id,
        );
        await fireEvent.keyDown(list, { key: "Home" });
        expect(list.getAttribute("aria-activedescendant")).toBe(list.children[0].id);
    });

    test("§7.16 Enter selects the active option, applies it, and closes", async () => {
        const { button, list } = await openWith("ArrowDown");
        await fireEvent.keyDown(list, { key: "End" });
        await fireEvent.keyDown(list, { key: "Enter" });
        await flush();
        expect(list.hasAttribute("hidden")).toBe(true);
        expect(button.getAttribute("aria-expanded")).toBe("false");
        expect(document.documentElement.dataset.textSize).toBe("x-large");
    });

    test("§7.16 Escape closes without changing the size", async () => {
        const { list } = await openWith("ArrowDown");
        await fireEvent.keyDown(list, { key: "End" });
        await fireEvent.keyDown(list, { key: "Escape" });
        await flush();
        expect(list.hasAttribute("hidden")).toBe(true);
        expect(document.documentElement.dataset.textSize).toBe("medium");
    });

    test("§7.17 typeahead moves the active descendant by label prefix", async () => {
        const { list } = await openWith("ArrowDown");
        await fireEvent.keyDown(list, { key: "s" });
        // "Small" is index 0.
        expect(list.getAttribute("aria-activedescendant")).toBe(list.children[0].id);
    });
});

describe("TextSizeSelect — application (§7.6–§7.10)", () => {
    test("§7.6 default initial value is 'medium' when present in sizes", async () => {
        render(TextSizeSelect, { props: { label: "Text size", sizes: SIZES } });
        await flush();
        expect(document.documentElement.dataset.textSize).toBe("medium");
    });

    test("§7.6 default initial value falls back to sizes[0] when 'medium' is absent", async () => {
        render(TextSizeSelect, { props: { label: "Text size", sizes: ["small", "large"] } });
        await flush();
        expect(document.documentElement.dataset.textSize).toBe("small");
    });

    test("§7.7 sets data-text-size on documentElement", async () => {
        render(TextSizeSelect, { props: { label: "Text size", sizes: SIZES } });
        await flush();
        expect(document.documentElement.getAttribute("data-text-size")).toBe("medium");
    });

    test("§7.8 selecting an option updates data-text-size and fires onChange", async () => {
        const onChange = vi.fn();
        render(TextSizeSelect, { props: { label: "Text size", sizes: SIZES, onChange } });
        await flush();
        await pick("x-large");
        await flush();
        expect(document.documentElement.dataset.textSize).toBe("x-large");
        expect(onChange).toHaveBeenCalledWith("x-large");
    });

    test("§7.9 persists to localStorage and reads back on a fresh mount", async () => {
        const { unmount } = render(TextSizeSelect, {
            props: { label: "Text size", sizes: SIZES, storageKey: "lily-text-size" },
        });
        await flush();
        await pick("large");
        await flush();
        expect(localStorage.getItem("lily-text-size")).toBe("large");
        unmount();

        document.documentElement.removeAttribute("data-text-size");
        render(TextSizeSelect, {
            props: { label: "Text size", sizes: SIZES, storageKey: "lily-text-size" },
        });
        await flush();
        expect(document.documentElement.dataset.textSize).toBe("large");
    });

    test("§7.10 a supplied value prop wins over storage and defaults", async () => {
        localStorage.setItem("lily-text-size", "x-large");
        render(TextSizeSelect, {
            props: {
                label: "Text size",
                sizes: SIZES,
                value: "small",
                storageKey: "lily-text-size",
            },
        });
        await flush();
        expect(document.documentElement.dataset.textSize).toBe("small");
    });
});

describe("TextSizeSelect — spread + custom children (§7.12–§7.13)", () => {
    test("§7.12 extra attributes spread onto the <select>", () => {
        render(TextSizeSelect, {
            props: { label: "Text size", sizes: SIZES, "data-testid": "ts" },
        });
        expect(screen.getByTestId("ts")).toBeTruthy();
    });

    test("§7.13 children snippet replaces the button glyph and receives ChildArgs", async () => {
        const customSnippet = (($anchor: Comment, args: any) => {
            const node = document.createElement("span");
            const a = args();
            node.setAttribute("data-testid", "custom");
            node.setAttribute("data-open", String(a.open));
            node.setAttribute("data-value", a.value);
            node.setAttribute("data-label-x-large", a.labelFor("x-large"));
            node.textContent = "custom glyph";
            $anchor.before(node);
        }) as any;

        render(TextSizeSelect, {
            props: {
                label: "Text size",
                sizes: SIZES,
                // Explicit value: the raw test snippet reads its args once at
                // first render, before the effect resolves an initial size.
                value: "large",
                children: customSnippet,
            },
        });
        await flush();
        const custom = screen.getByTestId("custom");
        // The custom glyph replaces the default "A" inside the button.
        expect(custom.closest("button")?.className).toContain("text-size-select-button");
        expect(document.querySelector(".text-size-select-icon")).toBeNull();
        expect(custom.getAttribute("data-open")).toBe("false");
        expect(custom.getAttribute("data-value")).toBe("large");
        expect(custom.getAttribute("data-label-x-large")).toBe("X Large");
    });
});
