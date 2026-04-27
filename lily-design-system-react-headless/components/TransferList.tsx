// TransferList component
//
// A dual list box for moving items between two lists. The component is a
// `role="group"` container with two `<section>` regions (source and target)
// and an optional actions slot between them. The consumer supplies the
// actual list contents and the move-buttons.
//
// Props:
//   className    — string, optional. CSS class name.
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

import React from "react";

export interface TransferListProps {
    className?: string;
    /** aria-label for the group (required) */
    label: string;
    /** aria-label for the source section (required) */
    sourceLabel: string;
    /** aria-label for the target section (required) */
    targetLabel: string;
    /** Source list content (required) */
    source: React.ReactNode;
    /** Target list content (required) */
    target: React.ReactNode;
    /** Action buttons between the two lists (optional) */
    actions?: React.ReactNode;
    [key: string]: unknown;
}

export default function TransferList({
    className = "",
    label,
    sourceLabel,
    targetLabel,
    source,
    target,
    actions = undefined,
    ...restProps
}: TransferListProps) {
    return (
        <div
            className={`transfer-list ${className}`}
            role="group"
            aria-label={label}
            {...restProps}
        >
            <section className="transfer-list-source" aria-label={sourceLabel}>
                {source}
            </section>
            {actions !== undefined && actions !== null ? (
                <div className="transfer-list-actions">{actions}</div>
            ) : null}
            <section className="transfer-list-target" aria-label={targetLabel}>
                {target}
            </section>
        </div>
    );
}
