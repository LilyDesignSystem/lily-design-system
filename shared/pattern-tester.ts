/**
 * Pattern testers: drive one interaction contract (`pattern-contracts.json`) against a rendered component, through
 * roles and ARIA state, so every catalog proves the same behaviour instead of hand-porting its keyboard tests. Its C#
 * twin is `PatternTester.cs`. Framework-free and dependency-free; a catalog only supplies how to settle a render.
 *
 *     await runPattern("picker-listbox", { root, hook: "theme-picker" });
 *
 * Roles and ARIA are read from the DOM; the only class hooks used are the stable `{hook}-button`, and the popup comes
 * from the button's `aria-controls`. Spec: spec/testing/index.md#pattern-testers.
 */
import contracts from "./pattern-contracts.json";

type Index = number | "last";
type Part = "button" | "popup";

interface Step {
    name: string;
    press?: string;
    pressFirstLetterOf?: number;
    click?: Part;
    on?: Part;
    expect: { expanded?: boolean; active?: Index; selected?: Index; focus?: Part };
}

export type PatternName = "picker-listbox" | "picker-disclosure";

export interface PatternOptions {
    /** The rendered component root. */
    root: HTMLElement;
    /** Its base class, such as `theme-picker`. */
    hook: string;
    /** Wait for the framework to update the DOM. Default: one macrotask. */
    settle?: () => void | Promise<void>;
    /** Send a key. Default: a bubbling, cancelable `keydown` on the target, then `settle`. */
    press?: (target: Element, key: string) => void | Promise<void>;
    /** Click. Default: `target.click()`, then `settle`. */
    click?: (target: HTMLElement) => void | Promise<void>;
}

const tick = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

export async function runPattern(pattern: PatternName, options: PatternOptions): Promise<void> {
    const { root, hook } = options;
    const settle = options.settle ?? tick;
    const press =
        options.press ??
        (async (target: Element, key: string) => {
            target.dispatchEvent(
                new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }),
            );
            await settle();
        });
    const click =
        options.click ??
        (async (target: HTMLElement) => {
            target.click();
            await settle();
        });

    const button = (): HTMLElement => {
        const found = root.querySelector<HTMLElement>(`.${hook}-button`);
        if (!found) throw new Error(`${pattern}: no .${hook}-button`);
        return found;
    };
    const popup = (): HTMLElement | null => {
        const id = button().getAttribute("aria-controls");
        return id ? root.ownerDocument.getElementById(id) : null;
    };
    const part = (name: Part): HTMLElement => {
        const found = name === "button" ? button() : popup();
        if (!found) throw new Error(`${pattern}: no ${name}; aria-controls must name it`);
        return found;
    };

    for (const step of contracts[pattern].steps as Step[]) {
        const fail = (message: string): never => {
            throw new Error(`${pattern}, ${hook}, "${step.name}": ${message}`);
        };
        const options_ = (): HTMLElement[] => [
            ...part("popup").querySelectorAll<HTMLElement>('[role="option"]'),
        ];
        const at = (index: Index): number => (index === "last" ? options_().length - 1 : index);

        if (step.click) await click(part(step.click));
        else if (step.press !== undefined) await press(part(step.on ?? "button"), step.press);
        else if (step.pressFirstLetterOf !== undefined) {
            const label = options_()[step.pressFirstLetterOf]?.textContent?.trim() ?? "";
            await press(part(step.on ?? "button"), label.charAt(0).toLowerCase());
        }

        const expected = step.expect;
        if (expected.expanded !== undefined) {
            const value = button().getAttribute("aria-expanded");
            if (value !== String(expected.expanded))
                fail(`aria-expanded is ${value}, not ${expected.expanded}`);
            const hidden = popup()?.hidden ?? true;
            if (hidden === expected.expanded)
                fail(`popup hidden is ${hidden} while aria-expanded is ${value}`);
        }
        if (pattern === "picker-listbox") {
            if (button().getAttribute("aria-haspopup") !== "listbox")
                fail('the button lacks aria-haspopup="listbox"');
            const list = part("popup");
            if (list.getAttribute("role") !== "listbox") fail('the popup lacks role="listbox"');
            if (!list.getAttribute("aria-label") && !list.getAttribute("aria-labelledby"))
                fail("the listbox has no name");
            const all = options_();
            if (all.length < 3) fail(`needs three options, found ${all.length}`);
            if (
                new Set(all.map((o) => o.textContent?.trim().charAt(0).toLowerCase())).size !==
                all.length
            )
                fail("the fixture's option labels must start with different letters");
            for (const option of all) {
                const value = option.getAttribute("aria-selected");
                if (value !== "true" && value !== "false")
                    fail(`option "${option.textContent?.trim()}" has aria-selected=${value}`);
            }
            if (expected.selected !== undefined) {
                const selected = all.flatMap((o, i) =>
                    o.getAttribute("aria-selected") === "true" ? [i] : [],
                );
                if (selected.length !== 1 || selected[0] !== at(expected.selected))
                    fail(
                        `selected option(s) ${JSON.stringify(selected)}, expected ${at(expected.selected)}`,
                    );
            }
            if (expected.active !== undefined) {
                const target = all[at(expected.active)];
                const active = list.getAttribute("aria-activedescendant");
                if (!active || active !== target.id)
                    fail(`aria-activedescendant is ${active}, not ${target.id}`);
                const marked = all.flatMap((o, i) => (o.hasAttribute("data-active") ? [i] : []));
                if (marked.length !== 1 || marked[0] !== at(expected.active))
                    fail(
                        `data-active on ${JSON.stringify(marked)}, expected ${at(expected.active)}`,
                    );
            }
        }
        if (expected.focus !== undefined) {
            const focused = root.ownerDocument.activeElement;
            if (focused !== part(expected.focus))
                fail(
                    `focus is on ${focused?.className || focused?.tagName}, not the ${expected.focus}`,
                );
        }
    }
}
