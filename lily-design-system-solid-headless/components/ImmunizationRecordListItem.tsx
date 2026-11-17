// ImmunizationRecordListItem: one immunization in an immunization record list, with vaccine, date, dose and status (tasks.md P28-T3, spec/healthcare-ui). Props: ImmunizationRecordListItem.md.
import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
import { warnMissingProp } from "./dev-warning";

export interface ImmunizationRecordListItemProps {
    class?: string;
    /** whose record it is, when it is not the patient's ("Mother", "Fetus 1"); shown first */
    subjectLabel?: string;
    /** the vaccine given; never truncated */
    vaccine: string;
    /** when it was given, for <time datetime> */
    occurrence?: string;
    occurrenceLabel?: string;
    /** the dose in words ("Dose 2 of 2") */
    doseNumberLabel?: string;
    /** FHIR Immunization status */
    status?: "completed" | "entered-in-error" | "not-done";
    statusLabel?: string;
    /** the vaccine's lot number */
    lotNumber?: string;
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function ImmunizationRecordListItem(props: ImmunizationRecordListItemProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(
        p,
        "class",
        "subjectLabel",
        "vaccine",
        "occurrence",
        "occurrenceLabel",
        "doseNumberLabel",
        "status",
        "statusLabel",
        "lotNumber",
        "children",
    );
    if (p.status)
        warnMissingProp(
            "ImmunizationRecordListItem",
            "statusLabel",
            p.statusLabel,
            "a status needs words a person can read, never a code alone.",
        );
    return (
        <li
            class={`immunization-record-list-item ${p.class}`}
            data-status={attr(p.status)}
            {...restProps}
        >
            {p.subjectLabel ? (
                <>
                    <span class="immunization-record-list-item-subject">{p.subjectLabel}</span>{" "}
                </>
            ) : null}
            <span class="immunization-record-list-item-vaccine">{p.vaccine}</span>
            {p.occurrenceLabel ? (
                <>
                    {" "}
                    <time
                        class="immunization-record-list-item-occurrence"
                        datetime={p.occurrence}
                    >
                        {p.occurrenceLabel}
                    </time>
                </>
            ) : null}
            {p.doseNumberLabel ? (
                <>
                    {" "}
                    <span class="immunization-record-list-item-dose-number">
                        {p.doseNumberLabel}
                    </span>
                </>
            ) : null}
            {p.statusLabel ? (
                <>
                    {" "}
                    <span class="immunization-record-list-item-status">{p.statusLabel}</span>
                </>
            ) : null}
            {p.lotNumber ? (
                <>
                    {" "}
                    <span class="immunization-record-list-item-lot-number">{p.lotNumber}</span>
                </>
            ) : null}
            {p.children}
        </li>
    );
}
