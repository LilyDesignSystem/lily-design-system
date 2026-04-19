// Listbox component
//
// A headless listbox that presents a list of selectable options using the ARIA
// listbox role with full keyboard navigation. It renders a <div> with
// role="listbox" and manages focus movement between child option elements via
// arrow keys. Used when users need to select one or more items from a visible
// list, such as settings panels, filter selections, or multi-select interfaces.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name applied via aria-label.
//   children — ReactNode, required. Option elements (should have role="option" and tabindex="-1").
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <Listbox label="Fruits">
//     <div role="option" tabindex="-1">Apple</div>
//   </Listbox>
//
// Examples:
//   
//   <Listbox label="Fruits">
//     <div role="option" tabindex="-1">Apple</div>
//     <div role="option" tabindex="-1">Banana</div>
//   </Listbox>
//
//   
//   <Listbox label="Select a color">
//     {colors.map((color) => (
//       <div role="option" tabindex="-1" aria-selected={selected === color}
//         onClick={() => setSelected(color)}>{color}</div>
//     ))}
//   </Listbox>
//
// Keyboard:
//   - ArrowDown: move focus to next option, wrapping from last to first
//   - ArrowUp: move focus to previous option, wrapping from first to last
//   - Home: move focus to the first option
//   - End: move focus to the last option
//
// Accessibility:
//   - role="listbox" identifies the container as a listbox widget
//   - aria-label provides an accessible name describing the listbox purpose
//   - Child elements should use role="option" and optionally aria-selected
//
// Internationalization:
//   - The label prop accepts any translated string
//   - All option content comes through the children prop
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Arrow keys wrap around at boundaries
//   - Consumer handles selection state externally
//
// References:
//   - WAI-ARIA Listbox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/

import React, { useRef } from "react";

export interface ListboxProps {
    className?: string;
    /** Accessible label. */
    label: string;
    /** Option elements. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function Listbox({
    className = "",
    label,
    children,
    ...restProps
}: ListboxProps) {
    const listRef = useRef<HTMLDivElement>(null);

    function handleKeyDown(event: React.KeyboardEvent) {
        if (!listRef.current) return;
        const options = Array.from(
            listRef.current.querySelectorAll<HTMLElement>("[role='option']"),
        );
        const current = document.activeElement as HTMLElement;
        const index = options.indexOf(current);
        switch (event.key) {
            case "ArrowDown": {
                event.preventDefault();
                const next = index < options.length - 1 ? index + 1 : 0;
                options[next]?.focus();
                break;
            }
            case "ArrowUp": {
                event.preventDefault();
                const prev = index > 0 ? index - 1 : options.length - 1;
                options[prev]?.focus();
                break;
            }
            case "Home": {
                event.preventDefault();
                options[0]?.focus();
                break;
            }
            case "End": {
                event.preventDefault();
                options[options.length - 1]?.focus();
                break;
            }
        }
    }

    return (
        <div
        className={`listbox ${className}`}
        role="listbox"
        aria-label={label}
        ref={listRef}
        onKeyDown={handleKeyDown}
        {...restProps}
        >
        {children}
        </div>
    );
}
