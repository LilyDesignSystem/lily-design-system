// AllergyRecordList: a list of a patient's allergies and intolerances, whose status is never blank (tasks.md P28-T3, spec/healthcare-ui).
// For any status but "known", statusLabel is the list's one item. Props and rules: AllergyRecordList.md.
import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
import { warnMissingProp } from "./dev-warning";
import { useRecordList } from "./use-record-list";

export interface AllergyRecordListProps {
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

export default function AllergyRecordList(props: AllergyRecordListProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(
        p,
        "class",
        "status",
        "statusLabel",
        "label",
        "conflictLabel",
        "children",
    );
    warnMissingProp(
        "AllergyRecordList",
        "status",
        p.status,
        "A allergy record list must say whether allergies are known, none known, not recorded, unavailable, omitted or not applicable.",
    );
    warnMissingProp(
        "AllergyRecordList",
        "statusLabel",
        p.statusLabel,
        "The status needs words a person can read.",
    );
    const list = useRecordList("AllergyRecordList", "allergy-record-list", p);
    return (
        <ul
            class={`allergy-record-list ${p.class}`}
            ref={list.ref}
            data-status={attr(list.shown().status)}
            aria-label={list.shown().name}
            {...restProps}
        >
            {list.shown().showItem ? (
                <li class="allergy-record-list-status">{list.shown().words}</li>
            ) : null}
            {p.children}
        </ul>
    );
}
