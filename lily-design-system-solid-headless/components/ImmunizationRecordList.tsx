// ImmunizationRecordList: a list of a patient's immunizations, whose status is never blank (tasks.md P28-T3, spec/healthcare-ui).
// For any status but "known", statusLabel is the list's one item. Props and rules: ImmunizationRecordList.md.
import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
import { attr } from "./attr";
import { warnMissingProp } from "./dev-warning";

export interface ImmunizationRecordListProps {
    class?: string;
    status: "known" | "none-known" | "not-recorded" | "unavailable" | "omitted" | "not-applicable";
    /** The consumer's words for the status; names the list, and is its one item unless status is "known". */
    statusLabel: string;
    /** The accessible name, when it should differ from statusLabel. */
    label?: string;
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function ImmunizationRecordList(props: ImmunizationRecordListProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "status", "statusLabel", "label", "children");
    warnMissingProp(
        "ImmunizationRecordList",
        "status",
        p.status,
        "A immunization record list must say whether immunizations are known, none known, not recorded, unavailable, omitted or not applicable.",
    );
    warnMissingProp(
        "ImmunizationRecordList",
        "statusLabel",
        p.statusLabel,
        "The status needs words a person can read.",
    );
    return (
        <ul
            class={`immunization-record-list ${p.class}`}
            data-status={attr(p.status)}
            aria-label={p.label ?? p.statusLabel}
            {...restProps}
        >
            {p.status !== "known" ? (
                <li class="immunization-record-list-status">{p.statusLabel}</li>
            ) : null}
            {p.children}
        </ul>
    );
}
