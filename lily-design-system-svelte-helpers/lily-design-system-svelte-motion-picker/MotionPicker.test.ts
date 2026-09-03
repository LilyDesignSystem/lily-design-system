import { render, screen, fireEvent } from "@testing-library/svelte";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import MotionPicker, { motionName, prefersReducedMotion } from "./MotionPicker.svelte";

const MOTIONS = ["no-preference", "reduce"];

function flush(): Promise<void> {
    return new Promise((r) => setTimeout(r, 0));
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

/** Open the listbox and click the option for `slug`. */
async function pick(slug: string, motions: string[] = MOTIONS): Promise<void> {
    await fireEvent.click(screen.getByRole("button"));
    const opts = document.querySelectorAll(".motion-picker-option");
    await fireEvent.click(opts[motions.indexOf(slug)]);
}

beforeEach(() => {
    document.documentElement.removeAttribute("data-motion");
    mockReducedMotion(false);
    try {
        localStorage.clear();
    } catch {
        /* ignore */
    }
});

afterEach(() => {
    document.documentElement.removeAttribute("data-motion");
    vi.restoreAllMocks();
});

describe("MotionPicker — markup contract (§7.1–§7.5)", () => {
    test("§7.1 renders a button that controls a listbox", () => {
        render(MotionPicker, { props: { label: "Motion", motions: MOTIONS } });
        const button = screen.getByRole("button");
        expect(button.tagName).toBe("BUTTON");
        expect(button.getAttribute("type")).toBe("button");
        expect(button.getAttribute("aria-haspopup")).toBe("listbox");
        expect(button.getAttribute("aria-expanded")).toBe("false");
        const listId = button.getAttribute("aria-controls");
        expect(listId).toBeTruthy();
        expect(document.getElementById(listId!)?.getAttribute("role")).toBe("listbox");
    });

    test("§7.1 the button renders the pause glyph, hidden from assistive tech", () => {
        render(MotionPicker, { props: { label: "Motion", motions: MOTIONS } });
        const icon = document.querySelector(".motion-picker-icon") as HTMLElement;
        // U+23F8 PAUSE SIGN + U+FE0E (text presentation) — a real
        // monochrome glyph, not a pictograph that falls back to a bitmap.
        expect(icon.textContent).toBe("\u23F8\uFE0E");
        expect(icon.getAttribute("aria-hidden")).toBe("true");
    });

    test("§7.2 aria-label names the button and the listbox", () => {
        render(MotionPicker, { props: { label: "Choose motion", motions: MOTIONS } });
        expect(screen.getByRole("button", { name: "Choose motion" })).toBeTruthy();
        const list = document.querySelector(".motion-picker-list") as HTMLElement;
        expect(list.getAttribute("aria-label")).toBe("Choose motion");
    });

    test("§7.3 one option per motion; the hidden input carries the supplied name", async () => {
        render(MotionPicker, {
            props: { label: "Motion", motions: MOTIONS, name: "reduced-motion" },
        });
        await flush();
        const options = document.querySelectorAll(".motion-picker-option");
        expect(options.length).toBe(MOTIONS.length);
        const hidden = document.querySelector('input[type="hidden"]') as HTMLInputElement;
        expect(hidden.name).toBe("reduced-motion");
        expect(hidden.value).toBe("no-preference");
    });

    test("§7.4 the listbox is hidden until the button is activated", async () => {
        render(MotionPicker, { props: { label: "Motion", motions: MOTIONS } });
        const list = document.querySelector(".motion-picker-list") as HTMLElement;
        expect(list.hasAttribute("hidden")).toBe(true);
        await fireEvent.click(screen.getByRole("button"));
        expect(list.hasAttribute("hidden")).toBe(false);
        expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("true");
    });

    test("§7.4 the active motion is the aria-selected option", async () => {
        render(MotionPicker, { props: { label: "Motion", motions: MOTIONS } });
        await flush();
        await fireEvent.click(screen.getByRole("button"));
        const selected = document.querySelectorAll('[role="option"][aria-selected="true"]');
        expect(selected.length).toBe(1);
        expect(selected[0].textContent?.trim()).toBe("No Preference");
    });

    test("§7.5 default labels title-case the slug", () => {
        render(MotionPicker, { props: { label: "Motion", motions: ["no-preference", "reduce"] } });
        expect(screen.getByText("No Preference")).toBeTruthy();
        expect(screen.getByText("Reduce")).toBeTruthy();
    });

    test("§7.5 motionName is the exported resolver the default labels use", () => {
        expect(motionName("no-preference")).toBe("No Preference");
        expect(motionName("reduce")).toBe("Reduce");
        render(MotionPicker, { props: { label: "Motion", motions: ["no-preference"] } });
        expect(screen.getByText(motionName("no-preference"))).toBeTruthy();
    });

    test("§7.5 motionLabels override the default title-case label", () => {
        render(MotionPicker, {
            props: {
                label: "Motion",
                motions: ["no-preference", "reduce"],
                motionLabels: { "no-preference": "Full motion", reduce: "Reduced motion" },
            },
        });
        expect(screen.getByText("Full motion")).toBeTruthy();
        expect(screen.getByText("Reduced motion")).toBeTruthy();
    });
});

describe("MotionPicker — keyboard contract (APG listbox)", () => {
    async function openWith(key: string) {
        render(MotionPicker, { props: { label: "Motion", motions: MOTIONS } });
        await flush();
        const button = screen.getByRole("button");
        await fireEvent.keyDown(button, { key });
        await flush();
        return {
            button,
            list: document.querySelector(".motion-picker-list") as HTMLElement,
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
            list.children[MOTIONS.length - 1].id,
        );
    });

    test("§7.15 arrows move the active descendant and clamp", async () => {
        const { list } = await openWith("ArrowDown");
        // "no-preference" resolves as the initial motion, so index 0 is active.
        expect(list.getAttribute("aria-activedescendant")).toBe(list.children[0].id);
        await fireEvent.keyDown(list, { key: "ArrowUp" });
        expect(list.getAttribute("aria-activedescendant")).toBe(list.children[0].id);
        await fireEvent.keyDown(list, { key: "ArrowDown" });
        await fireEvent.keyDown(list, { key: "ArrowDown" });
        expect(list.getAttribute("aria-activedescendant")).toBe(list.children[1].id);
    });

    test("§7.15 Home and End jump to the first and last option", async () => {
        const { list } = await openWith("ArrowDown");
        await fireEvent.keyDown(list, { key: "End" });
        expect(list.getAttribute("aria-activedescendant")).toBe(
            list.children[MOTIONS.length - 1].id,
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
        expect(document.documentElement.dataset.motion).toBe("reduce");
    });

    test("§7.16 Escape closes without changing the motion", async () => {
        const { list } = await openWith("ArrowDown");
        await fireEvent.keyDown(list, { key: "End" });
        await fireEvent.keyDown(list, { key: "Escape" });
        await flush();
        expect(list.hasAttribute("hidden")).toBe(true);
        expect(document.documentElement.dataset.motion).toBe("no-preference");
    });

    test("§7.17 typeahead moves the active descendant by label prefix", async () => {
        const { list } = await openWith("ArrowDown");
        await fireEvent.keyDown(list, { key: "r" });
        // "Reduce" is index 1.
        expect(list.getAttribute("aria-activedescendant")).toBe(list.children[1].id);
    });
});

describe("MotionPicker — application (§7.6–§7.10)", () => {
    test("§7.6 default initial value is 'no-preference' when the OS reports no preference", async () => {
        mockReducedMotion(false);
        render(MotionPicker, { props: { label: "Motion", motions: MOTIONS } });
        await flush();
        expect(document.documentElement.dataset.motion).toBe("no-preference");
    });

    test("§7.6 default initial value is 'reduce' when the OS reports prefers-reduced-motion", async () => {
        mockReducedMotion(true);
        render(MotionPicker, { props: { label: "Motion", motions: MOTIONS } });
        await flush();
        expect(document.documentElement.dataset.motion).toBe("reduce");
    });

    test("§7.6 falls back to motions[0] when neither OS slug is offered", async () => {
        mockReducedMotion(true);
        render(MotionPicker, { props: { label: "Motion", motions: ["standard", "minimal"] } });
        await flush();
        expect(document.documentElement.dataset.motion).toBe("standard");
    });

    test("§7.7 sets data-motion on documentElement", async () => {
        render(MotionPicker, { props: { label: "Motion", motions: MOTIONS } });
        await flush();
        expect(document.documentElement.getAttribute("data-motion")).toBe("no-preference");
    });

    test("§7.8 selecting an option updates data-motion, fires onChange, and closes the listbox", async () => {
        const onChange = vi.fn();
        render(MotionPicker, { props: { label: "Motion", motions: MOTIONS, onChange } });
        await flush();
        await pick("reduce");
        await flush();
        expect(document.documentElement.dataset.motion).toBe("reduce");
        expect(onChange).toHaveBeenCalledWith("reduce");
        // A pointer selection closes, exactly as Enter does. The asymmetry
        // would be invisible to a consumer reading the DOM: a stale
        // aria-expanded over a hidden list makes every later click miss
        // the options.
        expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe(
            "false",
        );
        expect(
            document
                .querySelector(".motion-picker-list")!
                .hasAttribute("hidden"),
        ).toBe(true);
    });

    test("§7.9 persists to localStorage and reads back on a fresh mount", async () => {
        const { unmount } = render(MotionPicker, {
            props: { label: "Motion", motions: MOTIONS, storageKey: "lily-motion" },
        });
        await flush();
        await pick("reduce");
        await flush();
        expect(localStorage.getItem("lily-motion")).toBe("reduce");
        unmount();

        document.documentElement.removeAttribute("data-motion");
        render(MotionPicker, {
            props: { label: "Motion", motions: MOTIONS, storageKey: "lily-motion" },
        });
        await flush();
        expect(document.documentElement.dataset.motion).toBe("reduce");
    });

    test("§7.10 a supplied value prop wins over storage, OS preference, and defaults", async () => {
        mockReducedMotion(true);
        localStorage.setItem("lily-motion", "reduce");
        render(MotionPicker, {
            props: {
                label: "Motion",
                motions: MOTIONS,
                value: "no-preference",
                storageKey: "lily-motion",
            },
        });
        await flush();
        expect(document.documentElement.dataset.motion).toBe("no-preference");
    });
});

describe("MotionPicker — spread + custom children (§7.12–§7.13)", () => {
    test("§7.12 extra attributes spread onto the root", () => {
        render(MotionPicker, {
            props: { label: "Motion", motions: MOTIONS, "data-testid": "mp" },
        });
        expect(screen.getByTestId("mp")).toBeTruthy();
    });

    test("§7.13 children snippet replaces the button glyph and receives ChildArgs", async () => {
        const customSnippet = (($anchor: Comment, args: any) => {
            const node = document.createElement("span");
            const a = args();
            node.setAttribute("data-testid", "custom");
            node.setAttribute("data-open", String(a.open));
            node.setAttribute("data-value", a.value);
            node.setAttribute("data-label-reduce", a.labelFor("reduce"));
            node.textContent = "custom glyph";
            $anchor.before(node);
        }) as any;

        render(MotionPicker, {
            props: {
                label: "Motion",
                motions: MOTIONS,
                // Explicit value: the raw test snippet reads its args once at
                // first render, before the effect resolves an initial value.
                value: "reduce",
                children: customSnippet,
            },
        });
        await flush();
        const custom = screen.getByTestId("custom");
        // The custom glyph replaces the default pause sign inside the button.
        expect(custom.closest("button")?.className).toContain("motion-picker-button");
        expect(document.querySelector(".motion-picker-icon")).toBeNull();
        expect(custom.getAttribute("data-open")).toBe("false");
        expect(custom.getAttribute("data-value")).toBe("reduce");
        expect(custom.getAttribute("data-label-reduce")).toBe("Reduce");
    });
});

describe("MotionPicker — accessibility hardening (§7.14–§7.17)", () => {
    async function openPicker(
        motions: string[] = MOTIONS,
        extra: Record<string, unknown> = {},
    ) {
        render(MotionPicker, {
            props: { label: "Motion", motions, ...extra },
        });
        await flush();
        await fireEvent.click(screen.getByRole("button"));
        await flush();
        return {
            button: screen.getByRole("button"),
            list: document.querySelector(".motion-picker-list") as HTMLElement,
        };
    }

    const active = (list: HTMLElement) =>
        list.querySelector("[data-active]")?.textContent?.trim();

    test("§7.14 Tab from the open list puts focus on the button before closing", async () => {
        const { button, list } = await openPicker();
        expect(document.activeElement).toBe(list);
        await fireEvent.keyDown(list, { key: "Tab" });
        // Focus sits on the button, so the browser's default Tab proceeds
        // from the picker's own position — not from <body>, which is where
        // focus lands when the focused list is hidden first.
        expect(document.activeElement).toBe(button);
        expect(list.hasAttribute("hidden")).toBe(true);
    });

    test("§7.15 a repeated typeahead character cycles through its matches", async () => {
        const { list } = await openPicker(["r1", "r2", "r3", "m"], {
            motionLabels: { r1: "Reduce a lot", r2: "Reduce more", r3: "Reduce most", m: "Minimal" },
            defaultValue: "m",
        });
        await fireEvent.keyDown(list, { key: "r" });
        expect(active(list)).toBe("Reduce a lot");
        await fireEvent.keyDown(list, { key: "r" });
        expect(active(list)).toBe("Reduce more");
        await fireEvent.keyDown(list, { key: "r" });
        expect(active(list)).toBe("Reduce most");
    });

    test("§7.16 PageUp and PageDown move the cursor by ten, clamped", async () => {
        const many = Array.from(
            { length: 25 },
            (_, i) => `s${String(i).padStart(2, "0")}`,
        );
        const { list } = await openPicker(many);
        await fireEvent.keyDown(list, { key: "PageDown" });
        expect(active(list)).toBe("S10");
        await fireEvent.keyDown(list, { key: "PageDown" });
        expect(active(list)).toBe("S20");
        await fireEvent.keyDown(list, { key: "PageDown" });
        expect(active(list)).toBe("S24");
        await fireEvent.keyDown(list, { key: "PageUp" });
        expect(active(list)).toBe("S14");
    });

    test("§7.17 an empty list opens without aria-activedescendant", async () => {
        const { list } = await openPicker([]);
        expect(list.hasAttribute("hidden")).toBe(false);
        expect(list.getAttribute("aria-activedescendant")).toBeNull();
    });
});

describe("MotionPicker — idempotent apply (§7.18)", () => {
    test("§7.18 onChange fires once per changed value, not once per effect run", async () => {
        const onChange = vi.fn();
        const { rerender } = render(MotionPicker, {
            props: { label: "Motion", motions: MOTIONS, onChange },
        });
        await flush();
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenLastCalledWith("no-preference");

        await pick("reduce");
        await flush();
        expect(onChange).toHaveBeenCalledTimes(2);
        expect(onChange).toHaveBeenLastCalledWith("reduce");

        // A prop change re-runs the apply effect. Re-applying the same
        // motion must not re-fire onChange: a consumer callback that
        // writes reactive state would re-enter the effect until Svelte
        // gives up updating the component (effect_update_depth_exceeded)
        // and the listbox freezes.
        await rerender({ storageKey: "lily-motion-later" });
        await flush();
        expect(onChange).toHaveBeenCalledTimes(2);
    });
});

describe("MotionPicker — OS preference helper", () => {
    test("prefersReducedMotion reads (prefers-reduced-motion: reduce)", () => {
        mockReducedMotion(true);
        expect(prefersReducedMotion()).toBe(true);
        mockReducedMotion(false);
        expect(prefersReducedMotion()).toBe(false);
    });
});
