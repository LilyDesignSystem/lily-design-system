<script lang="ts">
import type { FilterField, FilterGroup, FilterOutputFormat, SqlDialect } from "./filter-model";
import type { FilterLabels } from "./filter-context";

export type { FilterLabels } from "./filter-context";

export type Props = {
    /** Accessible name of the whole filter. */
    label: string;
    /** What can be filtered on. */
    fields: FilterField[];
    labels: FilterLabels;
    /** Show the filter written out in this format under the builder. Needs `labels.output`. */
    format?: FilterOutputFormat;
    /** SQL dialect for `format="sql"`. Default `ansi`. */
    dialect?: SqlDialect;
    /** The deepest group nesting offered (1 = no nested groups). Default 3. */
    maxDepth?: number;
    /** Show the filter without letting it be edited. */
    readonly?: boolean;
};
</script>

<script setup lang="ts">
import { computed, nextTick, provide, ref } from "vue";
import FilterGroupView from "./FilterGroupView.vue";
import { FILTER_CONTEXT } from "./filter-context";
import {
    EMPTY_FILTER, addNode, createGroup, createRule, formatFilter, removeNode, updateNode,
    type FilterRule,
} from "./filter-model";

const props = withDefaults(defineProps<Props>(), { format: undefined, dialect: "ansi", maxDepth: 3, readonly: false });

/** The filter. A v-model: bound by the parent with `v-model`, else kept locally. Every change is a new object, never a mutation. */
const value = defineModel<FilterGroup>({ default: () => EMPTY_FILTER() });

const emit = defineEmits<{ change: [group: FilterGroup] }>();

const status = ref("");
const rootEl = ref<HTMLDivElement | null>(null);

const fieldById = computed(() => new Map(props.fields.map((f) => [f.id, f])));
const output = computed(() => (props.format && props.labels.output ? formatFilter(value.value, props.fields, props.format, props.dialect) : ""));

/** The number the user sees for each rule: its place in reading order across the whole filter. */
function numberRules(root: FilterGroup): Map<string, number> {
    const numbers = new Map<string, number>();
    let n = 0;
    const walk = (g: FilterGroup) => {
        for (const child of g.children) {
            if (child.type === "rule") numbers.set(child.id, ++n);
            else walk(child);
        }
    };
    walk(root);
    return numbers;
}
const ruleNumbers = computed(() => numberRules(value.value));

function commit(next: FilterGroup): void {
    value.value = next;
    emit("change", next);
}

function announce(message: string | undefined): void {
    if (message) status.value = message;
}

async function focusSelector(selector: string): Promise<void> {
    await nextTick();
    rootEl.value?.querySelector<HTMLElement>(selector)?.focus();
}

provide(FILTER_CONTEXT, {
    fields: () => props.fields,
    labels: () => props.labels,
    readonly: () => props.readonly,
    maxDepth: () => props.maxDepth,
    fieldById: () => fieldById.value,
    ruleNumbers: () => ruleNumbers.value,
    setRule(id, change) {
        if (props.readonly) return;
        commit(updateNode(value.value, id, (node) => (node.type === "rule" ? change(node) : node)));
    },
    setGroup(id, change) {
        if (props.readonly) return;
        commit(updateNode(value.value, id, (node) => (node.type === "group" ? change(node) : node)));
    },
    addRule(groupId) {
        if (props.readonly || props.fields.length === 0) return;
        const rule = createRule(props.fields);
        const next = addNode(value.value, groupId, rule);
        commit(next);
        announce(props.labels.ruleAdded?.(numberRules(next).get(rule.id) ?? 0));
        void focusSelector(`[data-filter-field="${rule.id}"]`);
    },
    addGroup(parentId, depth) {
        if (props.readonly || depth >= props.maxDepth) return;
        const group = createGroup("and", props.fields.length ? [createRule(props.fields)] : []);
        commit(addNode(value.value, parentId, group));
        announce(props.labels.groupAdded?.(depth + 1));
        const first = group.children[0];
        if (first) void focusSelector(`[data-filter-field="${first.id}"]`);
    },
    removeRule(rule: FilterRule, groupId: string) {
        if (props.readonly) return;
        const n = ruleNumbers.value.get(rule.id) ?? 0;
        commit(removeNode(value.value, rule.id));
        announce(props.labels.ruleRemoved?.(n));
        void focusSelector(`[data-filter-add-rule="${groupId}"]`);
    },
    removeGroup(group, parentId, depth) {
        if (props.readonly) return;
        commit(removeNode(value.value, group.id));
        announce(props.labels.groupRemoved?.(depth));
        void focusSelector(`[data-filter-add-rule="${parentId}"]`);
    },
});
</script>

<template>
    <div ref="rootEl" class="filter" role="group" :aria-label="label" :data-readonly="readonly ? '' : undefined">
        <FilterGroupView :group="value" :depth="1" :parent-id="null" />
        <div v-if="format && labels.output" class="filter-output" role="group" :aria-label="labels.output" :data-format="format">
            <pre class="filter-output-text">{{ output }}</pre>
        </div>
        <p class="filter-status" aria-live="polite">{{ status }}</p>
    </div>
</template>
