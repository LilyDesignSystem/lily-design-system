import * as React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import TextSizeChooser, {
    sizeName,
    LATIN_CAPITAL_LETTER_A,
    type ChildArgs,
} from "./TextSizeChooser";

const SIZES = ["small", "medium", "large", "x-large"];

function flush(): Promise<void> {
    return new Promise((r) => setTimeout(r, 0));
}

function resetRoot(): void {
    document.documentElement.removeAttribute("data-text-size");
}

function getList(): HTMLElement {
    return document.querySelector(".text-size-chooser-list") as HTMLElement;
}

beforeEach(() => {
    resetRoot();
    try {
        localStorage.clear();
    } catch {
        /* ignore */
    }
});

afterEach(() => {
    cleanup();
    resetRoot();
});

/** Open the listbox and click the option for `slug`. */
function pick(slug: string, sizes: string[] = SIZES): void {
    fireEvent.click(screen.getByRole("button"));
    const opts = document.querySelectorAll(".text-size-chooser-option");
    fireEvent.click(opts[sizes.indexOf(slug)]);
}

describe("TextSizeChooser — pure helpers", () => {
    test("sizeName title-cases each hyphen word", () => {
        expect(sizeName("x-large")).toBe("X Large");
        expect(sizeName("small")).toBe("Small");
        expect(sizeName("extra-extra-large")).toBe("Extra Extra Large");
    });

    test("labelFor delegates to sizeName, so option text matches it", () => {
        render(<TextSizeChooser label="Text size" sizes={["x-large"]} />);
        expect(screen.getByText(sizeName("x-large"))).toBeTruthy();
    });
});

describe("TextSizeChooser — markup contract (§4.2, §7.1–§7.5)", () => {
    test("§7.1 renders a button that controls a listbox", () => {
        render(<TextSizeChooser label="Text size" sizes={SIZES} />);
        const button = screen.getByRole("button");
        expect(button.tagName).toBe("BUTTON");
        expect(button.getAttribute("type")).toBe("button");
        expect(button.getAttribute("aria-haspopup")).toBe("listbox");
        expect(button.getAttribute("aria-expanded")).toBe("false");
        const listId = button.getAttribute("aria-controls");
        expect(listId).toBeTruthy();
        expect(document.getElementById(listId!)?.getAttribute("role")).toBe(
            "listbox",
        );
    });

    test("§7.1 the button renders 'A', hidden from assistive tech", () => {
        render(<TextSizeChooser label="Text size" sizes={SIZES} />);
        const icon = document.querySelector(
            ".text-size-chooser-icon",
        ) as HTMLElement;
        // U+0041 LATIN CAPITAL LETTER A.
        expect(icon.textContent).toBe("A");
        expect(icon.textContent).toBe(LATIN_CAPITAL_LETTER_A);
        expect(icon.getAttribute("aria-hidden")).toBe("true");
    });

    test("§7.1 the root is a div carrying the class hook", () => {
        const { container } = render(
            <TextSizeChooser label="Text size" sizes={SIZES} className="mine" />,
        );
        const root = container.firstElementChild as HTMLElement;
        expect(root.tagName).toBe("DIV");
        expect(root.className).toBe("text-size-chooser mine");
    });

    test("§7.2 aria-label names the button and the listbox", () => {
        render(<TextSizeChooser label="Choose text size" sizes={SIZES} />);
        expect(
            screen.getByRole("button", { name: "Choose text size" }),
        ).toBeTruthy();
        expect(getList().getAttribute("aria-label")).toBe("Choose text size");
    });

    test("§7.3 one option per size; the hidden input carries the supplied name", async () => {
        render(
            <TextSizeChooser
                label="Text size"
                sizes={SIZES}
                name="font-scale"
            />,
        );
        await flush();
        const options = document.querySelectorAll(".text-size-chooser-option");
        expect(options.length).toBe(SIZES.length);
        const hidden = document.querySelector(
            'input[type="hidden"]',
        ) as HTMLInputElement;
        expect(hidden.name).toBe("font-scale");
        expect(hidden.value).toBe("medium");
    });

    test("§7.3 the hidden input uses the default name 'text-size'", () => {
        render(<TextSizeChooser label="Text size" sizes={SIZES} />);
        const hidden = document.querySelector(
            'input[type="hidden"]',
        ) as HTMLInputElement;
        expect(hidden.name).toBe("text-size");
    });

    test("§7.4 the listbox is hidden until the button is activated", () => {
        render(<TextSizeChooser label="Text size" sizes={SIZES} />);
        expect(getList().hasAttribute("hidden")).toBe(true);
        fireEvent.click(screen.getByRole("button"));
        expect(getList().hasAttribute("hidden")).toBe(false);
        expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe(
            "true",
        );
    });

    test("§7.4 the active size is the aria-selected option", async () => {
        render(<TextSizeChooser label="Text size" sizes={SIZES} />);
        await flush();
        fireEvent.click(screen.getByRole("button"));
        const selected = document.querySelectorAll(
            '[role="option"][aria-selected="true"]',
        );
        expect(selected.length).toBe(1);
        expect(selected[0].textContent?.trim()).toBe("Medium");
    });

    test("§7.5 default labels title-case the slug (no 'default' string)", () => {
        const { container } = render(
            <TextSizeChooser label="Text size" sizes={["small", "x-large"]} />,
        );
        expect(screen.getByText("Small")).toBeTruthy();
        expect(screen.getByText("X Large")).toBeTruthy();
        expect(container.textContent ?? "").not.toMatch(/default/i);
    });

    test("§7.5 sizeLabels override the default title-case label", () => {
        render(
            <TextSizeChooser
                label="Text size"
                sizes={["small", "x-large"]}
                sizeLabels={{ small: "Compact", "x-large": "Huge" }}
            />,
        );
        expect(screen.getByText("Compact")).toBeTruthy();
        expect(screen.getByText("Huge")).toBeTruthy();
    });
});

describe("TextSizeChooser — keyboard contract (APG listbox)", () => {
    function openWith(key: string) {
        render(<TextSizeChooser label="Text size" sizes={SIZES} />);
        const button = screen.getByRole("button");
        fireEvent.keyDown(button, { key });
        return { button, list: getList() };
    }

    test("§7.14 ArrowDown, Enter and Space all open the listbox", () => {
        for (const key of ["ArrowDown", "Enter", " "]) {
            const { list } = openWith(key);
            expect(list.hasAttribute("hidden")).toBe(false);
            cleanup();
        }
    });

    test("§7.14 ArrowUp opens with the last option active", () => {
        const { list } = openWith("ArrowUp");
        expect(list.getAttribute("aria-activedescendant")).toBe(
            list.children[SIZES.length - 1].id,
        );
    });

    test("§7.14 opening moves focus to the listbox", () => {
        const { list } = openWith("ArrowDown");
        expect(document.activeElement).toBe(list);
    });

    test("§7.15 ArrowDown / ArrowUp move the active descendant and clamp", () => {
        const { list } = openWith("ArrowDown");
        // Opens on the selected size, "medium" (index 1).
        expect(list.getAttribute("aria-activedescendant")).toBe(
            list.children[1].id,
        );
        fireEvent.keyDown(list, { key: "ArrowDown" });
        expect(list.getAttribute("aria-activedescendant")).toBe(
            list.children[2].id,
        );
        fireEvent.keyDown(list, { key: "ArrowUp" });
        fireEvent.keyDown(list, { key: "ArrowUp" });
        fireEvent.keyDown(list, { key: "ArrowUp" });
        // Clamps at the top rather than wrapping.
        expect(list.getAttribute("aria-activedescendant")).toBe(
            list.children[0].id,
        );
    });

    test("§7.15 ArrowDown clamps at the last option", () => {
        const { list } = openWith("ArrowDown");
        for (let n = 0; n < SIZES.length + 3; n++) {
            fireEvent.keyDown(list, { key: "ArrowDown" });
        }
        expect(list.getAttribute("aria-activedescendant")).toBe(
            list.children[SIZES.length - 1].id,
        );
    });

    test("§7.15 the active option is marked with data-active", () => {
        const { list } = openWith("ArrowDown");
        fireEvent.keyDown(list, { key: "ArrowDown" });
        const active = document.querySelectorAll("[data-active]");
        expect(active.length).toBe(1);
        expect(active[0].id).toBe(list.children[2].id);
    });

    test("§7.15 Home and End jump to the first and last option", () => {
        const { list } = openWith("ArrowDown");
        fireEvent.keyDown(list, { key: "End" });
        expect(list.getAttribute("aria-activedescendant")).toBe(
            list.children[SIZES.length - 1].id,
        );
        fireEvent.keyDown(list, { key: "Home" });
        expect(list.getAttribute("aria-activedescendant")).toBe(
            list.children[0].id,
        );
    });

    test("§7.16 Enter selects the active option, applies it, and closes", async () => {
        const { button, list } = openWith("ArrowDown");
        // Opens on "medium" (index 1); move to "large" (index 2).
        fireEvent.keyDown(list, { key: "ArrowDown" });
        fireEvent.keyDown(list, { key: "Enter" });
        await flush();
        expect(list.hasAttribute("hidden")).toBe(true);
        expect(button.getAttribute("aria-expanded")).toBe("false");
        expect(document.documentElement.dataset.textSize).toBe("large");
    });

    test("§7.16 Enter returns focus to the button", async () => {
        const { button, list } = openWith("ArrowDown");
        fireEvent.keyDown(list, { key: "ArrowDown" });
        fireEvent.keyDown(list, { key: "Enter" });
        await flush();
        expect(document.activeElement).toBe(button);
    });

    test("§7.16 Space selects the active option and closes", async () => {
        const { list } = openWith("ArrowDown");
        fireEvent.keyDown(list, { key: "End" });
        fireEvent.keyDown(list, { key: " " });
        await flush();
        expect(list.hasAttribute("hidden")).toBe(true);
        expect(document.documentElement.dataset.textSize).toBe("x-large");
    });

    test("§7.16 Escape closes without changing the size", async () => {
        const { button, list } = openWith("ArrowDown");
        await flush();
        fireEvent.keyDown(list, { key: "ArrowDown" });
        fireEvent.keyDown(list, { key: "Escape" });
        await flush();
        expect(list.hasAttribute("hidden")).toBe(true);
        expect(document.documentElement.dataset.textSize).toBe("medium");
        expect(document.activeElement).toBe(button);
    });

    test("§7.16 Tab closes the listbox without stealing focus back", async () => {
        const { button, list } = openWith("ArrowDown");
        fireEvent.keyDown(list, { key: "Tab" });
        await flush();
        expect(list.hasAttribute("hidden")).toBe(true);
        expect(document.activeElement).not.toBe(button);
    });

    test("§7.17 typeahead moves the active descendant by label prefix", () => {
        const { list } = openWith("ArrowDown");
        fireEvent.keyDown(list, { key: "x" });
        // "X Large" is index 3 in SIZES.
        expect(list.getAttribute("aria-activedescendant")).toBe(
            list.children[3].id,
        );
    });

    test("§7.17 typeahead accumulates characters within the buffer window", () => {
        const { list } = openWith("ArrowDown");
        fireEvent.keyDown(list, { key: "l" });
        // "Large" is index 2.
        expect(list.getAttribute("aria-activedescendant")).toBe(
            list.children[2].id,
        );
        // "la" still matches "Large", so the active option does not move on.
        fireEvent.keyDown(list, { key: "a" });
        expect(list.getAttribute("aria-activedescendant")).toBe(
            list.children[2].id,
        );
    });

    test("§7.17 the typeahead buffer resets after the idle window", async () => {
        vi.useFakeTimers();
        try {
            render(<TextSizeChooser label="Text size" sizes={SIZES} />);
            const list = getList();
            fireEvent.keyDown(screen.getByRole("button"), { key: "ArrowDown" });
            fireEvent.keyDown(list, { key: "l" });
            expect(list.getAttribute("aria-activedescendant")).toBe(
                list.children[2].id,
            );
            vi.advanceTimersByTime(600);
            // Buffer cleared, so "s" starts a fresh search and finds "Small".
            fireEvent.keyDown(list, { key: "s" });
            expect(list.getAttribute("aria-activedescendant")).toBe(
                list.children[0].id,
            );
        } finally {
            vi.useRealTimers();
        }
    });

    test("§7.18 clicking an option selects and applies it", async () => {
        render(<TextSizeChooser label="Text size" sizes={SIZES} />);
        await flush();
        pick("x-large");
        await flush();
        expect(document.documentElement.dataset.textSize).toBe("x-large");
        expect(getList().hasAttribute("hidden")).toBe(true);
    });

    test("§7.18 clicking outside closes the listbox without changing the size", async () => {
        render(<TextSizeChooser label="Text size" sizes={SIZES} />);
        await flush();
        fireEvent.click(screen.getByRole("button"));
        expect(getList().hasAttribute("hidden")).toBe(false);
        fireEvent.click(document.body);
        await flush();
        expect(getList().hasAttribute("hidden")).toBe(true);
        expect(document.documentElement.dataset.textSize).toBe("medium");
    });

    test("§7.18 clicking the button again closes the listbox", () => {
        render(<TextSizeChooser label="Text size" sizes={SIZES} />);
        const button = screen.getByRole("button");
        fireEvent.click(button);
        expect(getList().hasAttribute("hidden")).toBe(false);
        fireEvent.click(button);
        expect(getList().hasAttribute("hidden")).toBe(true);
    });
});

describe("TextSizeChooser — initial value resolution (§7.6)", () => {
    test("§7.6 initial value defaults to 'medium' when present", async () => {
        render(<TextSizeChooser label="Text size" sizes={SIZES} />);
        await flush();
        expect(document.documentElement.getAttribute("data-text-size")).toBe(
            "medium",
        );
    });

    test("§7.6 initial value falls back to sizes[0] when 'medium' is absent", async () => {
        render(<TextSizeChooser label="Text size" sizes={["small", "large"]} />);
        await flush();
        expect(document.documentElement.getAttribute("data-text-size")).toBe(
            "small",
        );
    });

    test("§7.6 defaultValue wins over the medium/sizes[0] fallback", async () => {
        render(
            <TextSizeChooser
                label="Text size"
                sizes={SIZES}
                defaultValue="large"
            />,
        );
        await flush();
        expect(document.documentElement.getAttribute("data-text-size")).toBe(
            "large",
        );
    });
});

describe("TextSizeChooser — size application (§7.7, §7.8)", () => {
    test("§7.7 applies data-text-size to document.documentElement", async () => {
        render(
            <TextSizeChooser
                label="Text size"
                sizes={SIZES}
                defaultValue="large"
            />,
        );
        await flush();
        expect(document.documentElement.getAttribute("data-text-size")).toBe(
            "large",
        );
    });

    test("§7.7 a custom target receives data-text-size", async () => {
        const target = document.createElement("section");
        document.body.appendChild(target);
        render(
            <TextSizeChooser
                label="Text size"
                sizes={SIZES}
                defaultValue="large"
                target={target}
            />,
        );
        await flush();
        expect(target.getAttribute("data-text-size")).toBe("large");
        // Document root must remain untouched.
        expect(document.documentElement.hasAttribute("data-text-size")).toBe(
            false,
        );
        target.remove();
    });

    test("§7.8 selecting an option updates data-text-size and fires onChange", async () => {
        const onChange = vi.fn();
        render(
            <TextSizeChooser
                label="Text size"
                sizes={SIZES}
                defaultValue="medium"
                onChange={onChange}
            />,
        );
        await flush();
        pick("x-large");
        await flush();
        expect(document.documentElement.getAttribute("data-text-size")).toBe(
            "x-large",
        );
        expect(onChange).toHaveBeenCalledWith("x-large");
    });
});

describe("TextSizeChooser — persistence + explicit value (§7.9, §7.10)", () => {
    test("§7.9 persists to localStorage and reads back on a fresh mount", async () => {
        const { unmount } = render(
            <TextSizeChooser
                label="Text size"
                sizes={SIZES}
                storageKey="lily-text-size"
            />,
        );
        await flush();
        pick("large");
        await flush();
        expect(localStorage.getItem("lily-text-size")).toBe("large");
        unmount();
        resetRoot();

        render(
            <TextSizeChooser
                label="Text size"
                sizes={SIZES}
                storageKey="lily-text-size"
            />,
        );
        await flush();
        expect(document.documentElement.getAttribute("data-text-size")).toBe(
            "large",
        );
    });

    test("§7.10 an explicit value prop wins over storage and defaults", async () => {
        localStorage.setItem("lily-text-size", "x-large");
        render(
            <TextSizeChooser
                label="Text size"
                sizes={SIZES}
                value="small"
                storageKey="lily-text-size"
                defaultValue="large"
            />,
        );
        await flush();
        expect(document.documentElement.getAttribute("data-text-size")).toBe(
            "small",
        );
    });
});

describe("TextSizeChooser — spread + custom children (§7.12–§7.13)", () => {
    test("§7.12 extra attributes spread onto the root div", () => {
        render(
            <TextSizeChooser label="Text size" sizes={SIZES} data-testid="ts" />,
        );
        const root = screen.getByTestId("ts");
        expect(root.tagName).toBe("DIV");
        expect(root.className).toContain("text-size-chooser");
    });

    test("§7.13 children replace the button glyph and receive ChildArgs", async () => {
        render(
            <TextSizeChooser label="Text size" sizes={SIZES} value="large">
                {(args: ChildArgs) => (
                    <span
                        data-testid="custom"
                        data-open={String(args.open)}
                        data-value={args.value}
                        data-label-x-large={args.labelFor("x-large")}
                    >
                        custom glyph
                    </span>
                )}
            </TextSizeChooser>,
        );
        await flush();
        const custom = screen.getByTestId("custom");
        // The custom glyph replaces the default "A" inside the button.
        expect(custom.closest("button")?.className).toContain(
            "text-size-chooser-button",
        );
        expect(document.querySelector(".text-size-chooser-icon")).toBeNull();
        expect(custom.getAttribute("data-open")).toBe("false");
        expect(custom.getAttribute("data-value")).toBe("large");
        expect(custom.getAttribute("data-label-x-large")).toBe("X Large");
    });

    test("§7.13 children see open=true once the listbox is expanded", () => {
        render(
            <TextSizeChooser label="Text size" sizes={SIZES} value="large">
                {(args: ChildArgs) => (
                    <span data-testid="custom" data-open={String(args.open)}>
                        glyph
                    </span>
                )}
            </TextSizeChooser>,
        );
        fireEvent.click(screen.getByRole("button"));
        expect(screen.getByTestId("custom").getAttribute("data-open")).toBe(
            "true",
        );
    });
});
