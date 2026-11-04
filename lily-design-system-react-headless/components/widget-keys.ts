// The keys Lily's composite widgets share, on consumer-supplied children read from the DOM, so a framework's rendering
// and this stay independent. Each attach function returns its cleanup.
//
// attachToolbar: the APG toolbar. Arrows move and wrap, swapped in right-to-left, Up and Down when aria-orientation is
// vertical; Home and End jump; one tab stop that follows focus. An input keeps its own arrows, and what sits in a
// popover is left alone. With `dismiss`, Escape clicks that button.
//
// attachRadioGroup: the APG radio group. Arrows move, check and wrap; Space and Enter check a segment that is not
// natively a button; one tab stop, on the checked item. aria-checked is written here so the group stays right whether
// or not a framework holds the state, and each change clicks the item, which is how the consumer hears of it.
//
// attachSplitter: the APG window splitter, on a focusable role="separator" whose aria-valuenow, aria-valuemin and
// aria-valuemax it reads and writes. A vertical separator moves on ArrowLeft and ArrowRight, swapped in right-to-left,
// and a horizontal one on ArrowUp and ArrowDown. Shift moves ten steps, Home and End jump to the bounds, and Enter
// collapses to the minimum and restores. Each change sets --splitter-position, reports to onChange, and dispatches a
// bubbling "splitter-change" with detail.value. attachSplitView finds the separator and keeps data-split-percent.
//
// bin/sync-shared-modules strips the types for Nunjucks and Blazor and inlines the result in the HTML snippets. Edit it
// here. The contracts in pattern-contracts.json hold every port to it.

const FOCUSABLE = 'button,a[href],input,select,textarea,[role="button"],[tabindex]';

/** A toolbar's popup: its own keys are its own. Without the Popover API the attribute is gone, so the role says it. */
const OVERLAY = "[popover],[hidden],[role='menu']";

const enabled = (el: Element): boolean =>
    !(el as HTMLButtonElement).disabled && el.getAttribute("aria-disabled") !== "true";

const isRtl = (el: Element): boolean =>
    el.ownerDocument.defaultView?.getComputedStyle(el).direction === "rtl";

export interface ToolbarOptions {
    /** A selector for the button Escape clicks, such as a clear-selection button. */
    dismiss?: string;
}

/** The toolbar's own controls: not what sits in its popover. */
function toolbarItems(root: HTMLElement): HTMLElement[] {
    return [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => enabled(el) && !el.closest(OVERLAY),
    );
}

export function attachToolbar(root: HTMLElement, options: ToolbarOptions = {}): () => void {
    const tabStop = (item: HTMLElement): void => {
        for (const el of toolbarItems(root)) el.tabIndex = el === item ? 0 : -1;
    };

    function onKeydown(event: KeyboardEvent): void {
        if (event.isComposing) return;
        const target = event.target as HTMLElement;
        if (target.closest(OVERLAY)) return;
        if (event.key === "Escape") {
            const button = options.dismiss
                ? root.querySelector<HTMLElement>(options.dismiss)
                : null;
            if (button) {
                event.preventDefault();
                button.click();
            }
            return;
        }
        // An editable control keeps its arrows, Home and End.
        if (target.matches("input,select,textarea")) return;
        const items = toolbarItems(root);
        if (items.length === 0) return;
        const vertical = root.getAttribute("aria-orientation") === "vertical";
        const rtl = isRtl(root);
        const next = vertical ? "ArrowDown" : rtl ? "ArrowLeft" : "ArrowRight";
        const prev = vertical ? "ArrowUp" : rtl ? "ArrowRight" : "ArrowLeft";
        const index = items.indexOf(root.ownerDocument.activeElement as HTMLElement);
        let to: HTMLElement | undefined;
        if (event.key === next) to = items[(index + 1) % items.length];
        else if (event.key === prev) to = items[index > 0 ? index - 1 : items.length - 1];
        else if (event.key === "Home") to = items[0];
        else if (event.key === "End") to = items[items.length - 1];
        if (!to) return;
        event.preventDefault();
        to.focus();
    }
    function onFocusin(event: FocusEvent): void {
        const target = event.target as HTMLElement;
        if (toolbarItems(root).includes(target)) tabStop(target);
    }

    root.addEventListener("keydown", onKeydown);
    root.addEventListener("focusin", onFocusin);
    const first = toolbarItems(root)[0];
    if (first) tabStop(first);
    return () => {
        root.removeEventListener("keydown", onKeydown);
        root.removeEventListener("focusin", onFocusin);
    };
}

export function attachRadioGroup(root: HTMLElement): () => void {
    const radios = (): HTMLElement[] => [...root.querySelectorAll<HTMLElement>('[role="radio"]')];
    const mark = (checked: HTMLElement | undefined): void => {
        const stop = checked ?? radios().find(enabled);
        for (const el of radios()) {
            if (checked) el.setAttribute("aria-checked", String(el === checked));
            el.tabIndex = el === stop ? 0 : -1;
        }
    };
    const current = (): HTMLElement | undefined =>
        radios().find((el) => el.getAttribute("aria-checked") === "true");

    function onKeydown(event: KeyboardEvent): void {
        if (event.isComposing) return;
        const items = radios().filter(enabled);
        const active = root.ownerDocument.activeElement as HTMLElement;
        const index = items.indexOf(active);
        if (index < 0) return;
        const rtl = isRtl(root);
        const forward = event.key === "ArrowDown" || event.key === (rtl ? "ArrowLeft" : "ArrowRight");
        const back = event.key === "ArrowUp" || event.key === (rtl ? "ArrowRight" : "ArrowLeft");
        if (forward || back) {
            event.preventDefault();
            const to = items[(index + (forward ? 1 : -1) + items.length) % items.length];
            to.focus();
            to.click();
        } else if ((event.key === " " || event.key === "Enter") && active.localName !== "button") {
            event.preventDefault();
            active.click();
        }
    }
    function onClick(event: Event): void {
        const radio = (event.target as Element).closest<HTMLElement>('[role="radio"]');
        if (radio && enabled(radio)) mark(radio);
    }

    root.addEventListener("keydown", onKeydown);
    root.addEventListener("click", onClick);
    mark(current());
    return () => {
        root.removeEventListener("keydown", onKeydown);
        root.removeEventListener("click", onClick);
    };
}

export interface SplitterOptions {
    /** Called with each new value. */
    onChange?: (value: number) => void;
    /** Steps per key press. Default 1. */
    step?: number;
}

export function attachSplitter(separator: HTMLElement, options: SplitterOptions = {}): () => void {
    const number = (name: string, fallback: number): number => {
        const read = Number(separator.getAttribute(name));
        return separator.hasAttribute(name) && Number.isFinite(read) ? read : fallback;
    };
    const step = options.step ?? 1;
    let restore: number | null = null;

    function set(value: number): void {
        const next = Math.min(number("aria-valuemax", 100), Math.max(number("aria-valuemin", 0), value));
        if (next === number("aria-valuenow", 50)) return;
        separator.setAttribute("aria-valuenow", String(next));
        separator.style.setProperty("--splitter-position", `${next}%`);
        options.onChange?.(next);
        separator.dispatchEvent(
            new CustomEvent("splitter-change", { bubbles: true, detail: { value: next } }),
        );
    }

    function onKeydown(event: KeyboardEvent): void {
        const vertical = separator.getAttribute("aria-orientation") !== "horizontal";
        const rtl = vertical && isRtl(separator);
        const up = vertical ? (rtl ? "ArrowLeft" : "ArrowRight") : "ArrowDown";
        const down = vertical ? (rtl ? "ArrowRight" : "ArrowLeft") : "ArrowUp";
        const now = number("aria-valuenow", 50);
        const min = number("aria-valuemin", 0);
        const stride = step * (event.shiftKey ? 10 : 1);
        if (event.key === up) set(now + stride);
        else if (event.key === down) set(now - stride);
        else if (event.key === "Home") set(min);
        else if (event.key === "End") set(number("aria-valuemax", 100));
        else if (event.key === "Enter") {
            if (now > min) {
                restore = now;
                set(min);
            } else set(restore ?? number("aria-valuemax", 100));
        } else return;
        event.preventDefault();
    }

    separator.addEventListener("keydown", onKeydown);
    return () => separator.removeEventListener("keydown", onKeydown);
}

export function attachSplitView(root: HTMLElement, options: SplitterOptions = {}): () => void {
    const separator = root.querySelector<HTMLElement>('[role="separator"]');
    if (!separator) return () => {};
    return attachSplitter(separator, {
        ...options,
        onChange(value) {
            root.setAttribute("data-split-percent", String(value));
            options.onChange?.(value);
        },
    });
}

const ATTACH: Record<string, (el: HTMLElement, options?: never) => () => void> = {
    toolbar: attachToolbar as never,
    "radio-group": attachRadioGroup as never,
    splitter: attachSplitter as never,
    "split-view": attachSplitView as never,
};

interface DotNetHost {
    invokeMethodAsync: (name: string, ...args: unknown[]) => Promise<unknown>;
}

/** Blazor attaches by name, and disposes the handle. Its state is C#'s, so changes report there. */
export function attach(
    kind: string,
    el: HTMLElement,
    options?: object | null,
    dotnet?: DotNetHost,
): { dispose: () => void } {
    const onChange = (value: unknown): void => {
        void dotnet?.invokeMethodAsync("OnKeyedChange", value);
    };
    return { dispose: ATTACH[kind](el, { ...options, onChange } as never) };
}
