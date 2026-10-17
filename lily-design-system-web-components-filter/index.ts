/**
 * Barrel re-export for `<lily-filter-builder>`.
 *
 * Importing this module registers the custom element under the tag name `"lily-filter-builder"`. Registration is idempotent —
 * re-imports do not throw. Consumers who want a different tag name can import the class directly from `./filter-builder`
 * and call `customElements.define(...)` themselves.
 */
import { FilterBuilder } from "./filter-builder.js";
export { FilterBuilder };
export type { FilterLabels } from "./filter-builder.js";
export {
    ALL_OPERATORS,
    EMPTY_FILTER,
    FilterError,
    addNode,
    changeField,
    changeOperator,
    createGroup,
    createRule,
    fieldType,
    formatFilter,
    fromJson,
    isIsoDate,
    newId,
    normalise,
    operatorsFor,
    removeNode,
    ruleIssue,
    rulesOf,
    toJson,
    toMongo,
    toOData,
    toPredicate,
    toSql,
    updateNode,
    valueArity,
} from "./filter-model.js";
export type {
    FilterCombinator, FilterField, FilterFieldType, FilterGroup, FilterJson, FilterNode, FilterOperator, FilterOption, FilterOutputFormat, FilterRule,
    RuleIssue, SqlDialect, SqlOptions, SqlResult,
} from "./filter-model.js";
export { foldText, highlightSegments, matchesSearch, searchTerms } from "./search-text.js";

if (typeof customElements !== "undefined" && !customElements.get("lily-filter-builder")) {
    customElements.define("lily-filter-builder", FilterBuilder);
}
