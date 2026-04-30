# AvatarImage

An avatar indicator inside image such as a user photo.

## Canonical documentation

See [components/avatar-image/index.md](../../../components/avatar-image/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/avatar-image/macro.njk" import avatarImage %}

{{ avatarImage({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
