// MedicationRecordListItem: one medicine in a medication record list, with its status and when it applies (tasks.md P28-T3, spec/healthcare-ui). Props: MedicationRecordListItem.md.
import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
import { attr } from "./attr";
import { warnMissingProp } from "./dev-warning";

export interface MedicationRecordListItemProps {
    class?: string;
    /** whose record it is, when it is not the patient's ("Mother", "Fetus 1"); shown first */
    subjectLabel?: string;
    /** FHIR MedicationStatement status */
    status?:
        | "active"
        | "completed"
        | "entered-in-error"
        | "intended"
        | "stopped"
        | "on-hold"
        | "unknown"
        | "not-taken";
    statusLabel?: string;
    /** when the medicine applies, for <time datetime> */
    effective?: string;
    effectiveLabel?: string;
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function MedicationRecordListItem(props: MedicationRecordListItemProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(
        p,
        "class",
        "subjectLabel",
        "status",
        "statusLabel",
        "effective",
        "effectiveLabel",
        "children",
    );
    if (p.status)
        warnMissingProp(
            "MedicationRecordListItem",
            "statusLabel",
            p.statusLabel,
            "a status needs words a person can read, never a code alone.",
        );
    return (
        <li
            class={`medication-record-list-item ${p.class}`}
            data-status={attr(p.status)}
            {...restProps}
        >
            {p.subjectLabel ? (
                <>
                    <span class="medication-record-list-item-subject">{p.subjectLabel}</span>{" "}
                </>
            ) : null}
            {p.children}
            {p.statusLabel ? (
                <>
                    {" "}
                    <span class="medication-record-list-item-status">{p.statusLabel}</span>
                </>
            ) : null}
            {p.effectiveLabel ? (
                <>
                    {" "}
                    <time
                        class="medication-record-list-item-effective"
                        datetime={p.effective}
                    >
                        {p.effectiveLabel}
                    </time>
                </>
            ) : null}
        </li>
    );
}
