# TextAreaInputWithCharacterCounter

A multi-line text area input with a caption below that is a character counter "[number] of [maximum] characters".

See `components/text-area-input-with-character-counter/index.md` for canonical documentation.

`CounterTemplate` has no default: the words are the consumer's, in the consumer's language.

## Parameters

- `Label`: string (required)
- `MaxLength`: int (required)
- `CounterTemplate`: string (required) — `{count}` and `{max}` are filled in
- `Value`, `ValueChanged`: two-way with `@bind-Value`
- `Rows`: int?; `Placeholder`: string; `Required`, `Disabled`: bool
- `CssClass`, `AdditionalAttributes`

## Usage

```razor
<TextAreaInputWithCharacterCounter Label="Notes" MaxLength="200" CounterTemplate="{count} of {max} characters" @bind-Value="notes" />
```
