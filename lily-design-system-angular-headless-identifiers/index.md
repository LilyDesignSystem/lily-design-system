# Lily Design System™ Angular headless identifiers

`@lilydesignsystem/angular-headless-identifiers`: the 164 national personal identifier components of the Lily Design System catalog for Angular, an `-input` and
a `-view` for each of 82 identifier types across more than 50 countries (health numbers, national identity numbers, tax
numbers, passports). It is the add-on to [`@lilydesignsystem/angular-headless`](../lily-design-system-angular-headless/), which
has the other 473 components.

```sh
pnpm add @lilydesignsystem/angular-headless-identifiers
```

```ts
import { Component, signal } from "@angular/core";
import { UnitedKingdomNationalHealthServiceNumberInput } from "@lilydesignsystem/angular-headless-identifiers";

@Component({
  selector: "app-patient",
  imports: [UnitedKingdomNationalHealthServiceNumberInput],
  template: `<lily-united-kingdom-national-health-service-number-input
    label="NHS number"
    [(value)]="nhs"
  />`,
})
export class Patient {
  nhs = signal("");
}
```

Like the headless library it is unstyled: semantic HTML, ARIA and behaviour only. Each input renders
`autocomplete="off"` and `spellcheck="false"`, so the browser neither saves the value nor sends it to a spellchecker.
The formats, normalisation and validation rules are in [spec/national-identifiers](../spec/national-identifiers/index.md).

Why a separate package: [spec/headless-identifiers](../spec/headless-identifiers/index.md). Spec:
[spec/index.md](spec/index.md). Agents: [AGENTS.md](AGENTS.md).

---

Lily™ and Lily Design System™ are trademarks.
