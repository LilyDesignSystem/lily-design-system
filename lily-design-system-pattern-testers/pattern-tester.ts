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
import contracts from "./pattern-contracts.json" with { type: "json" };

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

interface RovingStep {
    name: string;
    focus?: number;
    press?: string;
    expect: { focusItem: Index };
}

interface RovingContract {
    root: string;
    item: string;
    fixture: string;
    steps: RovingStep[];
}

export type RovingPatternName = "tabs" | "menu" | "menubar" | "tree";
export type OverlayPatternName = "combobox" | "dialog";
export type PatternName =
    "picker-listbox" | "picker-disclosure" | RovingPatternName | OverlayPatternName | "grid";

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
    /** Open the widget, for `combobox` and `dialog`, whose opening is the consumer's: set the prop, or call the API. */
    open?: () => void | Promise<void>;
    /** Wrap a DOM event in the framework's batching, such as React's `act`. */
    act?: (run: () => Promise<void>) => void | Promise<void>;
}

interface OverlayStep {
    name: string;
    open?: boolean;
    press?: string;
    pressHandled?: string;
    cancel?: boolean;
    expect: {
        expanded?: boolean;
        prevented?: boolean;
        open?: boolean;
        modal?: boolean;
        focusInside?: boolean;
        focusOpener?: boolean;
    };
}

interface GridStep {
    name: string;
    press?: string;
    ctrl?: boolean;
    expect: { cell: [Index, Index] };
}

/** The columns and rows of the `grid` contract, for a test to pass to the grid it renders. */
export const gridFixture = contracts.grid.fixture;

const tick = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

/**
 * A container that moves focus between its items. The contract's own fixture goes into an empty root, so every catalog
 * proves the container's keys on the same items; the item components have their own tests.
 */
async function runRoving(pattern: RovingPatternName, options: PatternOptions): Promise<void> {
    const { root, hook } = options;
    const contract = contracts[pattern] as RovingContract;
    const settle = options.settle ?? tick;
    const selector = `[role="${contract.root}"]`;
    const host = root.matches(selector) ? root : root.querySelector<HTMLElement>(selector);
    const fail = (name: string, message: string): never => {
        throw new Error(`${pattern}, ${hook}, "${name}": ${message}`);
    };
    if (!host) return fail("setup", `no ${selector}`);
    if (!host.getAttribute("aria-label") && !host.getAttribute("aria-labelledby"))
        fail("setup", `${selector} has no name`);
    if (!host.querySelector(`[role="${contract.item}"]`)) host.innerHTML = contract.fixture;

    // An item inside a collapsed parent is not visible, so keys skip it.
    const items = (): HTMLElement[] =>
        [...host.querySelectorAll<HTMLElement>(`[role="${contract.item}"]`)].filter(
            (el) => !el.parentElement?.closest(`[role="${contract.item}"][aria-expanded="false"]`),
        );
    for (const step of contract.steps) {
        const all = items();
        const at = (index: Index): number => (index === "last" ? all.length - 1 : index);
        if (all.length < 3) fail(step.name, `needs three items, found ${all.length}`);
        if (step.focus !== undefined) all[step.focus].focus();
        else if (step.press !== undefined) {
            const target = root.ownerDocument.activeElement;
            if (!target || !host.contains(target)) return fail(step.name, "focus left the widget");
            if (options.press) await options.press(target, step.press);
            else {
                target.dispatchEvent(
                    new KeyboardEvent("keydown", {
                        key: step.press,
                        bubbles: true,
                        cancelable: true,
                    }),
                );
                await settle();
            }
        }
        const focused = root.ownerDocument.activeElement as HTMLElement | null;
        const want = all[at(step.expect.focusItem)];
        if (focused !== want)
            fail(
                step.name,
                `focus is on "${focused?.textContent?.trim()}", not "${want.textContent?.trim()}"`,
            );
    }
}

const named = (el: Element): boolean =>
    !!el.getAttribute("aria-label") || !!el.getAttribute("aria-labelledby");

/** Fire an event, let the framework settle, and say whether a handler called `preventDefault`. */
async function fire(target: EventTarget, event: Event, options: PatternOptions): Promise<boolean> {
    const send = async (): Promise<void> => {
        target.dispatchEvent(event);
        await (options.settle ?? tick)();
    };
    if (options.act) await options.act(send);
    else await send();
    return event.defaultPrevented;
}

const escape = (key: string): KeyboardEvent =>
    new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });

/** The list is a popover, or `hidden` where the Popover API is missing. */
const listShown = (list: HTMLElement): boolean =>
    list.hasAttribute("popover") && typeof list.showPopover === "function"
        ? list.matches(":popover-open")
        : !list.hidden;

async function runCombobox(options: PatternOptions): Promise<void> {
    const { root, hook } = options;
    const fail = (name: string, message: string): never => {
        throw new Error(`combobox, ${hook}, "${name}": ${message}`);
    };
    const input = root.querySelector<HTMLElement>('[role="combobox"]');
    if (!input) return fail("setup", 'no [role="combobox"]');
    const list = root.ownerDocument.getElementById(input.getAttribute("aria-controls") ?? "");
    if (!list) return fail("setup", "aria-controls names nothing");
    if (list.getAttribute("role") !== "listbox") fail("setup", 'the popup lacks role="listbox"');
    if (input.getAttribute("aria-autocomplete") !== "list")
        fail("setup", 'the input lacks aria-autocomplete="list"');
    if (!named(input)) fail("setup", "the input has no name");
    if (!named(list)) fail("setup", "the listbox has no name");

    for (const step of contracts.combobox.steps as OverlayStep[]) {
        let prevented: boolean | undefined;
        if (step.open) {
            if (!options.open) return fail(step.name, "needs the open option");
            await options.open();
            await (options.settle ?? tick)();
        } else if (step.press) prevented = await fire(input, escape(step.press), options);
        const { expanded, prevented: wantPrevented } = step.expect;
        const value = input.getAttribute("aria-expanded");
        if (value !== String(expanded)) fail(step.name, `aria-expanded is ${value}`);
        if (listShown(list) !== expanded) fail(step.name, `list shown is ${listShown(list)}`);
        if (wantPrevented !== undefined && prevented !== wantPrevented)
            fail(step.name, `defaultPrevented is ${prevented}, not ${wantPrevented}`);
    }
}

/**
 * Where the engine has no `showModal` (jsdom) it is stubbed the way a browser behaves: focus moves in, and `close`
 * returns it. A real engine keeps its own, and the wrapper only counts the call.
 */
function stubModal(doc: Document): { calls: () => number; restore: () => void } {
    const proto = (doc.defaultView as Window & typeof globalThis).HTMLDialogElement.prototype;
    const nativeShow = proto.showModal;
    const nativeClose = proto.close;
    let calls = 0;
    let previous: HTMLElement | null = null;
    proto.showModal = function (this: HTMLDialogElement) {
        calls += 1;
        if (nativeShow) return nativeShow.call(this);
        previous = doc.activeElement as HTMLElement | null;
        this.setAttribute("open", "");
        (
            this.querySelector<HTMLElement>("button, [href], input, select, textarea") ?? this
        ).focus();
    };
    if (!nativeClose)
        proto.close = function (this: HTMLDialogElement) {
            this.removeAttribute("open");
            previous?.focus();
        };
    return {
        calls: () => calls,
        restore: () => {
            proto.showModal = nativeShow;
            proto.close = nativeClose;
        },
    };
}

async function runDialog(options: PatternOptions): Promise<void> {
    const { root, hook } = options;
    const doc = root.ownerDocument;
    const fail = (name: string, message: string): never => {
        throw new Error(`dialog, ${hook}, "${name}": ${message}`);
    };
    const dialog = (): HTMLDialogElement | null =>
        root.matches("dialog")
            ? (root as HTMLDialogElement)
            : root.querySelector<HTMLDialogElement>("dialog");
    const isOpen = (): boolean => dialog()?.hasAttribute("open") ?? false;

    const opener = doc.createElement("button");
    doc.body.append(opener);
    opener.focus();
    const modal = stubModal(doc);
    try {
        for (const step of contracts.dialog.steps as OverlayStep[]) {
            if (step.open) {
                if (!options.open) return fail(step.name, "needs the open option");
                await options.open();
                await (options.settle ?? tick)();
            } else if (step.press) {
                const target = (doc.activeElement as HTMLElement | null) ?? dialog()!;
                await fire(target, escape(step.press), options);
            } else if (step.pressHandled) {
                const inner = doc.createElement("span");
                dialog()!.append(inner);
                inner.addEventListener("keydown", (event) => event.preventDefault());
                await fire(inner, escape(step.pressHandled), options);
                inner.remove();
            } else if (step.cancel)
                await fire(dialog()!, new Event("cancel", { cancelable: true }), options);

            const expected = step.expect;
            if (isOpen() !== expected.open) fail(step.name, `open is ${isOpen()}`);
            const el = dialog();
            if (expected.modal) {
                if (!modal.calls()) fail(step.name, "showModal() was not called");
                if (el?.getAttribute("aria-modal") !== "true")
                    fail(step.name, 'it lacks aria-modal="true"');
                if (!el || !named(el)) fail(step.name, "it has no name");
            }
            if (expected.focusInside && !el?.contains(doc.activeElement))
                fail(step.name, "focus did not move into it");
            if (expected.focusOpener && doc.activeElement !== opener)
                fail(step.name, "focus did not return to the opener");
        }
    } finally {
        modal.restore();
        opener.remove();
    }
}

async function runGrid(options: PatternOptions): Promise<void> {
    const { root, hook } = options;
    const doc = root.ownerDocument;
    const fail = (name: string, message: string): never => {
        throw new Error(`grid, ${hook}, "${name}": ${message}`);
    };
    // Some catalogs rebuild the table on a move, so it is found afresh each time.
    const grid = (): HTMLElement => {
        const found = root.matches('[role="grid"]')
            ? root
            : root.querySelector<HTMLElement>('[role="grid"]');
        return found ?? fail("setup", 'no [role="grid"]');
    };
    if (!named(grid())) fail("setup", "the grid has no name");
    const rows = (): HTMLElement[][] =>
        [...grid().querySelectorAll<HTMLElement>('tr, [role="row"]')].map((row) => [
            ...row.querySelectorAll<HTMLElement>(
                'th, td, [role="gridcell"], [role="columnheader"], [role="rowheader"]',
            ),
        ]);
    const tabbable = (): HTMLElement[] =>
        rows()
            .flat()
            .filter((cell) => cell.getAttribute("tabindex") === "0");

    for (const [index, step] of (contracts.grid.steps as unknown as GridStep[]).entries()) {
        if (index === 0) tabbable()[0]?.focus();
        else if (step.press) {
            const target = doc.activeElement;
            if (!target || !grid().contains(target)) return fail(step.name, "focus left the grid");
            const event = new KeyboardEvent("keydown", {
                key: step.press,
                ctrlKey: !!step.ctrl,
                bubbles: true,
                cancelable: true,
            });
            await fire(target, event, options);
        }
        const all = rows();
        const [wantRow, wantCol] = step.expect.cell;
        const row = all[wantRow === "last" ? all.length - 1 : wantRow];
        const cell = row?.[wantCol === "last" ? row.length - 1 : wantCol];
        if (!cell) return fail(step.name, `no cell at ${step.expect.cell}`);
        if (!cell.contains(doc.activeElement))
            fail(step.name, `focus is on "${doc.activeElement?.textContent?.trim()}"`);
        const stops = tabbable();
        if (stops.length !== 1 || stops[0] !== cell)
            fail(step.name, `${stops.length} tab stop(s), and the cell must be the one`);
    }
}

export async function runPattern(pattern: PatternName, options: PatternOptions): Promise<void> {
    if (pattern === "grid") return runGrid(options);
    if (pattern === "combobox") return runCombobox(options);
    if (pattern === "dialog") return runDialog(options);
    if (pattern !== "picker-listbox" && pattern !== "picker-disclosure")
        return runRoving(pattern, options);
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

    for (const step of contracts[pattern].steps as unknown as Step[]) {
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
