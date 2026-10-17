# Filter (Blazor) — specification

`LilyDesignSystem.Blazor.Filter` 0.1.0 (2026-10-17). A port of the canonical [Svelte filter](../../lily-design-system-svelte-filter/spec/index.md): read that contract first; the model (§3), editing (§4), validation (§5) and the five outputs (§6–§9) are identical here, because Blazor re-implements the model in C# (`FilterModel`) rather than copying the TypeScript, and its tests carry the same vectors as `shared/filter-model.test.ts`, so the ports stay in step.

## Component

`<FilterBuilder Label Fields @bind-Value Labels Format Dialect MaxDepth Readonly CssClass />` renders the Svelte markup exactly (same classes, roles, `data-*` hooks), recursively through `RenderFragment`s. `Value` is an immutable `FilterGroup` record tree (`with` expressions edit it); every change calls `ValueChanged` with a new object. Rest attributes land on the root `div.filter`. Focus after add or remove runs by JS eval after the render; the polite status announcements follow the Svelte contract.

The model is `FilterModel` (static): `OperatorsFor`, `ArityOf`, `CreateRule`, `CreateGroup`, `AddNode`, `UpdateNode`, `RemoveNode`, `ChangeField`, `ChangeOperator`, `RulesOf`, `RuleIssueOf`, `Normalise`, `ToJson` / `FromJson` (`System.Text.Json.Nodes`), `ToSql` (`SqlResult(Sql, Params)`), `ToMongo` (a `JsonObject`), `ToOData`, `ToPredicate` and `FormatFilter`. Operators are the string ids in `FilterOperators` (`FilterOperators.All` lists them).

## Deviations from the Svelte contract

- `bind:value` is `@bind-Value`; `onChange` is `ValueChanged`.
- The component is `FilterBuilder` (the helpers share one namespace, where a type named `Filter` would collide with the `Filter` parameter of other helpers); the exception is `FilterException` and the field types are enums.
- A rule's `Value` is `object?`: text, `double`, an ISO date string, or a `List<string>` of option ids for `in` / `not-in`.
- A negated text match in MongoDB output is `{ "$not": { "$regex": …, "$options": "i" } }`, because JSON has no regular-expression literal.
- Typing in a value field re-renders the component (Blazor's model); the field keeps its caret because Blazor patches the DOM rather than replacing it.

## Acceptance criteria

- [x] Every Svelte §8 clause has a test here (markup, editing, output and use, another language, right-to-left).
- [x] The model's own tests (`FilterModelTests.cs`) pass against this package's copy.
- [x] No English text in the component: every string is a label supplied by the consumer.
