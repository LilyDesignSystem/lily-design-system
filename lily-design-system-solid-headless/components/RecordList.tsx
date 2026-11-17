// RecordList: a list of records from one section of a patient's record, whose status is never blank (tasks.md P28-T3, spec/healthcare-ui).
// For any status but "known", statusLabel is the list's one item. Props and rules: RecordList.md.
import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
import { attr } from "./attr";
import { warnMissingProp } from "./dev-warning";

export interface RecordListProps {
    /** What this list is a view of, in the consumer's words: its window and order, what it leaves out and why, and which sources did not answer. Rendered first, as an item of its own (spec/lessons/zoblocks). */
    coverageLabel?: string;
    class?: string;
    status: "known" | "none-known" | "not-recorded" | "unavailable" | "omitted" | "not-applicable";
    /** The consumer's words for the status; names the list, and is its one item unless status is "known". */
    statusLabel: string;
    /** The accessible name, when it should differ from statusLabel. */
    label?: string;
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function RecordList(props: RecordListProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(
        p,
        "class",
        "status",
        "statusLabel",
        "label",
        "coverageLabel",
        "children",
    );
    warnMissingProp(
        "RecordList",
        "status",
        p.status,
        "A record list must say whether records are known, none known, not recorded, unavailable, omitted or not applicable.",
    );
    warnMissingProp(
        "RecordList",
        "statusLabel",
        p.statusLabel,
        "The status needs words a person can read.",
    );
    return (
        <ul
            class={`record-list ${p.class}`}
            data-status={attr(p.status)}
            aria-label={p.label ?? p.statusLabel}
            {...restProps}
        >
            {p.coverageLabel ? <li class="record-list-coverage">{p.coverageLabel}</li> : null}
            {p.status !== "known" ? <li class="record-list-status">{p.statusLabel}</li> : null}
            {p.children}
        </ul>
    );
}
