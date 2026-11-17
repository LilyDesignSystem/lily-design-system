# Lessons from Retool's input component library (planned work)

## Summary

A review on 2026-11-17 of [Retool's announcement of its rebuilt input components](https://retool.com/blog/new-input-ui-component-library)
(14 October 2021): more than 35 inputs for Retool's internal-tool builder, rebuilt for "smart defaults", one look across components,
and fast keyboard data entry, and said to follow the WAI-ARIA Authoring Practices and WCAG AA. Retool is a commercial low-code
platform, not a component library anyone installs, so the article is a list of what people building data-entry screens ask for.
Lily already has nearly all of it: `segment-group`, `listbox`, `multi-select`, `file-input`, `file-upload`, `editable`,
`email-input`, `url-input`, `currency-input`, `number-input`, `input-group` for prefixes and suffixes, `date-range`, the
`date-time-picker` and `time-zone-picker` helpers. Four things are missing: **a range slider with two thumbs**, **a combobox that says
when nothing matches and how many options do**, **a drop zone on `file-upload`**, and **a listbox that selects several options**.
Two Retool features are declined because they change what the user typed: relative-date parsing ("next Tuesday") and silent
clamping of numbers. Nothing here is built yet; tasks are in
[tasks.md](../../../tasks.md#phase-34--lessons-from-retools-input-components-2026-11-17).

## Scope

### In scope

- The inputs and input features the article names, against Lily's catalog.
- Validation and formatting behaviours, against Lily's rule that validation messages and formats are the consumer's.

### Explicitly out of scope

- Retool's style editor, icon set and low-code configuration (presets that keep settings when switched).
- Form builders: as in [openehr](../openehr/index.md), Lily ships no generator.

## Principles and rules

- **Never change what the user typed without saying so.** A number above `max` is an error the user can see and fix, not a value
  quietly lowered to `max`; a date typed as "03/04" is not guessed. Silent correction of clinical or financial values is how a
  wrong value is stored with nobody noticing.
- **Dragging is never the only way.** A drop zone or a range thumb that moves by dragging also works by keyboard and by a single
  pointer action (WCAG 2.5.7, 2.1.1): a drop zone sits on a real file input, and each thumb is a native range input.
- **An empty list says so.** A combobox with no matching option says "No matches" in the consumer's words, and the count of matches
  is announced politely as the list changes (WCAG 4.1.3), as Lily's record lists already refuse a blank.
- **Native first.** `<input type="range">`, `<input type="file">` and `<select multiple>` carry the keyboard and form behaviour; a
  custom widget is built only where the native one cannot do the job.

## Findings

From the article:

| Retool                                                                                          | Lily today                                                                                               |
| ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Range Slider (a range of values)                                                                | `range-input` and `slider`: one value each                                                               |
| Segmented Control                                                                               | `segment-group` and `segment-group-item`                                                                 |
| Listbox, Multiselect Listbox                                                                    | `listbox` (single selection), `multi-select` (a native `<select multiple>`)                              |
| File Input, File Dropzone, File Button                                                          | `file-input`, `image-file-input`, `file-upload` (a button and a live count), `file-dialog`; no drop zone |
| Select and Multiselect: combobox mode, selection indicator, empty state, virtualised long lists | `combobox` (no empty state, no count), `multi-select-with-extras`, `tag-input-div`                       |
| Editable Text, Editable Number (percent, currency)                                              | `editable`, `editable-form`, `currency-input`                                                            |
| Text Input presets (email, URL); Number Input presets (percent, currency)                       | `email-input`, `url-input`, `currency-input`, `number-input` inside `input-group`                        |
| Date, Date Time, Date Range: any format parsed, relative dates, a time zone offset              | `date-field`, `date-range`, the `date-time-picker` and `time-zone-picker` helpers                        |
| Prefix and suffix adornments, tooltips                                                          | `input-group`, `tooltip`                                                                                 |
| Validation: required, length, pattern, number clamping, upload size, a custom expression        | native constraint attributes, `:user-invalid` in the themes, `error-message`, `error-summary`            |
| Automatic text colour on a coloured fill                                                        | colour pairs (`--color-*` with `-content`), `bin/check-theme --suggest`                                  |

## Proposals and decisions

| Item                                            | Lily today                             | Decision                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ----------------------------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. A two-thumb range (maintainer: the name)     | one-value sliders                      | **Adopt.** A `<fieldset>` with a legend and two native `<input type="range">`, each labelled ("Minimum", "Maximum", consumer words), the lower one's `max` and the upper one's `min` following each other so they cannot cross; two values, two form fields; the themes draw the track between them. The WAI-ARIA multi-thumb slider pattern, on native inputs. The suffix table gives `-fieldset`. **Built 2026-11-17 as `range-fieldset`, the maintainer's name.** Both inputs keep the same `min` and `max` and a moved thumb is clamped at the other, rather than each input's limits following the other's value: with different limits the same value sits at different places on the two tracks, and a theme cannot lay them over one. |
| 2. Combobox empty state and count               | none                                   | **Adopt** `noResultsLabel` (consumer words, shown as a non-selectable item when the list is empty) and `resultsLabel(count)` (a polite status, announced after typing pauses) on `combobox`, in all nine catalogs.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 3. A drop zone on `file-upload`                 | a button only                          | **Adopt** `dropZone` on `file-upload`: the root accepts dropped files and passes them to the same `onchange` and live count, with `data-drag-over` while a file is held over it; the button stays the keyboard path, and the drop zone adds no new tab stop.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| 4. A multi-select listbox (maintainer decision) | `multi-select` (native)                | **Consider.** `aria-multiselectable` on `listbox` with the APG keys (Space toggles, Shift+arrows extend, Ctrl+A selects all). Build only if `multi-select` and `checkbox-group` cannot serve a real case: the native and checkbox forms submit, reset and are announced with no script.                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 5. Formatted numbers while editing              | `currency-input`, `number-input`       | **Adopt a guide pattern**: show a number formatted with `Intl.NumberFormat`, and edit it raw. For a locale with a decimal comma use a text input with `inputmode="decimal"` and parse in the consumer's code, since `type="number"` does not accept a comma in every browser. A unit or currency symbol in `input-group` is part of the label or linked by `aria-describedby`.                                                                                                                                                                                                                                                                                                                                                                |
| 6. Long lists                                   | `listbox`, `combobox`                  | **Adopt a guide sentence**: a consumer that renders only part of a long list sets `aria-setsize` and `aria-posinset` on each option, and knows that find-in-page cannot see the rest.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 7. `contrast-color()` (watch)                   | colour pairs, checked by `check-theme` | **Watch.** When CSS `contrast-color()` is Baseline, the brand overlays may use it for `--lily-on-brand` with the current pair as the fallback; until then each pair is set by hand and gated at 4.5:1.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Relative-date and any-format date parsing       | —                                      | **Decline.** It is English and locale logic ("next Tuesday", "03/04"), and a wrong guess stores a wrong date. Lily asks for dates in parts or by a picker.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Silent number clamping                          | —                                      | **Decline.** A value outside `min` and `max` is invalid and says so (native constraint validation); it is never changed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Presets that keep settings, a style editor      | —                                      | **Decline.** Low-code tooling.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |

## Advice

Retool's list mostly confirms Lily's catalog; the article is five years old, and most of it is now ordinary. **2 (combobox empty state
and count)** is the most useful: a real gap in a common component, small to fix. **1 (two-thumb range)** and **3 (drop zone)** are the
two inputs people will otherwise build badly (a range on two divs, a drop zone with no button). **4** should stay a decision until a
case needs it. The declines matter as much as the adoptions: parsing what people meant and clamping what they typed are convenient in
an internal tool and dangerous in a clinical one.

## Acceptance criteria

- [x] The two-thumb range exists in all nine catalogs, with tests that the thumbs cannot cross and that both values submit (item 1): `range-fieldset`, 2026-11-17.
- [ ] `combobox` takes `noResultsLabel` and `resultsLabel`, tested in all nine catalogs (item 2).
- [ ] `file-upload` takes `dropZone`, tested with a dropped file and with the keyboard path (item 3).
- [ ] The multi-select listbox is built or declined with a reason here (item 4).
- [ ] The guide has the formatted-number and long-list patterns, and the two declines are stated in the validation guidance (items 5, 6).

## Related topics

- [components](../../components/index.md) — the suffix table that names item 1.
- [accessibility](../../accessibility/index.md) — dragging, status messages.
- [internationalization](../../internationalization/index.md) — locale number entry.
- [magicui](../magicui/index.md), [zoblocks](../zoblocks/index.md) — the same review series.

## Sources

- [Retool: a new input UI component library](https://retool.com/blog/new-input-ui-component-library) (14 October 2021)
- [WAI-ARIA APG: Slider (Multi-Thumb)](https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/)
- [WAI-ARIA APG: Listbox](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/)
- [WCAG 2.2 SC 2.5.7 Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html)
- [WCAG 2.2 SC 4.1.3 Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)
- [MDN: `contrast-color()`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/contrast-color)

---

Lily™ and Lily Design System™ are trademarks.
