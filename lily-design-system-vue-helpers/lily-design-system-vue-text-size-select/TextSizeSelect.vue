<script lang="ts">
/** Arguments passed to the default scoped slot. */
export type SlotArgs = {
    /** The size slugs to render as `<option>` elements. */
    sizes: string[];
    /** Currently selected size slug. */
    value: string;
    /** Apply a size imperatively (also updates `v-model:value`). */
    setSize: (size: string) => void;
    /** `name` attribute of the `<select>`. */
    name: string;
    /** Resolve a slug to its display label. */
    labelFor: (size: string) => string;
};

/** Public props for TextSizeSelect. See `spec.md` §4 for the contract. */
export type Props = {
    /** Accessible label for the `<select>`. */
    label: string;
    /** Available size slugs, e.g. ["small","medium","large","x-large"]. */
    sizes: string[];
    /** Currently selected size slug. Two-way bindable via v-model:value. */
    value?: string;
    /** Initial size when nothing else is supplied. */
    defaultValue?: string;
    /** If set, persist the selection to localStorage under this key. */
    storageKey?: string;
    /** `name` attribute of the `<select>`. */
    name?: string;
    /** Element that receives `data-text-size`. Defaults to document.documentElement. */
    target?: HTMLElement | null;
    /** Optional pretty labels per slug. */
    sizeLabels?: Record<string, string>;
    /** Extra CSS class on the `<select>` root. */
    class?: string;
};
</script>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

const props = withDefaults(defineProps<Props>(), {
    value: "",
    defaultValue: undefined,
    storageKey: undefined,
    name: "text-size",
    target: undefined,
    sizeLabels: () => ({}),
    class: "",
});

const emit = defineEmits<{
    (event: "update:value", value: string): void;
    (event: "change", value: string): void;
}>();

function labelFor(size: string): string {
    const overrides = props.sizeLabels ?? {};
    if (size in overrides) return overrides[size];
    // Title-case each hyphen-separated word so a slug like
    // "x-large" renders as "X Large".
    return size
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function applySize(slug: string): void {
    if (typeof document === "undefined" || !slug) return;
    const root = props.target ?? document.documentElement;
    root.setAttribute("data-text-size", slug);
    if (props.storageKey) {
        try {
            localStorage.setItem(props.storageKey, slug);
        } catch {
            // ignore quota / privacy errors
        }
    }
    emit("change", slug);
}

// Internal source of truth so the picker works both controlled
// (consumer drives `v-model:value`) and uncontrolled (no binding —
// the picker resolves and applies a default itself, per spec §5).
const current = ref(props.value ?? "");

function setSize(slug: string): void {
    current.value = slug;
    emit("update:value", slug);
}

// Mirror an externally-controlled `value` into internal state.
watch(
    () => props.value,
    (next) => {
        if (next !== undefined && next !== current.value) current.value = next;
    },
);

// Apply whenever the resolved value changes.
watch(current, (next, prev) => {
    if (next && next !== prev) applySize(next);
});

onMounted(() => {
    let initial = current.value;

    if (!initial && props.storageKey) {
        try {
            initial = localStorage.getItem(props.storageKey) ?? "";
        } catch {
            // ignore privacy errors
        }
    }

    if (!initial) {
        initial =
            props.defaultValue ??
            (props.sizes.includes("medium") ? "medium" : props.sizes[0]) ??
            "";
    }

    if (initial && initial !== current.value) {
        current.value = initial;
        emit("update:value", initial);
        return;
    }
    if (initial) applySize(initial);
});

function onSelectChange(e: Event) {
    const next = (e.target as HTMLSelectElement).value;
    setSize(next);
}
</script>

<template>
    <select
        :class="`text-size-select ${props.class}`.trim()"
        :aria-label="label"
        :name="name"
        :value="current"
        @change="onSelectChange"
    >
        <slot v-bind="{ sizes, value: current, setSize, name, labelFor }">
            <option
                v-for="size in sizes"
                :key="size"
                class="text-size-select-option"
                :value="size"
            >{{ labelFor(size) }}</option>
        </slot>
    </select>
</template>
