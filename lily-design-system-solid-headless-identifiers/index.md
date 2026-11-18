# Lily Design System™ Solid headless identifiers

`@lilydesignsystem/solid-headless-identifiers`: the 164 national personal identifier components of the Lily Design
System catalog for Solid 2.0, an `-input` and a `-view` for each of 82 identifier types across more than 50 countries
(health numbers, national identity numbers, tax numbers, passports). It is the add-on to
[`@lilydesignsystem/solid-headless`](../lily-design-system-solid-headless/), which has the other 473 components.

```sh
pnpm add @lilydesignsystem/solid-headless-identifiers
```

```tsx
import { UnitedKingdomNationalHealthServiceNumberInput } from "@lilydesignsystem/solid-headless-identifiers";

<UnitedKingdomNationalHealthServiceNumberInput
  label="NHS number"
  value={nhs()}
  onChange={setNhs}
/>;
```

Like the headless library it is unstyled: semantic HTML, ARIA and behaviour only. Each input renders
`autocomplete="off"` and `spellcheck="false"`, so the browser neither saves the value nor sends it to a spellchecker.
The identifier formats, normalisation and validation rules are in
[spec/national-identifiers](../spec/national-identifiers/index.md).

It has the same two builds as `solid-headless`: the `solid` export condition (the JSX source, compiled by your Solid
app) and a compiled `dist/index.js`. Peer dependencies: `solid-js` and `@solidjs/web` `^2.0.0`.

Why a separate package: [spec/headless-identifiers](../spec/headless-identifiers/index.md). Spec:
[spec/index.md](spec/index.md). Agents: [AGENTS.md](AGENTS.md).

---

Lily™ and Lily Design System™ are trademarks.
