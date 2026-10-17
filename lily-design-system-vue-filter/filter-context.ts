import type { InjectionKey } from "vue";
import type { FilterField, FilterGroup, FilterOperator, FilterRule } from "./filter-model";

/**
 * Every string the filter shows. There are no English defaults: the consumer supplies all of it, in its own language.
 * The functions take the ordinal the user sees (1 = first) so a screen reader hears "Condition 2" rather than the same name twice.
 */
export type FilterLabels = {
    /** Names a condition: "Condition 2". Wraps its controls in a labelled group. */
    rule: (n: number) => string;
    /** Names a group: "Group, level 2" (depth 1 is the whole filter). */
    group: (depth: number) => string;
    field: string;
    operator: string;
    /** What an operator is called: ("contains", the field it applies to). */
    operatorName: (operator: FilterOperator, field: FilterField) => string;
    value: string;
    valueFrom: string;
    valueTo: string;
    combinator: string;
    and: string;
    or: string;
    /** The checkbox that negates a group. */
    not: string;
    addRule: string;
    addGroup: string;
    removeRule: (n: number) => string;
    removeGroup: (depth: number) => string;
    /** What is offered before a choice is made in a select. */
    choose?: string;
    /** Shown in an empty group. */
    empty?: string;
    /** Names the output. Gates it (with `format`). */
    output?: string;
    ruleAdded?: (n: number) => string;
    ruleRemoved?: (n: number) => string;
    groupAdded?: (depth: number) => string;
    groupRemoved?: (depth: number) => string;
};

/** What `Filter` shares with its recursive group view. */
export type FilterContext = {
    fields: () => FilterField[];
    labels: () => FilterLabels;
    readonly: () => boolean;
    maxDepth: () => number;
    fieldById: () => Map<string, FilterField>;
    ruleNumbers: () => Map<string, number>;
    setRule: (id: string, change: (rule: FilterRule) => FilterRule) => void;
    setGroup: (id: string, change: (group: FilterGroup) => FilterGroup) => void;
    addRule: (groupId: string) => void;
    addGroup: (parentId: string, depth: number) => void;
    removeRule: (rule: FilterRule, groupId: string) => void;
    removeGroup: (group: FilterGroup, parentId: string, depth: number) => void;
};

export const FILTER_CONTEXT: InjectionKey<FilterContext> = Symbol("lily-filter");

/** A text field's value, a number input's number (undefined when empty), or a date: what the rule stores for what was typed. */
export function parseTyped(type: string, raw: string): unknown {
    if (raw === "") return undefined;
    return type === "number" ? Number(raw) : raw;
}

export const textOf = (v: unknown): string => (v === undefined || v === null || (typeof v === "number" && Number.isNaN(v)) ? "" : String(v));
