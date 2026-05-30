# Lily Design System — Blazor Headless — Specification

Living specification for the Blazor .NET 10 headless implementation of the
Lily Design System. Single source of truth for spec-driven development of
this subproject. For project-wide rules, read the root [spec.md](../spec.md)
first.

This file adds Blazor-specific detail and tracks the implementation status of
the **492 canonical components** in this framework.

---

## 1. Role in the ecosystem

This subproject ships the Blazor .NET 10 Razor-component implementation of
every component in the Lily catalog. Every component is **headless**: zero
CSS, semantic HTML, ARIA, focus and keyboard behaviour only. Consumers bring
their own styles. The sibling subproject
`lily-design-system-blazor-web-examples/` consumes this library via a
`ProjectReference` and renders it with NHS-aligned CSS.

This library has no Blazor-host coupling — it works in Blazor Server, Blazor
WebAssembly, and Blazor Hybrid hosts.

## 2. Scope

### In scope

- Blazor Razor components (`*.razor` + optional `*.razor.cs` code-behind) for
  all 492 components.
- bUnit + xUnit tests per component asserting ARIA, keyboard, and structural
  contract.
- C# 13 / .NET 10.0 source.

### Explicitly out of scope

- CSS, stylesheets (`.razor.css`, scoped CSS, isolation).
- Hardcoded text — all user-facing strings via parameters / `ChildContent`.
- Bundled JavaScript interop libraries (only minimal browser-API JS where
  required for things like clipboard or `dialog.showModal()`).
- Class-based MVC or MVVM patterns — Razor components only.

## 3. Architecture

### Framework + tooling

| Concern             | Choice                                      |
| ------------------- | ------------------------------------------- |
| Runtime             | .NET 10.0                                   |
| Language            | C# 13                                       |
| UI framework        | Blazor (Razor components)                   |
| Build               | `dotnet build`                              |
| Test runner         | bUnit + xUnit (`dotnet test`)               |
| i18n                | none — consumer-supplied via parameters     |

### Blazor conventions

- One `.razor` file per component (PascalCase filename matches component
  name).
- Parameters use `[Parameter]` attribute; type with C# nullability
  (`string?` for optional, `string` for required).
- Required parameters use `[EditorRequired]`.
- Children/content use `RenderFragment ChildContent`.
- Two-way binding uses `[Parameter] Value` + `[Parameter] EventCallback<T> ValueChanged`.
- `@attributes` on the root element to spread `AdditionalAttributes`
  (Blazor's "rest props" pattern).
- Namespace: `LilyBlazorHeadless.Components`.
- Class hook: kebab-case base class on the root element via `class="…"`.

### File layout

```
lily-design-system-blazor-headless/
├── src/LilyBlazorHeadless/
│   ├── LilyBlazorHeadless.csproj
│   ├── _Imports.razor
│   └── Components/
│       └── {PascalCase}.razor             ← one file per component
├── tests/LilyBlazorHeadless.Tests/
│   ├── LilyBlazorHeadless.Tests.csproj
│   └── Components/
│       └── {PascalCase}Tests.cs           ← bUnit test
└── LilyBlazorHeadless.slnx
```

Per-component documentation lives in the **root** `../components/{kebab-case}/`
directory (`index.md`, `README.md`, `AGENTS.md`, `CLAUDE.md`, `plan.md`,
`tasks.md`). It is canonical and shared across all six headless subprojects —
not duplicated here.

## 4. Per-component contract

Each component requires:

- `src/LilyBlazorHeadless/Components/{PascalCase}.razor` — implementation.
- `tests/LilyBlazorHeadless.Tests/Components/{PascalCase}Tests.cs` — bUnit
  test.
- `../components/{kebab-case}/{index,README,AGENTS,CLAUDE,plan,tasks}.md` —
  canonical per-component documentation at the **repository root**, shared
  across all headless subprojects.

### Component source template

```razor
@namespace LilyBlazorHeadless.Components

@*
    {PascalCase} component
    {one-paragraph description}

    Parameters:
      CssClass — string, optional. CSS class hook appended to base class.
      Label — string, optional. Accessible name.
      ChildContent — RenderFragment, optional. Inner content.
      AdditionalAttributes — IDictionary<string, object>, optional. Pass-through attributes.
*@

<{tag}
    class="@($"{kebab-case-base} {CssClass}".Trim())"
    aria-label="@Label"
    @attributes="AdditionalAttributes"
>
    @ChildContent
</{tag}>

@code {
    [Parameter] public string? CssClass { get; set; }
    [Parameter] public string? Label { get; set; }
    [Parameter] public RenderFragment? ChildContent { get; set; }
    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
```

The HTML tag is the canonical tag from the root
[`AGENTS/components.md`](../AGENTS/components.md) suffix-to-tag mapping.

### Translation patterns (React → Blazor)

| React                 | Blazor                                                 |
| --------------------- | ------------------------------------------------------ |
| `useState(val)`       | `private type field = val;`                            |
| `onChange={fn}`       | `ValueChanged="v => field = v"` or `@bind-Value`       |
| `onClick={() => …}`   | `@onclick="() => …"`                                   |
| `{cond && <X/>}`      | `@if (cond) { <X /> }`                                 |
| `{items.map(…)}`      | `@foreach (var i in items) { … }`                      |
| `setTimeout(fn, ms)`  | `await Task.Delay(ms); StateHasChanged();`             |
| `setInterval(fn, ms)` | `System.Timers.Timer` + `InvokeAsync(StateHasChanged)` |

## 5. Testing

### 5.1 Stack

- bUnit (Blazor component testing library).
- xUnit (test framework).
- Run via `dotnet test`.

### 5.2 Per-component test minimums

Each `{PascalCase}Tests.cs` asserts:

1. Root element renders with the canonical kebab-case base class.
2. `CssClass` parameter appends correctly.
3. `Label` parameter reflects to `aria-label`.
4. Required ARIA attributes from `AGENTS.md` are present.
5. `ChildContent` renders.
6. Keyboard interactions from `AGENTS.md → Keyboard` work (where applicable).

### 5.3 Test file template

```csharp
using Bunit;
using Xunit;
using LilyBlazorHeadless.Components;

namespace LilyBlazorHeadless.Tests.Components;

public class {PascalCase}Tests : TestContext
{
    [Fact]
    public void Renders_with_canonical_class()
    {
        var cut = RenderComponent<{PascalCase}>(p => p.Add(x => x.Label, "Test"));
        var el = cut.Find("{tag}");
        Assert.Contains("{kebab-case-base}", el.GetAttribute("class"));
        Assert.Equal("Test", el.GetAttribute("aria-label"));
    }
}
```

## 6. Commands

```sh
dotnet build                                                    # build the library
dotnet build src/LilyBlazorHeadless/LilyBlazorHeadless.csproj  # build just the library
dotnet test                                                     # run bUnit tests
```

## 7. Acceptance criteria

### 7.1 Catalog parity

- [ ] All 492 canonical components have a `{PascalCase}.razor`.
- [ ] All 492 components have a `{PascalCase}Tests.cs` bUnit test.
- [x] Per-component docs live in the root `../components/{kebab-case}/`
      (shared canonical, not duplicated per subproject).
- [ ] Every component uses the canonical HTML tag.
- [ ] Every component sets the kebab-case base class on its root.
- [ ] No `.razor.css` files, no scoped CSS, no isolation CSS.

### 7.2 Accessibility

- [ ] WCAG 2.2 AAA across every component.
- [ ] Required `Label` parameters enforced where text alone is insufficient.
- [ ] Keyboard contract from `AGENTS.md → Keyboard` works.

### 7.3 Testing

- [ ] Every component has a `{PascalCase}Tests.cs` bUnit spec.
- [ ] `dotnet test` passes.

### 7.4 Internationalisation

- [ ] No hardcoded user-facing strings.
- [ ] Canonical parameter names (`Label`, `Description`, `Placeholder`,
      `Error`, `HelpText`, etc.) mirroring the root i18n contract.

## 8. Implementation status

### 8.1 Done

- [x] Project infrastructure (`.csproj`, `_Imports.razor`).
- [x] Test project (bUnit + xUnit).
- [x] AGENTS.md, CLAUDE.md, index.md, README.md (symlink), plan.md, tasks.md.
- [x] All 492 canonical components have a `{PascalCase}.razor` (per audit).
- [x] Per-component bUnit tests (commit `1b8600d4`).
- [x] TabGroup removal (canonical pattern is TabBar + TabBarButton + TabPanel).

### 8.2 Verified

- [x] `dotnet test` passes: **1,245 / 1,245 bUnit tests, zero failures**.
- [x] CSS class-name audit: **492 / 492** components reference their canonical
      kebab-case base class.
- [x] All 492 canonical components have a `{PascalCase}.razor` and a
      `{PascalCase}Tests.cs`.

### 8.3 Open backlog

(none — all listed items verified)

## 9. Prohibited

| Prohibition                       | Reason                              |
| --------------------------------- | ----------------------------------- |
| `*.razor.css`, scoped CSS         | headless: zero CSS                  |
| CSS isolation                     | headless: zero CSS                  |
| Tailwind, DaisyUI, Bootstrap      | no CSS framework dependency         |
| Bundled fonts, images, icons      | consumer supplies all assets        |
| Hardcoded user-facing strings     | i18n is the consumer's concern      |
| `role="button"` on `<div>`        | use `<button>` (semantic-first)     |
| JavaScript interop libraries      | minimal browser-API JS only         |

## 10. Tracking

- Package: `lily-design-system-blazor-headless`
- Version: 0.2.0
- Framework: Blazor .NET 10 + C# 13
- Test runner: bUnit + xUnit
- Build: `dotnet build`
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause
- Contact: Joel Parker Henderson <joel@joelparkerhenderson.com>
- Canonical catalog: [../components.tsv](../components.tsv) — 492 components
- Root spec: [../spec.md](../spec.md)
- Sibling example app: [../lily-design-system-blazor-web-examples/](../lily-design-system-blazor-web-examples/)
