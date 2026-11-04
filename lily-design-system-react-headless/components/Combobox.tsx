// Combobox component
//
// A headless combobox combining a text input with a dropdown listbox of
// suggestions for autocomplete or type-ahead search experiences. Users type into
// the input to filter suggestions, then select from matching options in the
// dropdown. Commonly used for search fields, address inputs, tag selectors, and
// choosing from large option sets.
//
// Props:
//   className — string, optional. CSS class name.
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

import React, { useId } from "react";
import { usePopoverState } from "./Popover";
import { warnMissingName } from "./dev-warning";
import { attachCombobox, setActiveOption } from "./combobox-keys";

export interface ComboboxProps {
    className?: string;
    /** Accessible label. */
    label: string;
    /** Current input value. Bindable. */
    value?: string;
    /** Whether dropdown is open. Bindable. */
    open?: boolean;
    /** Dropdown option elements. */
    children: React.ReactNode;
    /** Callback when value changes. */
    onChange?: (value: string) => void;
    /** Callback when open changes. */
    onOpenChange?: (value: boolean) => void;
    /** Called with the chosen option's value. */
    onSelect?: (value: string) => void;
    [key: string]: unknown;
}

export default function Combobox({
    className = "",
    label,
    value = "",
    open = false,
    onChange,
    onOpenChange,
    onSelect,
    children,
    ...restProps
}: ComboboxProps) {
    warnMissingName("Combobox", label, restProps["aria-label"], restProps["aria-labelledby"]);
    const listboxId = `combobox-listbox-${useId()}`;
    const listboxRef = React.useRef<HTMLDivElement>(null);
    usePopoverState(listboxRef, open);

    const inputRef = React.useRef<HTMLInputElement>(null);
    // The module's listeners stay for the component's life, so they read the latest props from here.
    const latest = React.useRef({ open, onChange, onOpenChange, onSelect });
    latest.current = { open, onChange, onOpenChange, onSelect };

    React.useEffect(
        () =>
            attachCombobox(inputRef.current!, listboxRef.current!, {
                open: () => latest.current.open,
                setOpen: (next) => latest.current.onOpenChange?.(next),
                choose: (chosen) => {
                    latest.current.onChange?.(chosen);
                    latest.current.onSelect?.(chosen);
                },
            }),
        [],
    );

    // Closed from outside: no highlight survives into the next opening.
    React.useEffect(() => {
        if (!open) setActiveOption(inputRef.current!, listboxRef.current!, null);
    }, [open]);

    return (
        <div
            className={`combobox ${className}`}
            {...restProps}
        >
            <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-label={label}
                aria-expanded={open}
                aria-controls={listboxId}
                aria-autocomplete="list"
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
            />
            <div
                ref={listboxRef}
                role="listbox"
                popover="manual"
                id={listboxId}
                aria-label={label}
            >
                {children}
            </div>
        </div>
    );
}
