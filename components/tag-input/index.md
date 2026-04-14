# Tag Input

TagInput is a headless text input for adding tags to a collection. When the user types a value and presses Enter, the component calls the `onadd` callback with the trimmed text and automatically clears the input, providing a streamlined tag entry experience.

This component is commonly used alongside TagGroup to build tag management interfaces, such as adding skills to a profile, keywords to an article, or labels to an issue tracker. The input value is bindable, allowing the consumer to read or control the current text.

## Implementation Notes

- Renders a native `<input type="text">` element for tag entry
- Uses `aria-label` for accessible identification
- Handles Enter key via an `onkeydown` handler that calls `onadd` with the trimmed value and resets the input
- Supports two-way binding on the `value` prop
- Supports `disabled` state to prevent interaction
- Spreads `restProps` onto the input for consumer customization

## Props

- `label`: string (required) -- accessible name for the input via `aria-label`
- `value`: string (default: `""`) -- current input text; bindable with two-way `value` binding
- `onadd`: `(value: string) => void` (optional) -- callback fired when Enter is pressed with a non-empty trimmed value
- `disabled`: boolean (default: `false`) -- whether the input is disabled
- `...restProps`: unknown -- additional attributes spread onto the `<input>` element

## Usage

Basic tag input:

```html
<TagInput label="Add tag" value={tagText} onadd={(tag) => tags.push(tag)} />
```

Tag input paired with a TagGroup for skills on a profile:

```html
<Field label="Skills">
  <TagGroup>
    {#each skills as skill}
      <Tag>{skill}</Tag>
    {/each}
  </TagGroup>
  <TagInput
    label="Add a skill"
    value={newSkill}
    onadd={(skill) => { skills = [...skills, skill]; }}
    placeholder="Type a skill and press Enter"
  />
</Field>
```

Tag input in a blog post editor for categories:

```html
<Form label="Post settings" onsubmit={savePost}>
  <Field label="Title" required>
    <TextInput label="Post title" value={title} required />
  </Field>
  <Field label="Tags">
    <TagGroup>
      {#each postTags as tag}
        <Tag>{tag} <button onclick={() => removeTag(tag)} aria-label="Remove {tag}">x</button></Tag>
      {/each}
    </TagGroup>
    <TagInput
      label="Add a tag"
      value={newTag}
      onadd={(tag) => { postTags = [...postTags, tag]; }}
      placeholder="e.g. accessibility, design"
    />
  </Field>
  <Button type="submit">Publish</Button>
</Form>
```

## Keyboard Interactions

- Enter: When the input has a non-empty trimmed value, prevents default form submission, calls `onadd` with the trimmed value, and clears the input

## ARIA

- `aria-label={label}` -- provides an accessible name for the text input

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

This headless component renders a native `<input type="text">` with `aria-label`, Enter key handling for tag submission, and two-way value binding. It provides the text input semantics and add-on-enter behavior. The consumer provides all visual styling and manages the tag collection state.


## Styles

The consumer provides all CSS styling. The component renders with a `.tag-input` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `tag-input`
- Verify aria-label={label}` -- provides an accessible name for the text input
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Place the TagInput visually adjacent to or inside the TagGroup so users understand the relationship. Show a clear placeholder text such as "Add a tag..." to indicate purpose.
- **Developers**: Use the `onadd` callback to append the new tag to your collection state. Consider trimming and deduplicating tags in the callback. Pair with a TagGroup for displaying the resulting tags.

## References

- WAI-ARIA textbox role (implicit via input type="text"): https://www.w3.org/TR/wai-aria-1.2/#textbox
