# Lily Design System™ React 19 headless identifiers

`@lilydesignsystem/react-headless-identifiers`: the 188 national personal identifier components of the Lily Design System catalog for React 19, an `-input` and
a `-view` for each of 94 identifier types across more than 50 countries (health numbers, national identity numbers, tax
numbers, passports). It is the add-on to [`@lilydesignsystem/react-headless`](../lily-design-system-react-headless/), which
has the other 473 components.

```sh
pnpm add @lilydesignsystem/react-headless-identifiers
```

```tsx
import { UnitedKingdomNationalHealthServiceNumberInput } from "@lilydesignsystem/react-headless-identifiers";

<UnitedKingdomNationalHealthServiceNumberInput
  label="NHS number"
  value={nhs}
  onChange={setNhs}
/>;
```

Like the headless library it is unstyled: semantic HTML, ARIA and behaviour only. Each input renders
`autocomplete="off"` and `spellcheck="false"`, so the browser neither saves the value nor sends it to a spellchecker.
The formats, normalisation and validation rules are in [spec/national-identifiers](../spec/national-identifiers/index.md).

Why a separate package: [spec/headless-identifiers](../spec/headless-identifiers/index.md). Spec:
[spec/index.md](spec/index.md). Agents: [AGENTS.md](AGENTS.md).

---

Lily™ and Lily Design System™ are trademarks.
