// AllergyList: a patient's allergies and intolerances, whose status is never blank (spec/healthcare-ui item 2).
// For any status but "known", statusLabel is the list's one item. Props and rules: AllergyList.md.
import React from "react";
import { warnMissingProp } from "./dev-warning";

export interface AllergyListProps {
    className?: string;
    status: "known" | "none-known" | "not-recorded" | "unavailable";
    /** The consumer's words for the status; names the list, and is its one item unless status is "known". */
    statusLabel: string;
    /** The accessible name, when it should differ from statusLabel. */
    label?: string;
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function AllergyList({
    className = "",
    status,
    statusLabel,
    label,
    children,
    ...restProps
}: AllergyListProps) {
    warnMissingProp(
        "AllergyList",
        "status",
        status,
        "An allergy list must say whether allergies are known, none known, not recorded or unavailable.",
    );
    warnMissingProp(
        "AllergyList",
        "statusLabel",
        statusLabel,
        "The status needs words a person can read.",
    );
    return (
        <ul
            className={`allergy-list ${className}`}
            data-status={status}
            aria-label={label ?? statusLabel}
            {...restProps}
        >
            {status !== "known" ? <li className="allergy-list-status">{statusLabel}</li> : null}
            {children}
        </ul>
    );
}
