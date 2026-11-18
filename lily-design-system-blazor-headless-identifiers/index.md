# Lily Design System™ Blazor headless identifiers

`LilyDesignSystem.Blazor.Headless.Identifiers`: the 188 national personal identifier components of the Lily Design System catalog for Blazor, an `-input` and
a `-view` for each of 94 identifier types across more than 50 countries (health numbers, national identity numbers, tax
numbers, passports). It is the add-on to [`LilyDesignSystem.Blazor.Headless`](../lily-design-system-blazor-headless/), which
has the other 473 components.

```sh
dotnet add package LilyDesignSystem.Blazor.Headless.Identifiers
```

```razor
@using LilyBlazorHeadless.Components

<UnitedKingdomNationalHealthServiceNumberInput Label="NHS number" @bind-Value="nhs" />

@code {
    private string nhs = "";
}
```

It depends on `LilyDesignSystem.Blazor.Headless`, whose `ValueInputBase` every identifier input extends; the components keep the `LilyBlazorHeadless.Components` namespace.

Like the headless library it is unstyled: semantic HTML, ARIA and behaviour only. Each input renders
`autocomplete="off"` and `spellcheck="false"`, so the browser neither saves the value nor sends it to a spellchecker.
The formats, normalisation and validation rules are in [spec/national-identifiers](../spec/national-identifiers/index.md).

Why a separate package: [spec/headless-identifiers](../spec/headless-identifiers/index.md). Spec:
[spec/index.md](spec/index.md). Agents: [AGENTS.md](AGENTS.md).

---

Lily™ and Lily Design System™ are trademarks.
