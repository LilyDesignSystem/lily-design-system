// Whether a record list that says "none known" holds an entry, and so what it shows (HC-C17, tasks.md P50-T2). The entries are read
// from the page and watched. Internal: shared by the seven record lists.
import { createEffect, createSignal } from "solid-js";
import { warnMissingProp } from "./dev-warning";
import { recordListState, watchEntries } from "./record-list-state";

interface Given {
    status: string;
    statusLabel: string;
    conflictLabel?: string;
    label?: string;
}

export function useRecordList(component: string, base: string, given: Given) {
    let list: HTMLUListElement | undefined;
    const [entries, setEntries] = createSignal(false);

    createEffect(
        () => given.status,
        (status) => {
            if (status !== "none-known" || !list) {
                setEntries(false);
                return;
            }
            return watchEntries(list, base, (found) => setEntries(found));
        },
    );

    const shown = () =>
        recordListState(
            {
                status: given.status,
                statusLabel: given.statusLabel,
                conflictLabel: given.conflictLabel,
                label: given.label,
            },
            entries(),
        );
    createEffect(
        () => ({ conflict: shown().conflict, words: given.conflictLabel }),
        ({ conflict, words }) => {
            if (conflict)
                warnMissingProp(
                    component,
                    "conflictLabel",
                    words,
                    "It says none are known and holds an entry: only the entry is shown until you say so in words.",
                );
        },
    );
    return { shown, ref: (element: HTMLUListElement) => (list = element) };
}
