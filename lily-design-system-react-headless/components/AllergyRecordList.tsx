// AllergyRecordList: a list of a patient's allergies and intolerances, whose status is never blank (tasks.md P28-T3, spec/healthcare-ui).
// For any status but "known", statusLabel is the list's one item. Props and rules: AllergyRecordList.md.
import React from "react";
import { warnMissingProp } from "./dev-warning";

export interface AllergyRecordListProps {
    className?: string;
    status: "known" | "none-known" | "not-recorded" | "unavailable" | "omitted" | "not-applicable";
    /** The consumer's words for the status; names the list, and is its one item unless status is "known". */
    statusLabel: string;
    /** The accessible name, when it should differ from statusLabel. */
    label?: string;
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function AllergyRecordList({
    className = "",
    status,
    statusLabel,
    label,
    children,
    ...restProps
}: AllergyRecordListProps) {
    warnMissingProp(
        "AllergyRecordList",
        "status",
        status,
        "A allergy record list must say whether allergies are known, none known, not recorded, unavailable, omitted or not applicable.",
    );
    warnMissingProp(
        "AllergyRecordList",
        "statusLabel",
        statusLabel,
        "The status needs words a person can read.",
    );
    return (
        <ul
            className={`allergy-record-list ${className}`}
            data-status={status}
            aria-label={label ?? statusLabel}
            {...restProps}
        >
            {status !== "known" ? (
                <li className="allergy-record-list-status">{statusLabel}</li>
            ) : null}
            {children}
        </ul>
    );
}
