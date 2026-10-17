<script setup lang="ts">
import { inject } from "vue";
import { changeField, changeOperator, fieldType, operatorsFor, valueArity, type FilterField, type FilterGroup, type FilterOperator, type FilterRule } from "./filter-model";
import { FILTER_CONTEXT, parseTyped, textOf } from "./filter-context";

defineProps<{ group: FilterGroup; depth: number; parentId: string | null }>();

const ctx = inject(FILTER_CONTEXT)!;

function toggleOption(rule: FilterRule, optionId: string, checked: boolean): void {
    const current = Array.isArray(rule.value) ? (rule.value as string[]) : [];
    const next = checked ? [...current.filter((v) => v !== optionId), optionId] : current.filter((v) => v !== optionId);
    ctx.setRule(rule.id, (r) => ({ ...r, value: next.length ? next : undefined }));
}

const inputType = (field: FilterField) => (fieldType(field) === "number" ? "number" : fieldType(field) === "date" ? "date" : "text");
const target = (e: Event) => (e.target as HTMLInputElement | HTMLSelectElement);
</script>

<template>
    <div class="filter-group" role="group" :aria-label="ctx.labels().group(depth)" :data-depth="depth" :data-group-id="group.id">
        <div class="filter-group-header">
            <select
                class="filter-combinator"
                :aria-label="ctx.labels().combinator"
                :disabled="ctx.readonly()"
                :value="group.combinator"
                @change="ctx.setGroup(group.id, (g) => ({ ...g, combinator: target($event).value === 'or' ? 'or' : 'and' }))"
            >
                <option value="and">{{ ctx.labels().and }}</option>
                <option value="or">{{ ctx.labels().or }}</option>
            </select>
            <label class="filter-not">
                <input
                    type="checkbox"
                    :disabled="ctx.readonly()"
                    :checked="!!group.not"
                    @change="ctx.setGroup(group.id, (g) => ({ ...g, not: (target($event) as HTMLInputElement).checked || undefined }))"
                />
                {{ ctx.labels().not }}
            </label>
            <button v-if="parentId !== null && !ctx.readonly()" type="button" class="filter-remove-group-button" @click="ctx.removeGroup(group, parentId, depth)">{{ ctx.labels().removeGroup(depth) }}</button>
        </div>
        <p v-if="group.children.length === 0 && ctx.labels().empty" class="filter-empty">{{ ctx.labels().empty }}</p>
        <ul class="filter-rules">
            <li v-for="child in group.children" :key="child.id" class="filter-item">
                <FilterGroupView v-if="child.type === 'group'" :group="child" :depth="depth + 1" :parent-id="group.id" />
                <div v-else class="filter-rule" role="group" :aria-label="ctx.labels().rule(ctx.ruleNumbers().get(child.id) ?? 0)" :data-rule-id="child.id">
                    <select
                        class="filter-field"
                        :data-filter-field="child.id"
                        :aria-label="ctx.labels().field"
                        :disabled="ctx.readonly()"
                        :value="child.field"
                        @change="ctx.setRule(child.id, (r) => changeField(r, ctx.fields(), target($event).value))"
                    >
                        <option v-for="f in ctx.fields()" :key="f.id" :value="f.id">{{ f.label }}</option>
                    </select>
                    <template v-if="ctx.fieldById().get(child.field)">
                        <select
                            class="filter-operator"
                            :aria-label="ctx.labels().operator"
                            :disabled="ctx.readonly()"
                            :value="child.operator"
                            @change="ctx.setRule(child.id, (r) => changeOperator(r, target($event).value as FilterOperator))"
                        >
                            <option v-for="op in operatorsFor(ctx.fieldById().get(child.field))" :key="op" :value="op">{{ ctx.labels().operatorName(op, ctx.fieldById().get(child.field)!) }}</option>
                        </select>
                        <template v-if="valueArity(child.operator) === 1 || valueArity(child.operator) === 2">
                            <select
                                v-if="fieldType(ctx.fieldById().get(child.field)) === 'select'"
                                class="filter-value"
                                :aria-label="ctx.labels().value"
                                :disabled="ctx.readonly()"
                                :value="textOf(child.value)"
                                @change="ctx.setRule(child.id, (r) => ({ ...r, value: parseTyped('text', target($event).value) }))"
                            >
                                <option value="">{{ ctx.labels().choose ?? "" }}</option>
                                <option v-for="option in ctx.fieldById().get(child.field)!.options ?? []" :key="option.id" :value="option.id">{{ option.label }}</option>
                            </select>
                            <template v-else>
                                <input
                                    class="filter-value"
                                    :type="inputType(ctx.fieldById().get(child.field)!)"
                                    :inputmode="fieldType(ctx.fieldById().get(child.field)) === 'number' ? 'decimal' : undefined"
                                    :aria-label="valueArity(child.operator) === 2 ? ctx.labels().valueFrom : ctx.labels().value"
                                    :readonly="ctx.readonly()"
                                    :value="textOf(child.value)"
                                    @input="ctx.setRule(child.id, (r) => ({ ...r, value: parseTyped(fieldType(ctx.fieldById().get(child.field)), target($event).value) }))"
                                />
                                <input
                                    v-if="valueArity(child.operator) === 2"
                                    class="filter-value filter-value-to"
                                    :type="inputType(ctx.fieldById().get(child.field)!)"
                                    :inputmode="fieldType(ctx.fieldById().get(child.field)) === 'number' ? 'decimal' : undefined"
                                    :aria-label="ctx.labels().valueTo"
                                    :readonly="ctx.readonly()"
                                    :value="textOf(child.value2)"
                                    @input="ctx.setRule(child.id, (r) => ({ ...r, value2: parseTyped(fieldType(ctx.fieldById().get(child.field)), target($event).value) }))"
                                />
                            </template>
                        </template>
                        <div v-else-if="valueArity(child.operator) === 'many'" class="filter-choices" role="group" :aria-label="ctx.labels().value">
                            <label v-for="option in ctx.fieldById().get(child.field)!.options ?? []" :key="option.id" class="filter-choice">
                                <input
                                    type="checkbox"
                                    :disabled="ctx.readonly()"
                                    :checked="Array.isArray(child.value) && child.value.includes(option.id)"
                                    @change="toggleOption(child, option.id, (target($event) as HTMLInputElement).checked)"
                                />
                                {{ option.label }}
                            </label>
                        </div>
                    </template>
                    <button v-if="!ctx.readonly()" type="button" class="filter-remove-rule-button" @click="ctx.removeRule(child, group.id)">{{ ctx.labels().removeRule(ctx.ruleNumbers().get(child.id) ?? 0) }}</button>
                </div>
            </li>
        </ul>
        <div v-if="!ctx.readonly()" class="filter-group-actions">
            <button type="button" class="filter-add-rule-button" :data-filter-add-rule="group.id" @click="ctx.addRule(group.id)">{{ ctx.labels().addRule }}</button>
            <button v-if="depth < ctx.maxDepth()" type="button" class="filter-add-group-button" @click="ctx.addGroup(group.id, depth)">{{ ctx.labels().addGroup }}</button>
        </div>
    </div>
</template>
