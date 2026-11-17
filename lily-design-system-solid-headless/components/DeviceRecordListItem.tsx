// DeviceRecordListItem: one medical device in a device record list, with its status and when it was used (tasks.md P28-T3, spec/healthcare-ui). Props: DeviceRecordListItem.md.
import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
import { attr } from "./attr";
import { warnMissingProp } from "./dev-warning";

export interface DeviceRecordListItemProps {
    class?: string;
    /** whose record it is, when it is not the patient's ("Mother", "Fetus 1"); shown first */
    subjectLabel?: string;
    /** the device; never truncated */
    device: string;
    /** FHIR DeviceUseStatement status */
    status?: "active" | "completed" | "entered-in-error" | "intended" | "stopped" | "on-hold";
    statusLabel?: string;
    /** when it was used, for <time datetime> */
    timing?: string;
    timingLabel?: string;
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function DeviceRecordListItem(props: DeviceRecordListItemProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(
        p,
        "class",
        "subjectLabel",
        "device",
        "status",
        "statusLabel",
        "timing",
        "timingLabel",
        "children",
    );
    if (p.status)
        warnMissingProp(
            "DeviceRecordListItem",
            "statusLabel",
            p.statusLabel,
            "a status needs words a person can read, never a code alone.",
        );
    return (
        <li
            class={`device-record-list-item ${p.class}`}
            data-status={attr(p.status)}
            {...restProps}
        >
            {p.subjectLabel ? (
                <>
                    <span class="device-record-list-item-subject">{p.subjectLabel}</span>{" "}
                </>
            ) : null}
            <span class="device-record-list-item-device">{p.device}</span>
            {p.statusLabel ? (
                <>
                    {" "}
                    <span class="device-record-list-item-status">{p.statusLabel}</span>
                </>
            ) : null}
            {p.timingLabel ? (
                <>
                    {" "}
                    <time
                        class="device-record-list-item-timing"
                        datetime={p.timing}
                    >
                        {p.timingLabel}
                    </time>
                </>
            ) : null}
            {p.children}
        </li>
    );
}
