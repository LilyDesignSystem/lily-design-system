// DeviceRecordList: a list of a patient's medical devices, whose status is never blank (tasks.md P28-T3, spec/healthcare-ui).
// For any status but "known", statusLabel is the list's one item. Props and rules: DeviceRecordList.md.
import React from "react";
import { warnMissingProp } from "./dev-warning";

export interface DeviceRecordListProps {
    className?: string;
    status: "known" | "none-known" | "not-recorded" | "unavailable" | "omitted";
    /** The consumer's words for the status; names the list, and is its one item unless status is "known". */
    statusLabel: string;
    /** The accessible name, when it should differ from statusLabel. */
    label?: string;
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function DeviceRecordList({
    className = "",
    status,
    statusLabel,
    label,
    children,
    ...restProps
}: DeviceRecordListProps) {
    warnMissingProp(
        "DeviceRecordList",
        "status",
        status,
        "A device record list must say whether devices are known, none known, not recorded, unavailable or omitted.",
    );
    warnMissingProp(
        "DeviceRecordList",
        "statusLabel",
        statusLabel,
        "The status needs words a person can read.",
    );
    return (
        <ul
            className={`device-record-list ${className}`}
            data-status={status}
            aria-label={label ?? statusLabel}
            {...restProps}
        >
            {status !== "known" ? (
                <li className="device-record-list-status">{statusLabel}</li>
            ) : null}
            {children}
        </ul>
    );
}
