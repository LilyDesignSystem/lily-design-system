// Whether a record list that says "none known" holds an entry, and so what it shows (HC-C17, tasks.md P50-T2). The entries are read
// from the page and watched. Internal: shared by the seven record lists.
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { warnMissingProp } from "./dev-warning";
import { recordListState, watchEntries } from "./record-list-state";

export function useRecordList(
    component: string,
    base: string,
    props: { status: string; statusLabel: string; conflictLabel?: string; label?: string },
) {
    const list = ref<HTMLUListElement | null>(null);
    const entries = ref(false);
    let stop = () => {};

    function start() {
        stop();
        stop = () => {};
        if (props.status === "none-known" && list.value)
            stop = watchEntries(list.value, base, (found) => (entries.value = found));
        else entries.value = false;
    }
    onMounted(start);
    watch(() => props.status, start, { flush: "post" });
    onBeforeUnmount(() => stop());

    const shown = computed(() => recordListState(props, entries.value));
    watch(
        () => shown.value.conflict,
        (conflict) => {
            if (conflict)
                warnMissingProp(
                    component,
                    "conflictLabel",
                    props.conflictLabel,
                    "It says none are known and holds an entry: only the entry is shown until you say so in words.",
                );
        },
        { immediate: true },
    );
    return { list, shown };
}
