# KbdShortcut

A keyboard shortcut made of one or more key caps, for example Ctrl plus K.
Outer `<kbd class="kbd-shortcut">` holding one `<kbd class="kbd-shortcut-key">` per key, separated by `<span class="kbd-shortcut-separator" aria-hidden="true">`.
See `components/kbd-shortcut/index.md`.

## Parameters

- `Keys`: IReadOnlyList&lt;string&gt; (required)
- `Separator`: string, default `"+"`
- `Label`: string? — spoken form as `aria-label`; absent means screen readers read the keys
- `CssClass`, `AdditionalAttributes`

## Usage

```razor
<KbdShortcut Keys="@(new[] { "Ctrl", "K" })" Label="Control K" />
```
