// Whether a record list that says "none known" holds an entry, and so what it shows (HC-C17, tasks.md P50-T2). The entries are read
// from the page and watched. Internal: shared by the seven record lists.
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type Ref } from "react";
import { warnMissingProp } from "./dev-warning";
import { recordListState, watchEntries, type RecordListState } from "./record-list-state";

// A layout effect, so the words are right before the first paint. React 18 warns about one on a server, where nothing is painted.
const useBeforePaint = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function useRecordList(
    component: string,
    base: string,
    given: {
        status: string | undefined;
        statusLabel: string | undefined;
        conflictLabel?: string;
        label?: string;
    },
    forwarded: unknown,
): RecordListState & { ref: Ref<HTMLUListElement> } {
    const list = useRef<HTMLUListElement | null>(null);
    const [entries, setEntries] = useState(false);
    const { status, conflictLabel } = given;

    useBeforePaint(() => {
        if (status !== "none-known" || !list.current) {
            setEntries(false);
            return;
        }
        return watchEntries(list.current, base, setEntries);
    }, [status, base]);

    const state = recordListState(given, entries);
    useEffect(() => {
        if (state.conflict)
            warnMissingProp(
                component,
                "conflictLabel",
                conflictLabel,
                "It says none are known and holds an entry: only the entry is shown until you say so in words.",
            );
    }, [state.conflict, component, conflictLabel]);

    // A consumer's own ref still gets the list.
    const ref = useCallback(
        (element: HTMLUListElement | null) => {
            list.current = element;
            if (typeof forwarded === "function") forwarded(element);
            else if (forwarded && typeof forwarded === "object")
                (forwarded as { current: unknown }).current = element;
        },
        [forwarded],
    );
    return { ...state, ref };
}
