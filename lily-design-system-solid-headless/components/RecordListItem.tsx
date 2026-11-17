// RecordListItem: one record in a record list, with its status and last update around the consumer's content (tasks.md P28-T3, spec/healthcare-ui). Props: RecordListItem.md.
import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
import { warnMissingProp } from "./dev-warning";

export interface RecordListItemProps {
    class?: string;
    /** whose record it is, when it is not the patient's ("Mother", "Fetus 1"); shown first */
    subjectLabel?: string;
    /** withheld: content not shown, only the words; entered-in-error: content kept in a <del>, with the words. data-entry-state */
    entryState?: "withheld" | "entered-in-error";
    /** That state in the consumer's words; required with entryState. */
    entryStateLabel?: string;
    /** the record's status, as the consumer's code */
    status?: string;
    statusLabel?: string;
    /** when the record was last updated */
    updated?: string;
    updatedLabel?: string;
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function RecordListItem(props: RecordListItemProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(
        p,
        "class",
        "subjectLabel",
        "entryState",
        "entryStateLabel",
        "status",
        "statusLabel",
        "updated",
        "updatedLabel",
        "children",
    );
    if (p.status)
        warnMissingProp(
            "RecordListItem",
            "statusLabel",
            p.statusLabel,
            "a status needs words a person can read, never a code alone.",
        );
    if (p.entryState)
        warnMissingProp(
            "RecordListItem",
            "entryStateLabel",
            p.entryStateLabel,
            "a withheld or in-error entry must say so in words.",
        );
    return (
        <li
            class={`record-list-item ${p.class}`}
            data-status={attr(p.status)}
            data-entry-state={attr(p.entryState)}
            {...restProps}
        >
            {p.subjectLabel ? (
                <>
                    <span class="record-list-item-subject">{p.subjectLabel}</span>{" "}
                </>
            ) : null}
            {p.entryState === "withheld" ? (
                <span class="record-list-item-entry-state">{p.entryStateLabel}</span>
            ) : p.entryState === "entered-in-error" ? (
                <>
                    <del class="record-list-item-entry">{p.children}</del>{" "}
                    <span class="record-list-item-entry-state">{p.entryStateLabel}</span>
                </>
            ) : (
                p.children
            )}
            {p.statusLabel ? (
                <>
                    {" "}
                    <span class="record-list-item-status">{p.statusLabel}</span>
                </>
            ) : null}
            {p.updatedLabel ? (
                <>
                    {" "}
                    <time
                        class="record-list-item-updated"
                        datetime={p.updated}
                    >
                        {p.updatedLabel}
                    </time>
                </>
            ) : null}
        </li>
    );
}
