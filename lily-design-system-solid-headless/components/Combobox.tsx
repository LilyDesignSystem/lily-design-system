// Combobox component
//
// A headless combobox combining a text input with a dropdown listbox of
// suggestions for autocomplete or type-ahead search experiences. Users type into
// the input to filter suggestions, then select from matching options in the
// dropdown. Commonly used for search fields, address inputs, tag selectors, and
// choosing from large option sets.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. Accessible name via aria-label on both input and listbox.
//   value — string, default "". Bindable current text input value.
//   open — boolean, default false. Bindable dropdown visibility state: pass onOpenChange too, the keys ask through it.
//   onSelect — function, optional. Called with the chosen option's data-value, else its text.
//   children — ReactNode, required. Option elements rendered inside the listbox dropdown.
//   ...restProps — additional HTML attributes spread onto the wrapper <div>.
//
// Syntax:
//   <Combobox label="Search" value={value} onChange={setValue} open={open} onOpenChange={setOpen}>
//     <div role="option">Option 1</div>
//   </Combobox>
//
// Examples:
//
//   <Combobox label="Select a fruit" value={value} onChange={setValue} open={open} onOpenChange={setOpen}>
//     {filtered.map((option) => (
//       <div role="option">{option}</div>
//     ))}
//   </Combobox>
//
// Keyboard:
//   - ArrowDown, ArrowUp: open on the first or last option, then move and wrap
//   - Home, End: jump to the first or last option while open
//   - Enter: choose the highlighted option
//   - Escape: close while open; left alone while closed
//   - Alt+ArrowDown opens without a highlight; Alt+ArrowUp closes
//
// Accessibility:
//   - role="combobox" on the input identifies it as a combobox widget
//   - aria-expanded reflects the open state for screen readers
//   - aria-controls links the input to the associated listbox by ID
//   - aria-autocomplete="list" indicates suggestions are provided via a list
//   - role="listbox" on the dropdown identifies selectable options
//
// Internationalization:
//   - The label prop provides the accessible name; no hardcoded strings
//   - All option content is provided by consumers through the children prop
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Generates a unique listboxId for the aria-controls relationship
//   - Consumer is responsible for filtering options based on value
//   - combobox-keys.ts owns the keys, typing, blur and pointer: the one module the catalogs share
//
// References:
//   - WAI-ARIA Combobox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/

import type { JSX } from "@solidjs/web";
import {
    merge,
    omit,
    createEffect,
    createSignal,
    createUniqueId,
    onSettled,
    untrack,
} from "solid-js";
import { attr } from "./attr";
import { usePopoverState } from "./Popover";
import { warnMissingName } from "./dev-warning";
import { attachCombobox, setActiveOption } from "./combobox-keys";

export interface ComboboxProps {
    class?: string;
    /** Accessible label. */
    label: string;
    /** Current input value. Bindable. */
    value?: string;
    /** Whether dropdown is open. Bindable. */
    open?: boolean;
    /** Dropdown option elements. */
    children: JSX.Element;
    /** Callback when value changes. */
    onChange?: (value: string) => void;
    /** Callback when open changes. */
    onOpenChange?: (value: boolean) => void;
    /** Called with the chosen option's value. */
    onSelect?: (value: string) => void;
    /** How many options match the text, as the consumer counts them. */
    resultCount?: number;
    /** The count in the consumer's words, announced politely when typing pauses. */
    resultsLabel?: (count: number) => string;
    /** The consumer's words when nothing matches, shown and announced. */
    noResultsLabel?: string;
    /** How long typing must pause, in milliseconds, before the count is announced. Default 500. */
    statusDelay?: number;
    [key: string]: unknown;
}

export default function Combobox(props: ComboboxProps) {
    const p = merge(
        { class: "" as const, value: "" as const, open: false, statusDelay: 500 },
        props,
    );
    const restProps = omit(
        p,
        "class",
        "label",
        "value",
        "open",
        "onChange",
        "onOpenChange",
        "onSelect",
        "resultCount",
        "resultsLabel",
        "noResultsLabel",
        "statusDelay",
        "children",
    );
    warnMissingName("Combobox", p.label, p["aria-label"], p["aria-labelledby"]);
    const listboxId = `combobox-listbox-${createUniqueId()}`;
    const listboxRef: { current: HTMLDivElement | null } = { current: null };
    usePopoverState(listboxRef, () => p.open);

    const inputRef: { current: HTMLInputElement | null } = { current: null };
    // The module's listeners stay for the component's life, so they read the latest props from here.
    // The latest props, read live: a Solid component body runs once.
    const latest = {
        get current() {
            return {
                open: p.open,
                onChange: p.onChange,
                onOpenChange: p.onOpenChange,
                onSelect: p.onSelect,
            };
        },
    };

    onSettled(() =>
        untrack(() =>
            attachCombobox(inputRef.current!, listboxRef.current!, {
                open: () => latest.current.open,
                setOpen: (next) => latest.current.onOpenChange?.(next),
                choose: (chosen) => {
                    latest.current.onChange?.(chosen);
                    latest.current.onSelect?.(chosen);
                },
            }),
        ),
    );

    // The count, or "no matches", in the consumer's words(), after typing pauses (P34-T2).
    const [status, setStatus] = createSignal("");
    const words = () =>
        p.resultCount === undefined
            ? ""
            : p.resultCount === 0
              ? (p.noResultsLabel ?? "")
              : (p.resultsLabel?.(p.resultCount) ?? "");
    createEffect(
        () => [words(), p.open, p.value, p.statusDelay],
        () =>
            untrack(() => {
                const timer = setTimeout(() => setStatus(p.open ? words() : ""), p.statusDelay);
                return () => clearTimeout(timer);
            }),
    );

    // Closed from outside: no highlight survives into the next opening.
    createEffect(
        () => [p.open],
        () =>
            untrack(() => {
                if (!p.open) setActiveOption(inputRef.current!, listboxRef.current!, null);
            }),
    );

    return (
        <div
            class={`combobox ${p.class}`}
            {...restProps}
        >
            <input
                ref={(el) => (inputRef.current = el)}
                type="text"
                role="combobox"
                aria-label={p.label}
                aria-expanded={attr(p.open)}
                aria-controls={listboxId}
                aria-autocomplete="list"
                value={p.value}
                onInput={(e) => p.onChange?.(e.currentTarget.value)}
            />
            <div
                ref={(el) => (listboxRef.current = el)}
                role="listbox"
                popover="manual"
                id={listboxId}
                aria-label={p.label}
            >
                {p.children}
            </div>
            {p.resultsLabel || p.noResultsLabel ? (
                <p
                    class="combobox-status"
                    role="status"
                    data-results={attr(p.resultCount)}
                >
                    {status()}
                </p>
            ) : null}
        </div>
    );
}
