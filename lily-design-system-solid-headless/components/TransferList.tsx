// TransferList component
//
// A dual list box for moving items between two lists. The component is a
// `role="group"` container with two `<section>` regions (source and target)
// and an optional actions slot between them. The consumer supplies the
// actual list contents and the move-buttons.
//
// Props:
//   class    — string, optional. CSS class name.
//   label        — string, REQUIRED. aria-label for the group.
//   sourceLabel  — string, REQUIRED. aria-label for the source section.
//   targetLabel  — string, REQUIRED. aria-label for the target section.
//   source       — ReactNode, REQUIRED. Source list content.
//   target       — ReactNode, REQUIRED. Target list content.
//   actions      — ReactNode, optional. Action buttons between the two lists.
//   ...restProps — additional HTML attributes spread onto the root <div>.
//
// Syntax:
//   <TransferList
//     label="Permissions"
//     sourceLabel="Available"
//     targetLabel="Selected"
//     source={<Listbox>…</Listbox>}
//     target={<Listbox>…</Listbox>}
//     actions={
//       <>
//         <button onClick={moveRight}>→</button>
//         <button onClick={moveLeft}>←</button>
//       </>
//     }
//   />
//
// Accessibility:
//   - role="group" on the root container
//   - Each list region is a <section> with its own aria-label
//
// Internationalization:
//   - All user-facing strings are consumer-supplied.
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - Required string and ReactNode props are non-optional in the interface
//   - Source/target/actions are named slots (NOT children)
//
// References:
//   - Ant Design Transfer: https://ant.design/components/transfer

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface TransferListProps {
    class?: string;
    /** aria-label for the group (required) */
    label: string;
    /** aria-label for the source section (required) */
    sourceLabel: string;
    /** aria-label for the target section (required) */
    targetLabel: string;
    /** Source list content (required) */
    source: JSX.Element;
    /** Target list content (required) */
    target: JSX.Element;
    /** Action buttons between the two lists (optional) */
    actions?: JSX.Element;
    [key: string]: unknown;
}

export default function TransferList(props: TransferListProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(
        p,
        "class",
        "label",
        "sourceLabel",
        "targetLabel",
        "source",
        "target",
        "actions",
    );
    return (
        <div
            class={`transfer-list ${p.class}`}
            role="group"
            aria-label={p.label}
            {...restProps}
        >
            <section
                class="transfer-list-source"
                aria-label={p.sourceLabel}
            >
                {p.source}
            </section>
            {p.actions !== undefined && p.actions !== null ? (
                <div class="transfer-list-actions">{p.actions}</div>
            ) : null}
            <section
                class="transfer-list-target"
                aria-label={p.targetLabel}
            >
                {p.target}
            </section>
        </div>
    );
}
