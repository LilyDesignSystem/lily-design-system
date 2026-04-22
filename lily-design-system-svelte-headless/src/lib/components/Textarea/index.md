# Textarea

A multi-line text input rendered as a native `<textarea>` with `aria-label`, bindable `value`, and optional `rows`, `required`, and `disabled` attributes.

## What it is

`Textarea` is a headless Svelte 5 component wrapping the native `<textarea>` element. It provides two-way-bound `value` and accessible labeling via `aria-label` without imposing any visual styling.

## What it does

- Renders `<textarea class="textarea {className}">` with `aria-label` for the accessible name.
- Binds `value` two-way via `bind:value`.
- Forwards `rows`, `required`, and `disabled` to the native element.
- Spreads additional HTML attributes (e.g. `placeholder`, `maxlength`, `id`) onto the `<textarea>`.

## When to use it

- Comment boxes, messages, descriptions, and feedback forms.
- Code input where users paste or type longer blocks of text.
- Any form that needs multiple lines of user input without character counting.

## When not to use it

- Don't use it for single-line text — use `TextInput`.
- Don't use it when you need a character counter — use `TextAreaWithCharacterCounter`.
- Don't use it for rich / formatted text input — use a dedicated rich-text editor.
- Don't use it for search queries — use `SearchInput` or `TextInputWithSearch`.

## How to use it

Import, bind `value`, pass a translated `label`, and optionally set `rows`. Add `placeholder`/`maxlength` via rest-props.

## Props

- `class` — string, optional. Extra CSS class appended to `textarea`.
- `label` — string, required. Accessible name via `aria-label`.
- `value` — string, default `""`, bindable via `bind:value`. Text content.
- `rows` — number, optional. Number of visible rows.
- `required` — boolean, default `false`. Whether the textarea is required.
- `disabled` — boolean, default `false`. Whether the textarea is disabled.
- `...restProps` — any additional HTML attributes spread onto the `<textarea>`.

## Usage

```svelte
<script lang="ts">
  import Textarea from "./Textarea.svelte";

  let comments = $state("");
</script>

<Textarea label="Comments" bind:value={comments} rows={5} />
```

```svelte
<script lang="ts">
  import Textarea from "./Textarea.svelte";

  let description = $state("");
</script>

<Textarea
  label="Description"
  bind:value={description}
  required
  placeholder="Describe the issue…"
/>
```

```svelte
<script lang="ts">
  import Textarea from "./Textarea.svelte";

  let notes = $state("Locked notes");
  let readOnly = $state(true);
</script>

<Textarea label="Notes" bind:value={notes} disabled={readOnly} />
```

```svelte
<script lang="ts">
  import Textarea from "./Textarea.svelte";

  let body = $state("");
  let count = $derived(body.length);
</script>

<Textarea label="Message" bind:value={body} maxlength={500} rows={6} />
<p aria-live="polite">{count} / 500 characters</p>
```

## Accessibility

- `aria-label` supplies the accessible name since no visible `<label>` is rendered — pass a translated string.
- Native `<textarea>` provides Tab focus and standard text-editing key handling; `Enter` inserts a newline and does not submit the form.
- `required` and `disabled` states are conveyed natively.

## Related components

- `TextAreaWithCharacterCounter` — adds a live character-count caption.
- `TextInput` — single-line text input.
- `CharacterCounter` — standalone counter you can pair with `Textarea`.
- `Field` — wrapper providing a visible `<label>`, hint, and error.
