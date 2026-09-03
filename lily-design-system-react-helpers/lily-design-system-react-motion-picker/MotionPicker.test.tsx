import * as React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import MotionPicker, {
    motionName,
    prefersReducedMotion,
    type ChildArgs,
} from "./MotionPicker";

const MOTIONS = ["no-preference", "reduce"];

function flush(): Promise<void> {
    return new Promise((r) => setTimeout(r, 0));
}

function resetRoot(): void {
    document.documentElement.removeAttribute("data-motion");
}

function getList(): HTMLElement {
    return document.querySelector(".motion-picker-list") as HTMLElement;
}

/** Set (or clear) window.matchMedia's answer to (prefers-reduced-motion: reduce). */
function mockReducedMotion(matches: boolean): void {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query === "(prefers-reduced-motion: reduce)" ? matches : false,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
    })) as unknown as typeof window.matchMedia;
}

beforeEach(() => {
    resetRoot();
    mockReducedMotion(false);
    try {
        localStorage.clear();
    } catch {
        /* ignore */
    }
});

afterEach(() => {
    cleanup();
    resetRoot();
    vi.restoreAllMocks();
});

/** Open the listbox and click the option for `slug`. */
function pick(slug: string, motions: string[] = MOTIONS): void {
    fireEvent.click(screen.getByRole("button"));
    const opts = document.querySelectorAll(".motion-picker-option");
    fireEvent.click(opts[motions.indexOf(slug)]);
}

describe("MotionPicker — pure helpers", () => {
    test("motionName title-cases each hyphen word", () => {
        expect(motionName("no-preference")).toBe("No Preference");
        expect(motionName("reduce")).toBe("Reduce");
    });

    test("labelFor delegates to motionName, so option text matches it", () => {
        render(<MotionPicker label="Motion" motions={["no-preference"]} />);
        expect(screen.getByText(motionName("no-preference"))).toBeTruthy();
    });

    test("prefersReducedMotion reads (prefers-reduced-motion: reduce)", () => {
        mockReducedMotion(true);
        expect(prefersReducedMotion()).toBe(true);
        mockReducedMotion(false);
        expect(prefersReducedMotion()).toBe(false);
    });
});

describe("MotionPicker — markup contract (§4.2, §7.1–§7.5)", () => {
    test("§7.1 renders a button that controls a listbox", () => {
        render(<MotionPicker label="Motion" motions={MOTIONS} />);
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

    test("§7.1 the button renders the pause glyph, hidden from assistive tech", () => {
        render(<MotionPicker label="Motion" motions={MOTIONS} />);
        const icon = document.querySelector(
            ".motion-picker-icon",
        ) as HTMLElement;
        // U+23F8 PAUSE SIGN + U+FE0E (text presentation).
        expect(icon.textContent).toBe("\u23F8\uFE0E");
        expect(icon.getAttribute("aria-hidden")).toBe("true");
    });

    test("§7.1 the root is a div carrying the class hook", () => {
        const { container } = render(
            <MotionPicker label="Motion" motions={MOTIONS} className="mine" />,
        );
        const root = container.firstElementChild as HTMLElement;
        expect(root.tagName).toBe("DIV");
        expect(root.className).toBe("motion-picker mine");
    });

    test("§7.2 aria-label names the button and the listbox", () => {
        render(<MotionPicker label="Choose motion" motions={MOTIONS} />);
        expect(
            screen.getByRole("button", { name: "Choose motion" }),
        ).toBeTruthy();
        expect(getList().getAttribute("aria-label")).toBe("Choose motion");
    });

    test("§7.3 one option per motion; the hidden input carries the supplied name", async () => {
        render(
            <MotionPicker
                label="Motion"
                motions={MOTIONS}
                name="reduced-motion"
            />,
        );
        await flush();
        const options = document.querySelectorAll(".motion-picker-option");
        expect(options.length).toBe(MOTIONS.length);
        const hidden = document.querySelector(
            'input[type="hidden"]',
        ) as HTMLInputElement;
        expect(hidden.name).toBe("reduced-motion");
        expect(hidden.value).toBe("no-preference");
    });

    test("§7.3 the hidden input uses the default name 'motion'", () => {
        render(<MotionPicker label="Motion" motions={MOTIONS} />);
        const hidden = document.querySelector(
            'input[type="hidden"]',
        ) as HTMLInputElement;
        expect(hidden.name).toBe("motion");
    });

    test("§7.4 the listbox is hidden until the button is activated", () => {
        render(<MotionPicker label="Motion" motions={MOTIONS} />);
        expect(getList().hasAttribute("hidden")).toBe(true);
        fireEvent.click(screen.getByRole("button"));
        expect(getList().hasAttribute("hidden")).toBe(false);
        expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe(
            "true",
        );
    });

    test("§7.4 the active motion is the aria-selected option", async () => {
        render(<MotionPicker label="Motion" motions={MOTIONS} />);
        await flush();
        fireEvent.click(screen.getByRole("button"));
        const selected = document.querySelectorAll(
            '[role="option"][aria-selected="true"]',
        );
        expect(selected.length).toBe(1);
        expect(selected[0].textContent?.trim()).toBe("No Preference");
    });

    test("§7.5 default labels title-case the slug (no 'default' string)", () => {
        const { container } = render(
            <MotionPicker label="Motion" motions={["no-preference", "reduce"]} />,
        );
        expect(screen.getByText("No Preference")).toBeTruthy();
        expect(screen.getByText("Reduce")).toBeTruthy();
        expect(container.textContent ?? "").not.toMatch(/\bdefault\b/i);
    });

    test("§7.5 motionLabels override the default title-case label", () => {
        render(
            <MotionPicker
                label="Motion"
                motions={["no-preference", "reduce"]}
                motionLabels={{ "no-preference": "Full motion", reduce: "Reduced motion" }}
            />,
        );
        expect(screen.getByText("Full motion")).toBeTruthy();
        expect(screen.getByText("Reduced motion")).toBeTruthy();
    });
});

describe("MotionPicker — keyboard contract (APG listbox)", () => {
    function openWith(key: string) {
        render(<MotionPicker label="Motion" motions={MOTIONS} />);
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
            list.children[MOTIONS.length - 1].id,
        );
    });

    test("§7.14 opening moves focus to the listbox", () => {
        const { list } = openWith("ArrowDown");
        expect(document.activeElement).toBe(list);
    });

    test("§7.15 ArrowDown / ArrowUp move the active descendant and clamp", () => {
        const { list } = openWith("ArrowDown");
        // Opens on the selected motion, "no-preference" (index 0).
        expect(list.getAttribute("aria-activedescendant")).toBe(
            list.children[0].id,
        );
        fireEvent.keyDown(list, { key: "ArrowDown" });
        expect(list.getAttribute("aria-activedescendant")).toBe(
            list.children[1].id,
        );
        fireEvent.keyDown(list, { key: "ArrowUp" });
        fireEvent.keyDown(list, { key: "ArrowUp" });
        // Clamps at the top rather than wrapping.
        expect(list.getAttribute("aria-activedescendant")).toBe(
            list.children[0].id,
        );
    });

    test("§7.15 the active option is marked with data-active", () => {
        const { list } = openWith("ArrowDown");
        fireEvent.keyDown(list, { key: "ArrowDown" });
        const active = document.querySelectorAll("[data-active]");
        expect(active.length).toBe(1);
        expect(active[0].id).toBe(list.children[1].id);
    });

    test("§7.15 Home and End jump to the first and last option", () => {
        const { list } = openWith("ArrowDown");
        fireEvent.keyDown(list, { key: "End" });
        expect(list.getAttribute("aria-activedescendant")).toBe(
            list.children[MOTIONS.length - 1].id,
        );
        fireEvent.keyDown(list, { key: "Home" });
        expect(list.getAttribute("aria-activedescendant")).toBe(
            list.children[0].id,
        );
    });

    test("§7.16 Enter selects the active option, applies it, and closes", async () => {
        const { button, list } = openWith("ArrowDown");
        fireEvent.keyDown(list, { key: "End" });
        fireEvent.keyDown(list, { key: "Enter" });
        await flush();
        expect(list.hasAttribute("hidden")).toBe(true);
        expect(button.getAttribute("aria-expanded")).toBe("false");
        expect(document.documentElement.dataset.motion).toBe("reduce");
    });

    test("§7.16 Enter returns focus to the button", async () => {
        const { button, list } = openWith("ArrowDown");
        fireEvent.keyDown(list, { key: "End" });
        fireEvent.keyDown(list, { key: "Enter" });
        await flush();
        expect(document.activeElement).toBe(button);
    });

    test("§7.16 Escape closes without changing the motion", async () => {
        const { button, list } = openWith("ArrowDown");
        await flush();
        fireEvent.keyDown(list, { key: "End" });
        fireEvent.keyDown(list, { key: "Escape" });
        await flush();
        expect(list.hasAttribute("hidden")).toBe(true);
        expect(document.documentElement.dataset.motion).toBe("no-preference");
        expect(document.activeElement).toBe(button);
    });

    test("§7.16 Tab closes the listbox and parks focus on the button", async () => {
        const { button, list } = openWith("ArrowDown");
        fireEvent.keyDown(list, { key: "Tab" });
        await flush();
        expect(list.hasAttribute("hidden")).toBe(true);
        expect(document.activeElement).toBe(button);
    });

    test("§7.17 typeahead moves the active descendant by label prefix", () => {
        const { list } = openWith("ArrowDown");
        fireEvent.keyDown(list, { key: "r" });
        // "Reduce" is index 1.
        expect(list.getAttribute("aria-activedescendant")).toBe(
            list.children[1].id,
        );
    });

    test("§7.18 clicking an option selects it, applies it, and closes the listbox", async () => {
        render(<MotionPicker label="Motion" motions={MOTIONS} />);
        await flush();
        pick("reduce");
        await flush();
        expect(document.documentElement.dataset.motion).toBe("reduce");
        expect(getList().hasAttribute("hidden")).toBe(true);
        expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe(
            "false",
        );
    });

    test("§7.18 clicking outside closes the listbox without changing the motion", async () => {
        render(<MotionPicker label="Motion" motions={MOTIONS} />);
        await flush();
        fireEvent.click(screen.getByRole("button"));
        expect(getList().hasAttribute("hidden")).toBe(false);
        fireEvent.click(document.body);
        await flush();
        expect(getList().hasAttribute("hidden")).toBe(true);
        expect(document.documentElement.dataset.motion).toBe("no-preference");
    });
});

describe("MotionPicker — initial value resolution (§7.6)", () => {
    test("§7.6 initial value is 'no-preference' when the OS reports no preference", async () => {
        mockReducedMotion(false);
        render(<MotionPicker label="Motion" motions={MOTIONS} />);
        await flush();
        expect(document.documentElement.getAttribute("data-motion")).toBe(
            "no-preference",
        );
    });

    test("§7.6 initial value is 'reduce' when the OS reports prefers-reduced-motion", async () => {
        mockReducedMotion(true);
        render(<MotionPicker label="Motion" motions={MOTIONS} />);
        await flush();
        expect(document.documentElement.getAttribute("data-motion")).toBe(
            "reduce",
        );
    });

    test("§7.6 falls back to motions[0] when neither OS slug is offered", async () => {
        mockReducedMotion(true);
        render(
            <MotionPicker label="Motion" motions={["standard", "minimal"]} />,
        );
        await flush();
        expect(document.documentElement.getAttribute("data-motion")).toBe(
            "standard",
        );
    });

    test("§7.6 defaultValue wins over the OS-preference fallback", async () => {
        mockReducedMotion(true);
        render(
            <MotionPicker label="Motion" motions={MOTIONS} defaultValue="no-preference" />,
        );
        await flush();
        expect(document.documentElement.getAttribute("data-motion")).toBe(
            "no-preference",
        );
    });
});

describe("MotionPicker — motion application (§7.7, §7.8)", () => {
    test("§7.7 applies data-motion to document.documentElement", async () => {
        render(
            <MotionPicker label="Motion" motions={MOTIONS} defaultValue="reduce" />,
        );
        await flush();
        expect(document.documentElement.getAttribute("data-motion")).toBe(
            "reduce",
        );
    });

    test("§7.7 a custom target receives data-motion", async () => {
        const target = document.createElement("section");
        document.body.appendChild(target);
        render(
            <MotionPicker
                label="Motion"
                motions={MOTIONS}
                defaultValue="reduce"
                target={target}
            />,
        );
        await flush();
        expect(target.getAttribute("data-motion")).toBe("reduce");
        expect(document.documentElement.hasAttribute("data-motion")).toBe(
            false,
        );
        target.remove();
    });

    test("§7.8 selecting an option updates data-motion and fires onChange", async () => {
        const onChange = vi.fn();
        render(
            <MotionPicker
                label="Motion"
                motions={MOTIONS}
                defaultValue="no-preference"
                onChange={onChange}
            />,
        );
        await flush();
        pick("reduce");
        await flush();
        expect(document.documentElement.getAttribute("data-motion")).toBe(
            "reduce",
        );
        expect(onChange).toHaveBeenCalledWith("reduce");
    });
});

describe("MotionPicker — persistence + explicit value (§7.9, §7.10)", () => {
    test("§7.9 persists to localStorage and reads back on a fresh mount", async () => {
        const { unmount } = render(
            <MotionPicker
                label="Motion"
                motions={MOTIONS}
                storageKey="lily-motion"
            />,
        );
        await flush();
        pick("reduce");
        await flush();
        expect(localStorage.getItem("lily-motion")).toBe("reduce");
        unmount();
        resetRoot();

        render(
            <MotionPicker
                label="Motion"
                motions={MOTIONS}
                storageKey="lily-motion"
            />,
        );
        await flush();
        expect(document.documentElement.getAttribute("data-motion")).toBe(
            "reduce",
        );
    });

    test("§7.10 an explicit value prop wins over storage, OS preference, and defaults", async () => {
        mockReducedMotion(true);
        localStorage.setItem("lily-motion", "reduce");
        render(
            <MotionPicker
                label="Motion"
                motions={MOTIONS}
                value="no-preference"
                storageKey="lily-motion"
            />,
        );
        await flush();
        expect(document.documentElement.getAttribute("data-motion")).toBe(
            "no-preference",
        );
    });
});

describe("MotionPicker — spread + custom children (§7.12–§7.13)", () => {
    test("§7.12 extra attributes spread onto the root div", () => {
        render(
            <MotionPicker label="Motion" motions={MOTIONS} data-testid="mp" />,
        );
        const root = screen.getByTestId("mp");
        expect(root.tagName).toBe("DIV");
        expect(root.className).toContain("motion-picker");
    });

    test("§7.13 children replace the button glyph and receive ChildArgs", async () => {
        render(
            <MotionPicker label="Motion" motions={MOTIONS} value="reduce">
                {(args: ChildArgs) => (
                    <span
                        data-testid="custom"
                        data-open={String(args.open)}
                        data-value={args.value}
                        data-label-reduce={args.labelFor("reduce")}
                    >
                        custom glyph
                    </span>
                )}
            </MotionPicker>,
        );
        await flush();
        const custom = screen.getByTestId("custom");
        expect(custom.closest("button")?.className).toContain(
            "motion-picker-button",
        );
        expect(document.querySelector(".motion-picker-icon")).toBeNull();
        expect(custom.getAttribute("data-open")).toBe("false");
        expect(custom.getAttribute("data-value")).toBe("reduce");
        expect(custom.getAttribute("data-label-reduce")).toBe("Reduce");
    });

    test("§7.13 children see open=true once the listbox is expanded", () => {
        render(
            <MotionPicker label="Motion" motions={MOTIONS} value="reduce">
                {(args: ChildArgs) => (
                    <span data-testid="custom" data-open={String(args.open)}>
                        glyph
                    </span>
                )}
            </MotionPicker>,
        );
        fireEvent.click(screen.getByRole("button"));
        expect(screen.getByTestId("custom").getAttribute("data-open")).toBe(
            "true",
        );
    });
});

describe("MotionPicker — accessibility hardening (§7.14–§7.17)", () => {
    async function openPicker(
        motions: string[] = MOTIONS,
        extra: Record<string, unknown> = {},
    ) {
        render(<MotionPicker label="Motion" motions={motions} {...extra} />);
        await flush();
        fireEvent.click(screen.getByRole("button"));
        await flush();
        return {
            button: screen.getByRole("button"),
            list: document.querySelector(
                ".motion-picker-list",
            ) as HTMLElement,
        };
    }

    const active = (list: HTMLElement) =>
        list.querySelector("[data-active]")?.textContent?.trim();

    test("§7.14 Tab from the open list puts focus on the button before closing", async () => {
        const { button, list } = await openPicker();
        expect(document.activeElement).toBe(list);
        fireEvent.keyDown(list, { key: "Tab" });
        await flush();
        expect(document.activeElement).toBe(button);
        expect(list.hasAttribute("hidden")).toBe(true);
    });

    test("§7.15 a repeated typeahead character cycles through its matches", async () => {
        const { list } = await openPicker(["r1", "r2", "r3", "m"], {
            motionLabels: { r1: "Reduce a lot", r2: "Reduce more", r3: "Reduce most", m: "Minimal" },
            defaultValue: "m",
        });
        fireEvent.keyDown(list, { key: "r" });
        expect(active(list)).toBe("Reduce a lot");
        fireEvent.keyDown(list, { key: "r" });
        expect(active(list)).toBe("Reduce more");
        fireEvent.keyDown(list, { key: "r" });
        expect(active(list)).toBe("Reduce most");
    });

    test("§7.16 PageUp and PageDown move the cursor by ten, clamped", async () => {
        const many = Array.from(
            { length: 25 },
            (_, i) => `s${String(i).padStart(2, "0")}`,
        );
        const { list } = await openPicker(many);
        fireEvent.keyDown(list, { key: "PageDown" });
        expect(active(list)).toBe("S10");
        fireEvent.keyDown(list, { key: "PageDown" });
        expect(active(list)).toBe("S20");
        fireEvent.keyDown(list, { key: "PageDown" });
        expect(active(list)).toBe("S24");
        fireEvent.keyDown(list, { key: "PageUp" });
        expect(active(list)).toBe("S14");
    });

    test("§7.17 an empty list opens without aria-activedescendant", async () => {
        const { list } = await openPicker([]);
        expect(list.hasAttribute("hidden")).toBe(false);
        expect(list.getAttribute("aria-activedescendant")).toBeNull();
    });
});

describe("MotionPicker — idempotent apply (§7.19)", () => {
    test("§7.19 controlled mode fires onChange once per changed value", async () => {
        const calls: string[] = [];

        function Host() {
            const [value, setValue] = React.useState("no-preference");
            return (
                <MotionPicker
                    label="Motion"
                    motions={MOTIONS}
                    value={value}
                    onChange={(slug: string) => {
                        calls.push(slug);
                        setValue(slug);
                    }}
                />
            );
        }

        render(<Host />);
        await flush();
        expect(calls).toEqual(["no-preference"]);

        pick("reduce");
        await flush();
        expect(calls).toEqual(["no-preference", "reduce"]);
        expect(
            document.documentElement.getAttribute("data-motion"),
        ).toBe("reduce");
        expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe(
            "false",
        );
    });
});
