// ProcedureRecordListItem: one procedure in a procedure record list, with its status and when it was performed (tasks.md P28-T3, spec/healthcare-ui). Props: ProcedureRecordListItem.md.
import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
import { attr } from "./attr";
import { warnMissingProp } from "./dev-warning";

export interface ProcedureRecordListItemProps {
    class?: string;
    /** whose record it is, when it is not the patient's ("Mother", "Fetus 1"); shown first */
    subjectLabel?: string;
    /** the procedure; never truncated */
    procedure: string;
    /** FHIR Procedure status */
    status?:
        | "preparation"
        | "in-progress"
        | "not-done"
        | "on-hold"
        | "stopped"
        | "completed"
        | "entered-in-error"
        | "unknown";
    statusLabel?: string;
    /** when it was performed, for <time datetime> */
    performed?: string;
    performedLabel?: string;
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function ProcedureRecordListItem(props: ProcedureRecordListItemProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(
        p,
        "class",
        "subjectLabel",
        "procedure",
        "status",
        "statusLabel",
        "performed",
        "performedLabel",
        "children",
    );
    if (p.status)
        warnMissingProp(
            "ProcedureRecordListItem",
            "statusLabel",
            p.statusLabel,
            "a status needs words a person can read, never a code alone.",
        );
    return (
        <li
            class={`procedure-record-list-item ${p.class}`}
            data-status={attr(p.status)}
            {...restProps}
        >
            {p.subjectLabel ? (
                <>
                    <span class="procedure-record-list-item-subject">{p.subjectLabel}</span>{" "}
                </>
            ) : null}
            <span class="procedure-record-list-item-procedure">{p.procedure}</span>
            {p.statusLabel ? (
                <>
                    {" "}
                    <span class="procedure-record-list-item-status">{p.statusLabel}</span>
                </>
            ) : null}
            {p.performedLabel ? (
                <>
                    {" "}
                    <time
                        class="procedure-record-list-item-performed"
                        datetime={p.performed}
                    >
                        {p.performedLabel}
                    </time>
                </>
            ) : null}
            {p.children}
        </li>
    );
}
