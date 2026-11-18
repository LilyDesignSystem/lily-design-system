# Lily Design System™ Vue 3 headless identifiers

`@lilydesignsystem/vue-headless-identifiers`: the 164 national personal identifier components of the Lily Design System catalog for Vue 3, an `-input` and
a `-view` for each of 82 identifier types across more than 50 countries (health numbers, national identity numbers, tax
numbers, passports). It is the add-on to [`@lilydesignsystem/vue-headless`](../lily-design-system-vue-headless/), which
has the other 473 components.

```sh
pnpm add @lilydesignsystem/vue-headless-identifiers
```

```vue
<script setup lang="ts">
import { ref } from "vue";
import { UnitedKingdomNationalHealthServiceNumberInput } from "@lilydesignsystem/vue-headless-identifiers";
const nhs = ref("");
</script>

<template>
  <UnitedKingdomNationalHealthServiceNumberInput
    label="NHS number"
    v-model="nhs"
  />
</template>
```

Like the headless library it is unstyled: semantic HTML, ARIA and behaviour only. Each input renders
`autocomplete="off"` and `spellcheck="false"`, so the browser neither saves the value nor sends it to a spellchecker.
The formats, normalisation and validation rules are in [spec/national-identifiers](../spec/national-identifiers/index.md).

Why a separate package: [spec/headless-identifiers](../spec/headless-identifiers/index.md). Spec:
[spec/index.md](spec/index.md). Agents: [AGENTS.md](AGENTS.md).

---

Lily™ and Lily Design System™ are trademarks.
