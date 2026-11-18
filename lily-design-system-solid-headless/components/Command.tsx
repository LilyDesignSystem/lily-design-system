// Command component
//
// A headless command palette providing a searchable list of actions or items.
// It renders a search region containing a text input and a listbox for results.
// The search value is bindable, allowing consumers to implement their own filtering
// logic and dynamically update the listbox content. Commonly used for Ctrl+K quick-access
// command palettes, searchable menus, and action launchers.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. Accessible name for the search region and input.
//   placeholder — string, default undefined. Placeholder text for the search input.
//   value — string, default "". Current search text; bindable via value + onChange.
//   children — ReactNode, required. Listbox content, typically option or command items.
//   ...restProps — additional HTML attributes spread onto the outer <div>.
//
// Syntax:
//   <Command label="Command palette" placeholder="Search..." value={query} onChange={setQuery}>
//     <div role="option">Action</div>
//   </Command>
//
// Examples:
//
//   <Command label="Command palette" placeholder="Search commands..." value={query} onChange={setQuery}>
//     {filteredCommands.map((cmd) => (
//       <div role="option">{cmd.name}</div>
//     ))}
//   </Command>
//
// Keyboard:
//   - Tab: Move focus into and out of the search input
//   - Additional keyboard navigation within the listbox should be implemented by the consumer
//
// Accessibility:
//   - role="search" identifies the outer container as a search landmark
//   - aria-label provides accessible names for the search region, input, and listbox
//   - role="listbox" identifies the results container for selectable options
//   - autocomplete="off" prevents browser autocomplete from interfering
//
// Internationalization:
//   - The label and placeholder props provide all text; no hardcoded strings
//   - All command content is provided by consumers through the children prop
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Consumer is responsible for filtering and rendering listbox content
//   - Consumer should implement arrow key navigation within the listbox
//
// References:
//   - WAI-ARIA Listbox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
//   - WAI-ARIA Combobox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/

import type { JSX } from "@solidjs/web";
import { omit, createUniqueId, onSettled, untrack } from "solid-js";
import { withDefaults } from "./defaults";
import { attachCommand } from "./command-keys";
import { warnMissingName } from "./dev-warning";

export interface CommandProps {
    class?: string;
    label: string;
    placeholder?: string;
    value?: string;
    children: JSX.Element;
    /** Callback when value changes. */
    onChange?: (value: string) => void;
    [key: string]: unknown;
}

export default function Command(props: CommandProps) {
    const p = withDefaults({ class: "" as const, value: "" as const }, props);
    const restProps = omit(p, "class", "label", "placeholder", "value", "onChange", "children");
    warnMissingName("Command", p.label, p["aria-label"], p["aria-labelledby"]);
    const listId = `command-list-${createUniqueId()}`;
    const inputRef: { current: HTMLInputElement | null } = { current: null };
    const listRef: { current: HTMLDivElement | null } = { current: null };
    onSettled(() => untrack(() => attachCommand(inputRef.current!, listRef.current!)));

    return (
        <div
            class={`command ${p.class}`}
            role="search"
            aria-label={p.label}
            {...restProps}
        >
            <input
                ref={(el) => (inputRef.current = el)}
                type="search"
                aria-controls={listId}
                value={p.value}
                defaultValue={p.value}
                onInput={(e) => p.onChange?.(e.currentTarget.value)}
                aria-label={p.label}
                placeholder={p.placeholder}
                autocomplete="off"
            />
            <div
                ref={(el) => (listRef.current = el)}
                id={listId}
                role="listbox"
                aria-label={p.label}
            >
                {p.children}
            </div>
        </div>
    );
}
