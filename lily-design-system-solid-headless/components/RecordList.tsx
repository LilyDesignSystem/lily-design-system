// RecordList: a list of records from one section of a patient's record, whose status is never blank (tasks.md P28-T3, spec/healthcare-ui).
// For any status but "known", statusLabel is the list's one item. Props and rules: RecordList.md.
import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
import { warnMissingProp } from "./dev-warning";
import { useRecordList } from "./use-record-list";

export interface RecordListProps {
    /** What this list is a view of, in the consumer's words: its window and order, what it leaves out and why, and which sources did not answer. Rendered first, as an item of its own (spec/lessons/zoblocks). */
    coverageLabel?: string;
    class?: string;
    status: "known" | "none-known" | "not-recorded" | "unavailable" | "omitted" | "not-applicable";
    /** The consumer's words for the status; names the list, and is its one item unless status is "known". */
    statusLabel: string;
    /** The accessible name, when it should differ from statusLabel. */
    label?: string;
    /** Your words for a list that says none are known and holds an entry, shown instead of `statusLabel`; it never says both. */
    conflictLabel?: string;
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function RecordList(props: RecordListProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(
        p,
        "class",
        "status",
        "statusLabel",
        "label",
        "conflictLabel",
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
    const list = useRecordList("RecordList", "record-list", p);
    return (
        <ul
            class={`record-list ${p.class}`}
            ref={list.ref}
            data-status={attr(list.shown().status)}
            aria-label={list.shown().name}
            {...restProps}
        >
            {p.coverageLabel ? <li class="record-list-coverage">{p.coverageLabel}</li> : null}
            {list.shown().showItem ? (
                <li class="record-list-status">{list.shown().words}</li>
            ) : null}
            {p.children}
        </ul>
    );
}
