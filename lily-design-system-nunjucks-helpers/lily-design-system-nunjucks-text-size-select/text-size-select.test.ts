// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import nunjucks from "nunjucks";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import {
    autoInit,
    initTextSizeSelect,
} from "./text-size-select.client.js";

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
        `{% from "./text-size-select.njk" import textSizeSelect %}` +
        `{{ textSizeSelect(opts) }}`;
    return env.renderString(src, { opts });
}

function mountIntoBody(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.querySelector(
        "[data-lily-text-size-select-root]",
    ) as HTMLElement;
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

describe("TextSizeSelect — macro markup contract (§7.1–§7.5)", () => {
    test("§7.1 macro renders a native <select> root", () => {
        const html = renderMacro({ label: "Text size", sizes: SIZES });
        const root = mountIntoBody(html);
        expect(root.tagName).toBe("SELECT");
        expect(root.classList.contains("text-size-select")).toBe(true);
    });

    test("§7.2 aria-label is the supplied label", () => {
        const html = renderMacro({ label: "Choose text size", sizes: SIZES });
        const root = mountIntoBody(html);
        expect(root.getAttribute("aria-label")).toBe("Choose text size");
    });

    test("§7.3 one option per size; the select carries the supplied name", () => {
        const html = renderMacro({
            label: "Text size",
            sizes: SIZES,
            name: "size",
        });
        const root = mountIntoBody(html) as HTMLSelectElement;
        const options = Array.from(
            root.querySelectorAll<HTMLOptionElement>("option"),
        );
        expect(options.length).toBe(SIZES.length);
        expect(root.name).toBe("size");
    });

    test("§7.3b default name is text-size", () => {
        const html = renderMacro({ label: "Text size", sizes: SIZES });
        const root = mountIntoBody(html) as HTMLSelectElement;
        expect(root.name).toBe("text-size");
    });

    test("§7.4 each option carries the slug as its value", () => {
        const html = renderMacro({ label: "Text size", sizes: SIZES });
        const root = mountIntoBody(html);
        const values = Array.from(
            root.querySelectorAll<HTMLOptionElement>("option"),
        ).map((o) => o.value);
        expect(values).toEqual(SIZES);
    });

    test("§7.5 default labels title-case the slug; sizeLabels override", () => {
        const html = renderMacro({
            label: "Text size",
            sizes: ["small", "x-large", "huge"],
            sizeLabels: { small: "Small", "x-large": "Extra large" },
        });
        const root = mountIntoBody(html);
        const labels = Array.from(
            root.querySelectorAll<HTMLOptionElement>(".text-size-select-option"),
        ).map((o) => (o.textContent || "").trim());
        // sizeLabels override
        expect(labels[0]).toBe("Small");
        expect(labels[1]).toBe("Extra large");
        // default fall back: slug title-cased
        expect(labels[2]).toBe("Huge");
    });

    test("§7.5b multi-word slug title-cases per hyphen-word", () => {
        const html = renderMacro({
            label: "Text size",
            sizes: ["x-large"],
        });
        const root = mountIntoBody(html);
        const text = (
            root.querySelector(".text-size-select-option")?.textContent || ""
        ).trim();
        expect(text).toBe("X Large");
    });
});

describe("TextSizeSelect — client.js lifecycle (§7.6–§7.8)", () => {
    test("§7.6 initial value defaults to medium when present", () => {
        const html = renderMacro({ label: "Text size", sizes: SIZES });
        const root = mountIntoBody(html) as HTMLSelectElement;
        initTextSizeSelect(root);
        expect(document.documentElement.getAttribute("data-text-size")).toBe(
            "medium",
        );
        expect(root.value).toBe("medium");
    });

    test("§7.6b initial value falls back to first option when no medium", () => {
        const html = renderMacro({
            label: "Text size",
            sizes: ["sm", "lg", "xl"],
        });
        const root = mountIntoBody(html) as HTMLSelectElement;
        initTextSizeSelect(root);
        expect(document.documentElement.getAttribute("data-text-size")).toBe(
            "sm",
        );
    });

    test("§7.7 init applies data-text-size to document.documentElement", () => {
        const html = renderMacro({
            label: "Text size",
            sizes: SIZES,
            defaultValue: "large",
        });
        const root = mountIntoBody(html);
        initTextSizeSelect(root);
        expect(document.documentElement.getAttribute("data-text-size")).toBe(
            "large",
        );
    });

    test("§7.8 selecting an option updates data-text-size and fires onChange", () => {
        const onChange = vi.fn();
        const html = renderMacro({
            label: "Text size",
            sizes: SIZES,
            defaultValue: "medium",
        });
        const root = mountIntoBody(html) as HTMLSelectElement;
        initTextSizeSelect(root, { onChange });
        root.value = "large";
        root.dispatchEvent(new Event("change", { bubbles: true }));
        expect(document.documentElement.getAttribute("data-text-size")).toBe(
            "large",
        );
        expect(onChange).toHaveBeenLastCalledWith("large");

        root.value = "x-large";
        root.dispatchEvent(new Event("change", { bubbles: true }));
        expect(document.documentElement.getAttribute("data-text-size")).toBe(
            "x-large",
        );
        expect(onChange).toHaveBeenLastCalledWith("x-large");
    });

    test("§7.8b a custom target receives data-text-size", () => {
        const target = document.createElement("section");
        document.body.appendChild(target);
        const html = renderMacro({
            label: "Text size",
            sizes: SIZES,
            defaultValue: "large",
        });
        const root = mountIntoBody(html);
        initTextSizeSelect(root, { target });
        expect(target.getAttribute("data-text-size")).toBe("large");
        expect(
            document.documentElement.hasAttribute("data-text-size"),
        ).toBe(false);
        target.remove();
    });
});

describe("TextSizeSelect — initial-value resolution (§7.9–§7.10)", () => {
    test("§7.9 persists to localStorage and reads back on a fresh init", () => {
        const html = renderMacro({
            label: "Text size",
            sizes: SIZES,
            storageKey: "lily-text-size",
        });
        const root = mountIntoBody(html);
        const ctrl = initTextSizeSelect(root);
        ctrl.setSize("large");
        expect(localStorage.getItem("lily-text-size")).toBe("large");
        ctrl.destroy();
        resetRoot();

        const html2 = renderMacro({
            label: "Text size",
            sizes: SIZES,
            storageKey: "lily-text-size",
        });
        const root2 = mountIntoBody(html2);
        initTextSizeSelect(root2);
        expect(document.documentElement.getAttribute("data-text-size")).toBe(
            "large",
        );
    });

    test("§7.10 an explicit value wins over storage and defaults", () => {
        localStorage.setItem("lily-text-size", "x-large");
        const html = renderMacro({
            label: "Text size",
            sizes: SIZES,
            value: "small",
            storageKey: "lily-text-size",
            defaultValue: "large",
        });
        const root = mountIntoBody(html);
        initTextSizeSelect(root);
        expect(document.documentElement.getAttribute("data-text-size")).toBe(
            "small",
        );
    });
});

describe("TextSizeSelect — spread + autoInit (§7.12–§7.13)", () => {
    test("§7.12 extra attributes spread onto the <select> root", () => {
        const html = renderMacro({
            label: "Text size",
            sizes: SIZES,
            attributes: { "data-testid": "ts" },
        });
        const root = mountIntoBody(html);
        expect(root.getAttribute("data-testid")).toBe("ts");
    });

    test("§7.13 autoInit wires every root on the page", () => {
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
        expect(document.documentElement.getAttribute("data-text-size")).toBe(
            "x-large",
        );
    });
});
