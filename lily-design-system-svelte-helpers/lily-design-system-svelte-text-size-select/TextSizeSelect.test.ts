import { render, screen, fireEvent } from "@testing-library/svelte";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import TextSizeSelect from "./TextSizeSelect.svelte";

const SIZES = ["small", "medium", "large", "x-large"];

function flush(): Promise<void> {
    return new Promise((r) => setTimeout(r, 0));
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
    test("§7.1 renders a <select> with role=combobox", () => {
        render(TextSizeSelect, { props: { label: "Text size", sizes: SIZES } });
        const select = screen.getByRole("combobox");
        expect(select.tagName).toBe("SELECT");
    });

    test("§7.2 aria-label is the supplied label", () => {
        render(TextSizeSelect, { props: { label: "Choose text size", sizes: SIZES } });
        expect(screen.getByLabelText("Choose text size")).toBeTruthy();
    });

    test("§7.3 one option per size; the select carries the supplied name", () => {
        render(TextSizeSelect, {
            props: { label: "Text size", sizes: SIZES, name: "scale" },
        });
        const options = screen.getAllByRole("option") as HTMLOptionElement[];
        expect(options.length).toBe(4);
        const select = screen.getByRole("combobox") as HTMLSelectElement;
        expect(select.name).toBe("scale");
    });

    test("§7.4 each option carries the slug as its value", () => {
        render(TextSizeSelect, { props: { label: "Text size", sizes: SIZES } });
        const options = screen.getAllByRole("option") as HTMLOptionElement[];
        expect(options.map((o) => o.value)).toEqual(SIZES);
    });

    test("§7.5 default labels title-case the slug", () => {
        render(TextSizeSelect, { props: { label: "Text size", sizes: ["small", "x-large"] } });
        expect(screen.getByText("Small")).toBeTruthy();
        expect(screen.getByText("X Large")).toBeTruthy();
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
        const select = screen.getByRole("combobox") as HTMLSelectElement;
        await fireEvent.change(select, { target: { value: "x-large" } });
        await flush();
        expect(document.documentElement.dataset.textSize).toBe("x-large");
        expect(onChange).toHaveBeenCalledWith("x-large");
    });

    test("§7.9 persists to localStorage and reads back on a fresh mount", async () => {
        const { unmount } = render(TextSizeSelect, {
            props: { label: "Text size", sizes: SIZES, storageKey: "lily-text-size" },
        });
        await flush();
        const select = screen.getByRole("combobox") as HTMLSelectElement;
        await fireEvent.change(select, { target: { value: "large" } });
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

    test("§7.13 children snippet receives ChildArgs", () => {
        const customSnippet = (($anchor: Comment, args: any) => {
            const node = document.createElement("option");
            node.setAttribute("data-testid", "custom");
            node.setAttribute("data-name", args().name);
            node.textContent = args().sizes.join(",");
            $anchor.before(node);
        }) as any;

        render(TextSizeSelect, {
            props: { label: "Text size", sizes: SIZES, name: "scale", children: customSnippet },
        });
        const custom = screen.getByTestId("custom");
        expect(custom.textContent).toBe("small,medium,large,x-large");
        expect(custom.getAttribute("data-name")).toBe("scale");
    });
});
