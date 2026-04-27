# InfoState

a composition of illustration, title, description, and action for
empty, error, or info states

## Description

InfoState renders a `<section>` with `role="status"` and a configurable
`data-level` (info, empty, error, success). It composes an optional
illustration, a required title (`<h2>`), an optional description
(`<p>`), and optional action HTML (typically a button or link group).
Consumers can replace the entire body with `html` or a caller block.

## HTML tag

`<section>`

## CSS class

`info-state`

## Params

- `title` — string. Section heading text. Required when not using
  `html` / caller.
- `description` — string. Optional body text.
- `level` — `"info" | "empty" | "error" | "success"`. Default `"info"`.
- `illustration` — string (raw HTML). Optional visual above the title.
- `action` — string (raw HTML). Optional action(s) below the
  description.
- `html` — string. Raw HTML override for the entire body.
- `label` — string. `aria-label` override (defaults to `title`).
- `id` — string.
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes as key/value pairs.

## Usage

```njk
{% from "components/info-state/macro.njk" import infoState %}

{{ infoState({
  level: "empty",
  title: "No results",
  description: "Try a different search query.",
  action: '<button type="button">Clear filters</button>'
}) }}
```

## Accessibility

- `role="status"` announces non-critical updates politely.
- `aria-label` defaults to `title` and can be overridden.
- For urgent error states consider `role="alert"` via the
  `attributes` prop or use a dedicated `Alert` component.

## When to use

- Empty list states ("no results", "nothing here yet").
- Friendly error placeholders.
- Onboarding or zero-data states.

## When not to use

- For modal interruptions, use `AlertDialog`.
- For inline form errors, use `ErrorMessage` / `ErrorSummary`.

## Headless

The component renders semantic markup and a `data-level` attribute
that consumers style at will.

## Testing

`components/info-state/macro.test.js` verifies the base class,
`role="status"`, `data-level`, `aria-label` defaulting, and the
title / description / illustration / action composition.
