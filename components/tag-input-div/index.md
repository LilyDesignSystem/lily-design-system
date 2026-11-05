# Tag Input Div

TagInputDiv is a headless group holding the consumer's tags and a text field that adds to them. When the user types a value and presses Enter, the component calls the `onadd` callback with the trimmed text and automatically clears the input, providing a streamlined tag entry experience.

**Status:** stable — exercised in composed page flows under e2e and axe, beyond the per-component checks.

This component is commonly used alongside TagGroup to build tag management interfaces, such as adding skills to a profile, keywords to an article, or labels to an issue tracker. The input value is bindable, allowing the consumer to read or control the current text.

## Implementation Notes

- Renders a `<div role="group">` holding the consumer's tags and a native `<input type="text" class="tag-input-div-field">`
- The consumer keeps the tags and renders them as children, with their remove buttons; the component never holds the list
- Uses `aria-label` on both the group and the field
- Handles Enter via a `keydown` handler that calls `onadd` with the trimmed value and clears the field. With no text it stays a normal Enter, which submits a surrounding form; during an IME composition it confirms the composition
- Supports two-way binding on the `value` prop
- Sets `disabled`, `placeholder`, `name` and `required` on the field
- Spreads `restProps` onto the root `<div>` for consumer customization

## Props

- `label`: string (required) -- accessible name for the group and the field via `aria-label`
- `value`: string (default: `""`) -- current field text; bindable with two-way `value` binding
- `onadd`: `(value: string) => void` (optional) -- callback fired when Enter is pressed with a non-empty trimmed value (Vue: the `add` event; Angular: the `added` output; Web Components: `lily-add`; HTML and Nunjucks: `tag-input-div-add`)
- `disabled`: boolean (default: `false`) -- whether the field is disabled
- `placeholder`: string (optional) -- the field's placeholder
- `name`: string (optional) -- the field's name
- `required`: boolean (default: `false`) -- whether the field is required
- `children`: slot (optional) -- the tags so far, rendered before the field
- `...restProps`: unknown -- additional attributes spread onto the root `<div>`

## Usage

Basic tag input, with the tags in its default slot:

```html
<TagInputDiv
  label="Add tag"
  bind:value={tagText}
  onadd={(tag) => { tags = [...tags, tag]; }}
>
  {#each tags as tag}
    <Tag>{tag}</Tag>
  {/each}
</TagInputDiv>
```

Removable tags on a profile. The remove button and its accessible name are the consumer's:

```html
<Field label="Skills">
  <TagInputDiv
    label="Add a skill"
    bind:value={newSkill}
    onadd={(skill) => { skills = [...skills, skill]; }}
    placeholder="Type a skill and press Enter"
  >
    {#each skills as skill}
      <Tag>{skill} <button onclick={() => removeSkill(skill)} aria-label="Remove {skill}">x</button></Tag>
    {/each}
  </TagInputDiv>
</Field>
```

## Keyboard Interactions

- Enter: When the field has a non-empty trimmed value, prevents default form submission, calls `onadd` with the trimmed value, and clears the field. With no text it stays a normal Enter. During an IME composition it confirms the composition

## ARIA

- `role="group"` with `aria-label={label}` -- names the tags and the field together
- `aria-label={label}` -- names the text field

## When to Use

- Use alongside a TagGroup to build tag management interfaces where users add tags by typing and pressing Enter.
- Use for adding keywords, labels, skills, or categories to items such as articles, profiles, or issue trackers.
- Use in content management systems for tagging posts, pages, or media assets.
- Use in issue trackers or project boards for adding labels to work items.

## When Not to Use

- Do not use for read-only tag display -- use TagGroup instead.
- Do not use for predefined selections only -- use CheckboxGroup, Combobox, or Select instead.
- Do not use when autocomplete suggestions should appear as the user types -- use Combobox instead.

## Headless

This headless component renders a `<div role="group">` holding a native `<input type="text">` with `aria-label`, Enter key handling for tag submission, and two-way value binding. It provides the text input semantics and add-on-enter behavior. The consumer provides all visual styling and manages the tag collection state.

## Styles

The consumer provides all CSS styling. The component renders with a `.tag-input-div` class for targeting. No default styles are included — this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `tag-input-div`
- Verify `role="group"` and `aria-label={label}` on the root, and `aria-label={label}` on the field
- Verify Enter adds and clears, Enter with no text stays a normal Enter, and Enter during an IME composition adds nothing
- Verify pass-through attributes reach the root

## Advice

- **Designers**: Place the TagInputDiv visually adjacent to or inside the TagGroup so users understand the relationship. Show a clear placeholder text such as "Add a tag..." to indicate purpose.
- **Developers**: Use the `onadd` callback to append the new tag to your collection state. Consider trimming and deduplicating tags in the callback. Pair with a TagGroup for displaying the resulting tags.

## Related components

- `text-input` — a single-line text input field <input type="text">

## References

- WAI-ARIA textbox role (implicit via input type="text"): https://www.w3.org/TR/wai-aria-1.2/#textbox

---

Lily™ and Lily Design System™ are trademarks.
