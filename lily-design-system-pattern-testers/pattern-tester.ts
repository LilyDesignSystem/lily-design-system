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
    expect: { focusItem: Index; clicked?: Index; checked?: Index };
}

interface SubmenuContract {
    root: string;
    item: string;
    fixture: string;
    steps: {
        name: string;
        focus?: string;
        press?: string;
        expect: { focus: string; expanded: boolean };
    }[];
}

interface RovingContract {
    root: string;
    item: string;
    oneTabStop?: boolean;
    fixture: string;
    steps: RovingStep[];
}

export type RovingPatternName =
    | "tabs"
    | "menu"
    | "menubar"
    | "tree"
    | "toolbar"
    | "action-group"
    | "radio-group";
export type SubmenuPatternName = "menu-submenu" | "menubar-submenu";
export type OverlayPatternName = "combobox" | "dialog";
export type PatternName =
    | "picker-listbox"
    | "picker-disclosure"
    | RovingPatternName
    | SubmenuPatternName
    | OverlayPatternName
    | "grid"
    | "grid-actions"
    | "command"
    | "splitter"
    | "autosuggest"
    | "tree-expand";

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
    /** Open the widget, for `combobox` and `dialog`, which can also be opened from outside: set the prop, or call the API. */
    open?: () => void | Promise<void>;
    /** `grid-actions`: leave out the editing steps, for a grid with no in-place editing. */
    noEditing?: boolean;
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

interface ComboboxStep {
    name: string;
    open?: boolean;
    press?: string;
    alt?: boolean;
    type?: string;
    click?: number;
    expect: { expanded: boolean; active?: Index; value?: number; prevented?: boolean };
}

interface SplitterStep {
    name: string;
    press?: string;
    shift?: boolean;
    expect: { value: number; prevented?: boolean };
}

interface CommandStep {
    name: string;
    press?: string;
    type?: string;
    expect: { active?: Index; clicked?: number; prevented?: boolean };
}

interface AutosuggestStep {
    name: string;
    press?: string;
    alt?: boolean;
    expect: { expanded: boolean; active?: Index; value?: number; prevented?: boolean };
}

interface TreeStep {
    name: string;
    focus?: string;
    press?: string;
    expect: { expanded: boolean; focus: string };
}

interface GridStep {
    name: string;
    press?: string;
    ctrl?: boolean;
    expect: { cell?: [Index, Index]; sort?: string; editing?: boolean; selected?: boolean };
}

/** The suggestions of the `autosuggest` contract, for a test to pass to what it renders. */
export const autosuggestFixture = contracts.autosuggest.fixture;

/** The columns and rows of the `grid` contract, for a test to pass to the grid it renders. */
export const gridFixture = contracts.grid.fixture;

/** The columns, rows and selection mode of the `grid-actions` contract. */
export const gridActionsFixture = contracts["grid-actions"].fixture;

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
    let clicks: EventTarget[] = [];
    host.addEventListener("click", (event) => clicks.push(event.target as EventTarget));
    for (const step of contract.steps) {
        clicks = [];
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
        if (step.expect.checked !== undefined) {
            const on = all.filter((el) => el.getAttribute("aria-checked") === "true");
            if (on.length !== 1 || on[0] !== all[at(step.expect.checked)])
                fail(step.name, `${on.length} checked, and not the right one`);
        }
        if (contract.oneTabStop) {
            const stops = items().filter((el) => el.tabIndex === 0);
            if (stops.length !== 1 || stops[0] !== want)
                fail(step.name, `${stops.length} tab stop(s), and it must be the focused item`);
        }
        // A native button or link activates itself, which a synthetic key cannot show.
        const clicked = step.expect.clicked === undefined ? undefined : all[at(step.expect.clicked)];
        if (clicked && !clicked.matches("a[href],button") && !clicks.includes(clicked))
            fail(step.name, "the item was not activated");
    }
}

/** A submenu is the consumer's markup, so this contract brings its own, and steps name items by their text. */
async function runSubmenu(pattern: SubmenuPatternName, options: PatternOptions): Promise<void> {
    const { root, hook } = options;
    const contract = contracts[pattern] as SubmenuContract;
    const settle = options.settle ?? tick;
    const fail = (name: string, message: string): never => {
        throw new Error(`${pattern}, ${hook}, "${name}": ${message}`);
    };
    const selector = `[role="${contract.root}"]`;
    const host = root.matches(selector) ? root : root.querySelector<HTMLElement>(selector);
    if (!host) return fail("setup", `no ${selector}`);
    if (!host.querySelector(`[role="${contract.item}"]`)) host.innerHTML = contract.fixture;
    const item = (text: string): HTMLElement =>
        [...host.querySelectorAll<HTMLElement>(`[role="${contract.item}"]`)].find(
            (el) => el.textContent?.trim() === text,
        ) ?? fail("setup", `no item "${text}"`);
    const opener = host.querySelector<HTMLElement>("[aria-haspopup]")!;
    const submenu = root.ownerDocument.getElementById(opener.getAttribute("aria-controls") ?? "");
    if (!submenu) return fail("setup", "aria-controls names nothing");

    for (const step of contract.steps) {
        if (step.focus !== undefined) item(step.focus).focus();
        else if (step.press !== undefined) {
            const target = root.ownerDocument.activeElement;
            if (!target || !host.contains(target)) return fail(step.name, "focus left the widget");
            await fire(
                target,
                new KeyboardEvent("keydown", { key: step.press, bubbles: true, cancelable: true }),
                options,
            );
        }
        await settle();
        const focused = root.ownerDocument.activeElement as HTMLElement | null;
        if (focused !== item(step.expect.focus))
            fail(step.name, `focus is on "${focused?.textContent?.trim()}", not "${step.expect.focus}"`);
        const expanded = opener.getAttribute("aria-expanded");
        if (expanded !== String(step.expect.expanded)) fail(step.name, `aria-expanded is ${expanded}`);
        if (listShown(submenu) !== step.expect.expanded)
            fail(step.name, `submenu shown is ${listShown(submenu)}`);
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

    const labels = contracts.combobox.fixture.options;
    if (!list.querySelector('[role="option"]'))
        for (const label of labels) {
            const option = root.ownerDocument.createElement("div");
            option.setAttribute("role", "option");
            option.textContent = label;
            list.append(option);
        }
    // A catalog may hide what does not match the text, so positions count what is shown.
    const shown = (): HTMLElement[] =>
        [...list.querySelectorAll<HTMLElement>('[role="option"]')].filter((o) => !o.hidden);

    for (const step of contracts.combobox.steps as ComboboxStep[]) {
        let prevented: boolean | undefined;
        if (step.open) {
            if (!options.open) return fail(step.name, "needs the open option");
            await options.open();
            await (options.settle ?? tick)();
        } else if (step.press !== undefined) {
            const event = new KeyboardEvent("keydown", {
                key: step.press,
                altKey: step.alt ?? false,
                bubbles: true,
                cancelable: true,
            });
            prevented = await fire(input, event, options);
        } else if (step.type !== undefined) {
            // Through the prototype's setter, so React sees a change.
            const setter = Object.getOwnPropertyDescriptor(
                Object.getPrototypeOf(input),
                "value",
            )?.set;
            setter?.call(input, step.type);
            await fire(input, new Event("input", { bubbles: true }), options);
        } else if (step.click !== undefined) {
            const option = shown()[step.click];
            await fire(option, new MouseEvent("click", { bubbles: true }), options);
        }
        const { expanded, active, value, prevented: wantPrevented } = step.expect;
        const actual = input.getAttribute("aria-expanded");
        if (actual !== String(expanded)) fail(step.name, `aria-expanded is ${actual}`);
        if (listShown(list) !== expanded) fail(step.name, `list shown is ${listShown(list)}`);
        const descendant = input.getAttribute("aria-activedescendant");
        if (active === undefined) {
            if (descendant) fail(step.name, `aria-activedescendant is ${descendant}`);
        } else {
            const all = shown();
            const want = all[active === "last" ? all.length - 1 : active];
            if (!descendant || descendant !== want?.id)
                fail(step.name, `aria-activedescendant is ${descendant}, not ${want?.id}`);
            const selected = all.filter((o) => o.getAttribute("aria-selected") === "true");
            if (selected.length !== 1 || selected[0] !== want)
                fail(step.name, `${selected.length} option(s) have aria-selected="true"`);
        }
        if (value !== undefined && (input as HTMLInputElement).value !== labels[value])
            fail(step.name, `the input holds "${(input as HTMLInputElement).value}", not "${labels[value]}"`);
        if (wantPrevented !== undefined && prevented !== wantPrevented)
            fail(step.name, `defaultPrevented is ${prevented}, not ${wantPrevented}`);
    }
}

async function runSplitter(options: PatternOptions): Promise<void> {
    const { root, hook } = options;
    const fail = (name: string, message: string): never => {
        throw new Error(`splitter, ${hook}, "${name}": ${message}`);
    };
    const find = (): HTMLElement =>
        (root.matches('[role="separator"]')
            ? root
            : root.querySelector<HTMLElement>('[role="separator"]')) ??
        fail("setup", 'no [role="separator"]');
    if (find().tabIndex !== 0) fail("setup", "the separator is not focusable");
    const vertical = find().getAttribute("aria-orientation") !== "horizontal";
    const keys: Record<string, string> = {
        increase: vertical ? "ArrowRight" : "ArrowDown",
        decrease: vertical ? "ArrowLeft" : "ArrowUp",
    };

    for (const step of contracts.splitter.steps as SplitterStep[]) {
        let prevented: boolean | undefined;
        if (step.press) {
            const event = new KeyboardEvent("keydown", {
                key: keys[step.press] ?? step.press,
                shiftKey: step.shift ?? false,
                bubbles: true,
                cancelable: true,
            });
            prevented = await fire(find(), event, options);
        }
        const now = find().getAttribute("aria-valuenow");
        if (now !== String(step.expect.value))
            fail(step.name, `aria-valuenow is ${now}, not ${step.expect.value}`);
        if (step.expect.prevented !== undefined && prevented !== step.expect.prevented)
            fail(step.name, `defaultPrevented is ${prevented}`);
    }
}

async function runCommand(options: PatternOptions): Promise<void> {
    const { root, hook } = options;
    const fail = (name: string, message: string): never => {
        throw new Error(`command, ${hook}, "${name}": ${message}`);
    };
    const input = root.querySelector<HTMLInputElement>('input[type="search"]');
    if (!input) return fail("setup", 'no input[type="search"]');
    if (!named(input)) fail("setup", "the input has no name");
    const list = root.ownerDocument.getElementById(input.getAttribute("aria-controls") ?? "");
    if (!list) return fail("setup", "aria-controls names nothing");
    if (list.getAttribute("role") !== "listbox") fail("setup", 'the list lacks role="listbox"');
    if (!named(list)) fail("setup", "the listbox has no name");
    if (!list.querySelector('[role="option"]'))
        for (const label of contracts.command.fixture.options) {
            const option = root.ownerDocument.createElement("div");
            option.setAttribute("role", "option");
            option.textContent = label;
            list.append(option);
        }
    const shown = (): HTMLElement[] =>
        [...list.querySelectorAll<HTMLElement>('[role="option"]')].filter((o) => !o.hidden);
    let clicks: EventTarget[] = [];
    list.addEventListener("click", (event) => clicks.push(event.target as EventTarget));

    for (const step of contracts.command.steps as CommandStep[]) {
        clicks = [];
        let prevented: boolean | undefined;
        if (step.press) prevented = await fire(input, escape(step.press), options);
        if (step.type !== undefined) {
            Object.getOwnPropertyDescriptor(Object.getPrototypeOf(input), "value")?.set?.call(
                input,
                step.type,
            );
            await fire(input, new Event("input", { bubbles: true }), options);
        }
        const { active, clicked, prevented: wantPrevented } = step.expect;
        const all = shown();
        const descendant = input.getAttribute("aria-activedescendant");
        if (active === undefined) {
            if (descendant) fail(step.name, `aria-activedescendant is ${descendant}`);
        } else {
            const want = all[active === "last" ? all.length - 1 : active];
            if (!descendant || descendant !== want?.id)
                fail(step.name, `aria-activedescendant is ${descendant}, not ${want?.id}`);
            const selected = all.filter((o) => o.getAttribute("aria-selected") === "true");
            if (selected.length !== 1 || selected[0] !== want)
                fail(step.name, `${selected.length} option(s) have aria-selected="true"`);
        }
        if (clicked !== undefined && !clicks.includes(all[clicked]))
            fail(step.name, "the option was not clicked");
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

async function runGrid(options: PatternOptions, pattern: "grid" | "grid-actions"): Promise<void> {
    const { root, hook } = options;
    const doc = root.ownerDocument;
    const fail = (name: string, message: string): never => {
        throw new Error(`${pattern}, ${hook}, "${name}": ${message}`);
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

    const editor = (): HTMLElement | null =>
        grid().querySelector<HTMLElement>(
            '[role="gridcell"] input:not([type="checkbox"]), td input:not([type="checkbox"]), td textarea, td select',
        );
    let last: HTMLElement | null = null;

    const steps = (contracts[pattern].steps as unknown as GridStep[]).filter(
        (step) => !(options.noEditing && step.expect.editing !== undefined),
    );
    for (const [index, step] of steps.entries()) {
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
        const { cell: where, sort, editing, selected } = step.expect;
        if (editing !== undefined) {
            const open = editor();
            if (!!open !== editing) fail(step.name, `the editor is ${open ? "open" : "closed"}`);
            if (open && doc.activeElement !== open) fail(step.name, "focus is not in the editor");
        }
        if (where) {
            const all = rows();
            const [wantRow, wantCol] = where;
            const row = all[wantRow === "last" ? all.length - 1 : wantRow];
            const cell = row?.[wantCol === "last" ? row.length - 1 : wantCol];
            if (!cell) return fail(step.name, `no cell at ${where}`);
            if (!cell.contains(doc.activeElement))
                fail(step.name, `focus is on "${doc.activeElement?.textContent?.trim()}"`);
            const stops = tabbable();
            if (stops.length !== 1 || stops[0] !== cell)
                fail(step.name, `${stops.length} tab stop(s), and the cell must be the one`);
            last = cell;
        }
        if (sort !== undefined) {
            const got = last?.closest("th, [role='columnheader']")?.getAttribute("aria-sort");
            if (got !== sort) fail(step.name, `aria-sort is ${got}`);
        }
        if (selected !== undefined) {
            // Some catalogs rebuild the table, so the row is found from focus.
            const got = doc.activeElement
                ?.closest("tr, [role='row']")
                ?.getAttribute("aria-selected");
            if ((got === "true") !== selected) fail(step.name, `aria-selected is ${got}`);
        }
    }
}

async function runAutosuggest(options: PatternOptions): Promise<void> {
    const { root, hook } = options;
    const fail = (name: string, message: string): never => {
        throw new Error(`autosuggest, ${hook}, "${name}": ${message}`);
    };
    const input = root.querySelector<HTMLInputElement>('[role="combobox"]');
    if (!input) return fail("setup", 'no [role="combobox"]');
    if (input.getAttribute("aria-autocomplete") !== "list")
        fail("setup", 'the input lacks aria-autocomplete="list"');
    if (!named(input)) fail("setup", "the input has no name");
    const list = (): HTMLElement =>
        root.ownerDocument.getElementById(input.getAttribute("aria-controls") ?? "") ??
        fail("setup", "aria-controls names nothing");
    if (list().getAttribute("role") !== "listbox") fail("setup", 'the popup lacks role="listbox"');
    if (!named(list())) fail("setup", "the listbox has no name");
    const options_ = (): HTMLElement[] => [
        ...list().querySelectorAll<HTMLElement>('[role="option"]'),
    ];
    const labels = contracts.autosuggest.fixture.suggestions.map((s) => s.value);

    for (const step of contracts.autosuggest.steps as AutosuggestStep[]) {
        let prevented: boolean | undefined;
        if (step.press) {
            const event = new KeyboardEvent("keydown", {
                key: step.press,
                altKey: step.alt ?? false,
                bubbles: true,
                cancelable: true,
            });
            prevented = await fire(input, event, options);
        }
        const { expanded, active, value, prevented: wantPrevented } = step.expect;
        const actual = input.getAttribute("aria-expanded");
        if (actual !== String(expanded)) fail(step.name, `aria-expanded is ${actual}`);
        if (listShown(list()) !== expanded) fail(step.name, `list shown is ${listShown(list())}`);
        const descendant = input.getAttribute("aria-activedescendant");
        if (active === undefined) {
            if (descendant) fail(step.name, `aria-activedescendant is ${descendant}`);
        } else {
            const all = options_();
            const want = all[active === "last" ? all.length - 1 : active];
            if (!descendant || descendant !== want?.id)
                fail(step.name, `aria-activedescendant is ${descendant}, not ${want?.id}`);
            const selected = all.filter((o) => o.getAttribute("aria-selected") === "true");
            if (selected.length !== 1 || selected[0] !== want)
                fail(step.name, `${selected.length} option(s) have aria-selected="true"`);
        }
        if (value !== undefined && input.value !== labels[value])
            fail(step.name, `the input holds "${input.value}", not "${labels[value]}"`);
        if (wantPrevented !== undefined && prevented !== wantPrevented)
            fail(step.name, `defaultPrevented is ${prevented}, not ${wantPrevented}`);
    }
}

/**
 * ArrowRight and ArrowLeft on a branch. `root` is the branch `treeitem`, inside a parent `treeitem`; a test puts it
 * there, and the tree around it in the catalogs whose tree owns these keys. A child is added when it has none.
 */
async function runTreeExpand(options: PatternOptions): Promise<void> {
    const { root, hook } = options;
    const doc = root.ownerDocument;
    const contract = contracts["tree-expand"];
    const fail = (name: string, message: string): never => {
        throw new Error(`tree-expand, ${hook}, "${name}": ${message}`);
    };
    const item = (): HTMLElement =>
        root.isConnected
            ? root
            : (doc.querySelector<HTMLElement>(`[data-pattern-branch]`) ?? fail("setup", "lost"));
    root.setAttribute("data-pattern-branch", "");
    if (!root.querySelector('[role="treeitem"]'))
        root.insertAdjacentHTML("beforeend", contract.child);
    const parent = root.parentElement?.closest<HTMLElement>('[role="treeitem"]');
    if (!parent) return fail("setup", "the branch needs a parent treeitem");
    const part = (name: string): HTMLElement | null =>
        name === "item"
            ? item()
            : name === "parent"
              ? parent
              : item().querySelector<HTMLElement>('[role="treeitem"]');

    for (const step of contract.steps as TreeStep[]) {
        if (step.focus) part(step.focus)?.focus();
        else if (step.press) {
            const target = doc.activeElement;
            if (!target) return fail(step.name, "nothing has focus");
            await fire(target, escape(step.press), options);
        }
        const value = item().getAttribute("aria-expanded");
        if (value !== String(step.expect.expanded)) fail(step.name, `aria-expanded is ${value}`);
        const want = part(step.expect.focus);
        if (doc.activeElement !== want) fail(step.name, `focus is not on the ${step.expect.focus}`);
    }
}

export async function runPattern(pattern: PatternName, options: PatternOptions): Promise<void> {
    if (pattern === "autosuggest") return runAutosuggest(options);
    if (pattern === "tree-expand") return runTreeExpand(options);
    if (pattern === "grid" || pattern === "grid-actions") return runGrid(options, pattern);
    if (pattern === "combobox") return runCombobox(options);
    if (pattern === "command") return runCommand(options);
    if (pattern === "splitter") return runSplitter(options);
    if (pattern === "menu-submenu" || pattern === "menubar-submenu")
        return runSubmenu(pattern, options);
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
