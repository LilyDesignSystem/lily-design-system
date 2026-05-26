# CeskoCestovniPasView

A read-only display for Czech Republic's Cestovní pas.

## Canonical documentation

See [components/cesko-cestovni-pas-view/index.md](../../../components/cesko-cestovni-pas-view/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/cesko-cestovni-pas-view/macro.njk" import ceskoCestovniPasView %}

{{ ceskoCestovniPasView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
