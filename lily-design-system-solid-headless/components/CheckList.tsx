// CheckList component
//
// A headless semantic list container for CheckList items. Renders a <ul> with
// role="list" for tracking and managing tasks, options, or steps. Consumers
// provide <li> children with checkboxes or other interactive controls. Commonly
// used in to-do lists, onboarding flows, forms, and progress tracking interfaces.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, optional. Accessible name for the CheckList via aria-label.
//   children — ReactNode, required. List items to render inside the <ul>.
//   ...restProps — additional HTML attributes spread onto the <ul>.
//
// Syntax:
//   <CheckList label="Tasks">
//     <CheckListItem>Task one</CheckListItem>
//   </CheckList>
//
// Examples:
//
//   <CheckList label="Onboarding tasks">
//     <CheckListItem checked>Create account</CheckListItem>
//     <CheckListItem>Set up profile</CheckListItem>
//     <CheckListItem>Invite team members</CheckListItem>
//   </CheckList>
//
// Keyboard:
//   None — this is a passive container. Keyboard interactions are determined
//   by the consumer-provided child elements (e.g., checkboxes respond to Space).
//
// Accessibility:
//   - role="list" ensures assistive technologies treat it as a list
//   - aria-label provides an optional accessible name for the CheckList
//
// Internationalization:
//   - Label text comes through the label prop; no hardcoded strings
//   - Item content is provided by the consumer
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Compound component: parent container for CheckListItem children
//
// References:
//   - WAI-ARIA Listbox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface CheckListProps {
    class?: string;
    label?: string;
    children: JSX.Element;
    [key: string]: unknown;
}

export default function CheckList(props: CheckListProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    return (
        <ol
            class={`check-list ${p.class}`}
            role="list"
            aria-label={p.label}
            {...restProps}
        >
            {p.children}
        </ol>
    );
}
