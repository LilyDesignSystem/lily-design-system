import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { TextSizeSelect } from "./text-size-select.js";

// Ensure the custom element is registered exactly once.
if (typeof customElements !== "undefined" && !customElements.get("text-size-select")) {
    customElements.define("text-size-select", TextSizeSelect);
}

const SIZES = ["small", "medium", "large", "x-large"];

function flush(): Promise<void> {
    return new Promise((r) => setTimeout(r, 0));
}

function resetRoot(): void {
    document.documentElement.removeAttribute("data-text-size");
}

function mount(attrs: Record<string, string>): TextSizeSelect {
    const el = document.createElement("text-size-select") as TextSizeSelect;
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    document.body.appendChild(el);
    return el;
}

function chooseOption(select: HTMLSelectElement, value: string): void {
    select.value = value;
    select.dispatchEvent(new Event("change", { bubbles: true }));
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

describe("<text-size-select> — markup contract (§7.1–§7.5)", () => {
    test("§7.1 renders a native <select> root", async () => {
        mount({ label: "Text size", sizes: SIZES.join(",") });
        await flush();
        const select = document.body.querySelector("select.text-size-select")!;
        expect(select.tagName).toBe("SELECT");
    });

    test("§7.2 aria-label is the supplied label", async () => {
        mount({ label: "Choose text size", sizes: SIZES.join(",") });
        await flush();
        const select = document.body.querySelector("select.text-size-select")!;
        expect(select.getAttribute("aria-label")).toBe("Choose text size");
    });

    test("§7.3 one option per size; the select carries the supplied name", async () => {
        mount({ label: "Text size", sizes: SIZES.join(","), name: "scale" });
        await flush();
        const options = document.body.querySelectorAll<HTMLOptionElement>("option");
        expect(options.length).toBe(SIZES.length);
        const select = document.body.querySelector<HTMLSelectElement>("select.text-size-select")!;
        expect(select.name).toBe("scale");
    });

    test("§7.4 each option carries the slug as its value", async () => {
        mount({ label: "Text size", sizes: SIZES.join(",") });
        await flush();
        const options = document.body.querySelectorAll<HTMLOptionElement>("option");
        expect([...options].map((o) => o.value)).toEqual(SIZES);
    });

    test("§7.5 default labels title-case the slug", async () => {
        mount({ label: "Text size", sizes: "small,x-large" });
        await flush();
        const text = document.body.textContent ?? "";
        expect(text).toContain("Small");
        expect(text).toContain("X Large");
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
});

describe("<text-size-select> — application (§7.6–§7.10)", () => {
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
        const select = document.body.querySelector<HTMLSelectElement>("select.text-size-select")!;
        chooseOption(select, "x-large");
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
        const select = document.body.querySelector<HTMLSelectElement>("select.text-size-select")!;
        chooseOption(select, "large");
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
        const el = document.createElement("text-size-select") as TextSizeSelect;
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

describe("<text-size-select> — property API (§7.12–§7.13)", () => {
    test("§7.12 setting el.sizes as an array mirrors the CSV attribute and re-renders", async () => {
        const el = mount({ label: "Text size", sizes: "small,large" }) as TextSizeSelect;
        await flush();
        el.sizes = ["small", "medium", "large"];
        await flush();
        expect(el.getAttribute("sizes")).toBe("small,medium,large");
        expect(el.querySelectorAll("option").length).toBe(3);
    });

    test("§7.13 setting el.sizeLabels as an object mirrors the JSON attribute and re-renders", async () => {
        const el = mount({ label: "Text size", sizes: "small,large" }) as TextSizeSelect;
        await flush();
        el.sizeLabels = { small: "Compact", large: "Comfortable" };
        await flush();
        expect(el.getAttribute("size-labels")).toBe(
            JSON.stringify({ small: "Compact", large: "Comfortable" }),
        );
        const text = document.body.textContent ?? "";
        expect(text).toContain("Compact");
    });
});
