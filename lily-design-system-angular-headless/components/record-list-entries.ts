import {
    DestroyRef,
    ElementRef,
    Signal,
    afterRenderEffect,
    computed,
    inject,
    signal,
} from "@angular/core";
import { warnMissingProp } from "./dev-warning";
import { RecordListState, recordListState, watchEntries } from "./record-list-state";

/**
 * Whether a record list that says "none known" holds an entry, and so what it shows (HC-C17, tasks.md P50-T2). The entries are read
 * from the page and watched. Internal: shared by the seven record lists. Call it in an injection context.
 */
export function recordListShown(
    component: string,
    base: string,
    list: Signal<ElementRef<HTMLElement> | undefined>,
    given: {
        status: Signal<string>;
        statusLabel: Signal<string>;
        conflictLabel: Signal<string>;
        label: Signal<string>;
    },
): Signal<RecordListState> {
    const entries = signal(false);
    const shown = computed(() =>
        recordListState(
            {
                status: given.status() || undefined,
                statusLabel: given.statusLabel(),
                conflictLabel: given.conflictLabel(),
                label: given.label() || undefined,
            },
            entries(),
        ),
    );
    let stop = () => {};
    inject(DestroyRef).onDestroy(() => stop());
    afterRenderEffect(() => {
        const element = list()?.nativeElement;
        const watching = given.status() === "none-known" && element;
        stop();
        stop = () => {};
        if (watching) stop = watchEntries(element, base, (found) => entries.set(found));
        else entries.set(false);
    });
    afterRenderEffect(() => {
        if (shown().conflict)
            warnMissingProp(
                component,
                "conflictLabel",
                given.conflictLabel(),
                "It says none are known and holds an entry: only the entry is shown until you say so in words.",
            );
    });
    return shown;
}
