// AccordionListItem component
//
// A single expandable section within an AccordionList, using the native
// HTML <details> element for built-in disclosure behavior, inside an <li>. The consumer
// provides a <summary> element (the clickable header) and content (the
// expandable body) as children. The open prop is two-way bindable via
// controlled, allowing parent components to programmatically control
// and observe the expanded state.
//
// Props:
//   class — string, optional. CSS class name.
//   open — boolean, default false, bindable. Whether the item is expanded.
//   children — ReactNode, required. A <summary> and content elements.
//   ...restProps — additional HTML attributes spread onto the <li>.
//
// Syntax:
//   <AccordionListItem>
//     <summary>Header</summary>
//     <p>Content</p>
//   </AccordionListItem>
//
// Examples:
//
//   <AccordionListItem>
//     <summary>What is React?</summary>
//     <p>A compiler-based UI framework.</p>
//   </AccordionListItem>
//
//
//   <AccordionListItem open={isOpen} onChange={setIsOpen}>
//     <summary>Details</summary>
//     <p>Expanded content.</p>
//   </AccordionListItem>
//
// Keyboard:
//   - Tab: Focus the summary element
//   - Enter / Space: Toggle open/close (browser native behavior)
//
// Accessibility:
//   - Native <details> provides implicit disclosure widget semantics
//   - Browser automatically manages expanded/collapsed state announcement
//
// Internationalization:
//   - No hardcoded text; all content comes through children
//
// Claude rules:
//   - Compound component — use inside AccordionList
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Do not replace native <details> with custom ARIA widgets
//   - The open prop must use controlled for two-way binding
//
// References:
//   - HTML details element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details

import type { JSX } from "@solidjs/web";
import { omit, createSignal, untrack } from "solid-js";
import { withDefaults } from "./defaults";
export interface AccordionListItemProps {
    class?: string;
    /** Whether expanded. Bindable. */
    open?: boolean;
    /** A <summary> and content elements. */
    children: JSX.Element;
    /** Callback when open changes. */
    onChange?: (value: boolean) => void;
    [key: string]: unknown;
}

export default function AccordionListItem(props: AccordionListItemProps) {
    const p = withDefaults({ class: "" as const, open: false }, props);
    const restProps = omit(p, "class", "open", "onChange", "children");
    const [open, setOpen] = createSignal(untrack(() => p.open));

    const handleToggle = (e: Event & { currentTarget: HTMLDetailsElement }) => {
        const newOpen = (e.currentTarget as HTMLDetailsElement).open;
        setOpen(newOpen);
        p.onChange?.(newOpen);
    };

    return (
        <li
            class={`accordion-list-item ${p.class}`}
            {...restProps}
        >
            <details
                open={open()}
                onToggle={handleToggle}
            >
                {p.children}
            </details>
        </li>
    );
}
