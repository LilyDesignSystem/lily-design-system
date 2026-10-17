import type { FilterField, FilterGroup, FilterRule } from "./filter-model";

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
  operatorName: (operator: import("./filter-model").FilterOperator, field: FilterField) => string;
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

/** What the recursive group view needs from the filter that hosts it. Provided by `Filter`, injected by `FilterGroupView`. */
export abstract class FilterHost {
  abstract fields(): FilterField[];
  abstract labels(): FilterLabels;
  abstract isReadonly(): boolean;
  abstract maxDepthValue(): number;
  abstract fieldOf(id: string): FilterField | undefined;
  abstract ruleNumber(id: string): number;
  abstract setRule(id: string, change: (rule: FilterRule) => FilterRule): void;
  abstract setGroup(id: string, change: (group: FilterGroup) => FilterGroup): void;
  abstract addRule(groupId: string): void;
  abstract addGroup(parentId: string, depth: number): void;
  abstract removeRule(rule: FilterRule, groupId: string): void;
  abstract removeGroup(group: FilterGroup, parentId: string, depth: number): void;
}

/** A text field's value, a number input's number (undefined when empty), or a date: what the rule stores for what was typed. */
export function parseTyped(type: string, raw: string): unknown {
  if (raw === "") return undefined;
  return type === "number" ? Number(raw) : raw;
}

export const textOf = (v: unknown): string => (v === undefined || v === null || (typeof v === "number" && Number.isNaN(v)) ? "" : String(v));
