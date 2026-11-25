// DeviceRecordList: a list of a patient's medical devices, whose status is never blank (tasks.md P28-T3, spec/healthcare-ui).
// For any status but "known", statusLabel is the list's one item. Props and rules: DeviceRecordList.md.
import React from "react";
import { warnMissingProp } from "./dev-warning";
import { useRecordList } from "./use-record-list";

export interface DeviceRecordListProps {
    className?: string;
    status: "known" | "none-known" | "not-recorded" | "unavailable" | "omitted" | "not-applicable";
    /** The consumer's words for the status; names the list, and is its one item unless status is "known". */
    statusLabel: string;
    /** The accessible name, when it should differ from statusLabel. */
    label?: string;
    /** Your words for a list that says none are known and holds an entry, shown instead of `statusLabel`; it never says both. */
    conflictLabel?: string;
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function DeviceRecordList({
    className = "",
    status,
    statusLabel,
    label,
    conflictLabel,
    children,
    ...restProps
}: DeviceRecordListProps) {
    warnMissingProp(
        "DeviceRecordList",
        "status",
        status,
        "A device record list must say whether devices are known, none known, not recorded, unavailable, omitted or not applicable.",
    );
    warnMissingProp(
        "DeviceRecordList",
        "statusLabel",
        statusLabel,
        "The status needs words a person can read.",
    );
    const shown = useRecordList(
        "DeviceRecordList",
        "device-record-list",
        { status, statusLabel, conflictLabel, label },
        restProps.ref,
    );
    return (
        <ul
            className={`device-record-list ${className}`}
            data-status={shown.status}
            aria-label={shown.name}
            {...restProps}
            ref={shown.ref}
        >
            {shown.showItem ? <li className="device-record-list-status">{shown.words}</li> : null}
            {children}
        </ul>
    );
}
