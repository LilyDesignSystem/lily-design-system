// DeviceRecordListItem: one medical device in a device record list, with its status and when it was used (tasks.md P28-T3, spec/healthcare-ui). Props: DeviceRecordListItem.md.
import React from "react";
import { warnMissingProp } from "./dev-warning";

export interface DeviceRecordListItemProps {
    className?: string;
    /** the device; never truncated */
    device: string;
    /** FHIR DeviceUseStatement status */
    status?: "active" | "completed" | "entered-in-error" | "intended" | "stopped" | "on-hold";
    statusLabel?: string;
    /** when it was used, for <time datetime> */
    timing?: string;
    timingLabel?: string;
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function DeviceRecordListItem({
    className = "",
    device,
    status,
    statusLabel,
    timing,
    timingLabel,
    children,
    ...restProps
}: DeviceRecordListItemProps) {
    if (status)
        warnMissingProp(
            "DeviceRecordListItem",
            "statusLabel",
            statusLabel,
            "a status needs words a person can read, never a code alone.",
        );
    return (
        <li
            className={`device-record-list-item ${className}`}
            data-status={status}
            {...restProps}
        >
            <span className="device-record-list-item-device">{device}</span>
            {statusLabel ? (
                <>
                    {" "}
                    <span className="device-record-list-item-status">{statusLabel}</span>
                </>
            ) : null}
            {timingLabel ? (
                <>
                    {" "}
                    <time
                        className="device-record-list-item-timing"
                        dateTime={timing}
                    >
                        {timingLabel}
                    </time>
                </>
            ) : null}
            {children}
        </li>
    );
}
