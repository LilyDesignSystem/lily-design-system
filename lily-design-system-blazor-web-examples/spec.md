# Lily Design System — Blazor Web Examples — Specification

Living specification for the Blazor Web App example that demonstrates the
Lily Design System. Single source of truth for spec-driven development of
this subproject. For project-wide rules, read the root [spec.md](../spec.md)
first.

This file adds Blazor-Web-specific detail and tracks the example app's
implementation status against the **407 canonical components**.

---

## 1. Role in the ecosystem

This subproject is the **styled reference app** for the Blazor / .NET 10
ecosystem. It consumes the sibling library
`lily-design-system-blazor-headless/` via a `ProjectReference` and renders
every component with NHS-aligned CSS so visitors can see the design system
working end-to-end.

The app ships:

- The three required routes (`/`, `/components`, `/components/{slug}`) per
  [../AGENTS/examples.md](../AGENTS/examples.md).
- Twelve composed-page demos.
- A complete NHS-aligned stylesheet that targets Lily's kebab-case class
  hooks.

## 2. Scope

### In scope

- A Blazor Web App with Interactive Server rendering.
- A `/components/{slug}` route that renders a live demo per component for all
  407 components (via `Data/ComponentData.cs`).
- 12 composed-page demos (`Components/Pages/*.razor`).
- A complete NHS-aligned CSS stylesheet (`wwwroot/css/nhs.css`).
- Playwright e2e tests for each `/components/{slug}` route.
- bUnit tests for example pages.

### Explicitly out of scope

- Re-implementing the headless components (live in `lily-design-system-blazor-headless/`).
- Tailwind, DaisyUI, Bootstrap, or any CSS framework.
- `nhsuk-` prefixed class names in markup.
- Blazor WebAssembly (this is Blazor Web Server interactive).

## 3. Architecture

### Framework + tooling

| Concern             | Choice                                      |
| ------------------- | ------------------------------------------- |
| App framework       | Blazor Web App (.NET 10.0)                  |
| Render mode         | Interactive Server                          |
| Language            | C# 13                                       |
| Build               | `dotnet build`                              |
| Test runner         | bUnit (component tests) + Playwright (e2e)  |
| Styling             | Plain CSS with custom properties (NHS)      |

### Headless dependency

`ProjectReference` to `../lily-design-system-blazor-headless/`:

```xml
<ItemGroup>
  <ProjectReference Include="..\..\lily-design-system-blazor-headless\src\LilyBlazorHeadless\LilyBlazorHeadless.csproj" />
</ItemGroup>
```

Components are referenced from `LilyBlazorHeadless.Components`.

### File layout

```
lily-design-system-blazor-web-examples/
├── src/LilyBlazorWebExamples/
│   ├── LilyBlazorWebExamples.csproj
│   ├── Program.cs
│   ├── _Imports.razor
│   ├── Components/
│   │   ├── App.razor
│   │   ├── Routes.razor
│   │   ├── Layout/MainLayout.razor
│   │   └── Pages/
│   │       ├── Home.razor                 ← /
│   │       ├── Components.razor           ← /components
│   │       ├── ComponentDetail.razor      ← /components/{slug}
│   │       ├── ContactForm.razor          ← composed-page demos (12)
│   │       ├── Dashboard.razor
│   │       └── …
│   ├── Data/
│   │   └── ComponentData.cs               ← record list (407 entries)
│   └── wwwroot/
│       ├── css/nhs.css                    ← NHS-aligned stylesheet
│       └── js/headless-interop.js         ← minimal JS interop
├── e2e/components/{kebab-case}.spec.ts    ← Playwright e2e per slug
├── playwright.config.ts
└── LilyBlazorWebExamples.slnx
```

## 4. Required routes

| Route                  | Page                          | Purpose                                |
| ---------------------- | ----------------------------- | -------------------------------------- |
| `/`                    | `Pages/Home.razor`            | Home, links to demos                   |
| `/components`          | `Pages/Components.razor`      | Catalog index                          |
| `/components/{slug}`   | `Pages/ComponentDetail.razor` | Live demo + metadata                   |

`ComponentDetail.razor` renders the demo HTML from `ComponentData.cs` using
`MarkupString`. `ComponentData.Components` is a `List<ComponentInfo>` with
**407 entries** (one per canonical slug).

```csharp
public record ComponentInfo(string Slug, string Name, string Description, string DemoHtml);
```

## 5. Composed-page demos

Twelve composed-page demos exercise multiple components together. See the
SvelteKit spec for the full table. The Blazor implementations live in
`Components/Pages/{PascalCase}.razor`.

## 6. Styling

- Plain CSS in `wwwroot/css/nhs.css` with NHS-aligned CSS custom properties.
- CSS selectors target the kebab-case Lily class names directly.
- No CSS framework dependency.
- Theme tokens follow [../AGENTS/theme.md](../AGENTS/theme.md).

## 7. Blazor translation patterns

| React                 | Blazor                                                 |
| --------------------- | ------------------------------------------------------ |
| `useState(val)`       | `private type field = val;`                            |
| `onChange={fn}`       | `ValueChanged="v => field = v"` or `@bind-Value`       |
| `onClick={() => …}`   | `@onclick="() => …"`                                   |
| `{cond && <X/>}`      | `@if (cond) { <X /> }`                                 |
| `{items.map(…)}`      | `@foreach (var i in items) { … }`                      |
| `setTimeout(fn, ms)`  | `await Task.Delay(ms); StateHasChanged();`             |
| `setInterval(fn, ms)` | `System.Timers.Timer` + `InvokeAsync(StateHasChanged)` |

## 8. Key headless-component APIs

- **Two-way binding**: `Value`/`ValueChanged` (TextInput, Select),
  `Checked`/`CheckedChanged` (SwitchButton, CheckboxInput),
  `Open`/`OpenChanged` (Dialog, Drawer).
- **Events**: `OnSubmit` (Form); `@onclick` on a component passes through via
  `AdditionalAttributes`.
- **CSS hook**: Each component outputs its kebab-case base class; NHS CSS
  targets that.
- **Tooltip** is a sibling element, not a wrapper. Use `aria-describedby` on
  the trigger and `Visible`/`VisibleChanged` to toggle.
- **AccordionListItem** renders `<details>`; requires `<summary>` as first
  child.
- **TagInput.Onadd** is a `string` parameter (not a callback). Use
  `TextInput` with `@onkeydown` for tag-add functionality.

## 9. Testing

### 9.1 Stack

- **Unit / component**: bUnit + xUnit (`dotnet test`).
- **E2E**: Playwright across Chromium, Firefox, WebKit.

### 9.2 E2E coverage

Each `/components/{slug}` route has a Playwright spec in
`e2e/components/{kebab-case}.spec.ts`.

## 10. Commands

```sh
dotnet build                                           # build the project
dotnet run --project src/LilyBlazorWebExamples         # start dev server
dotnet publish -c Release                              # publish for production
dotnet test                                            # bUnit tests
pnpm exec playwright test                              # e2e tests
```

## 11. Acceptance criteria

### 11.1 Routes

- [ ] `/` renders home with skip-link + standard landmarks.
- [ ] `/components` lists all 407 canonical components.
- [ ] `/components/{slug}` renders a live demo for all 407 slugs.
- [ ] All 12 composed-page demos exist as `Pages/{PascalCase}.razor`.

### 11.2 Demo registry

- [x] `Data/ComponentData.cs` contains a 407-entry `Components` list.
- [x] Each demo's class hook matches the canonical kebab-case base class.
- [x] No orphan slugs (every record matches `components.tsv`).

### 11.3 Styling

- [ ] `wwwroot/css/nhs.css` targets kebab-case Lily classes.
- [ ] No `nhsuk-` prefixes in markup.
- [ ] No CSS-framework imports.

### 11.4 Accessibility

- [ ] Skip-link first interactive on every page.
- [ ] Standard landmarks wrap every page.
- [ ] WCAG 2.2 AAA target.

### 11.5 Testing

- [ ] `dotnet test` passes.
- [ ] `pnpm exec playwright test` passes.

## 12. Implementation status

### 12.1 Done

- [x] Project infrastructure (`.csproj`, `_Imports.razor`, `Program.cs`).
- [x] AGENTS.md, CLAUDE.md, index.md, README.md (symlink), plan.md, tasks.md.
- [x] NHS CSS integration (`wwwroot/css/nhs.css`).
- [x] `Pages/Home.razor` (`/`).
- [x] `Pages/Components.razor` (`/components`).
- [x] `Pages/ComponentDetail.razor` (`/components/{slug}` with `MarkupString`).
- [x] All 12 composed-page demos.
- [x] `Data/ComponentData.cs` with 407 components (canonical, no orphans).
- [x] Per-component bUnit tests in the sibling headless project
      (commit `1b8600d4`).
- [x] Playwright e2e per slug (commit `7a51013b`).
- [x] Catalog rename: `medical-record-red-box` → `medical-banner-box-for-danger`
      in `wwwroot/css/nhs.css`.

### 12.2 Open backlog

- [ ] Audit WCAG 2.2 AAA conformance on every page.
- [ ] Verify responsive design on mobile / desktop / 4K.
- [ ] Confirm CSS class names match `../css-style-sheet-template.css`.

## 13. Prohibited

| Prohibition                       | Reason                              |
| --------------------------------- | ----------------------------------- |
| `nhsuk-` prefixes in markup       | CSS targets Lily classes directly   |
| Tailwind, DaisyUI, Bootstrap      | no CSS framework dependency         |
| Re-implementing headless comps    | reference the sibling project       |
| `.razor.css` isolation in pages   | use the shared `wwwroot/css/nhs.css`|
| Blazor WebAssembly mode           | this app is Interactive Server      |

## 14. Tracking

- Package: `lily-design-system-blazor-web-examples`
- Version: 0.2.0
- App framework: Blazor Web App (.NET 10.0) Interactive Server
- Test runners: bUnit + Playwright
- Build: `dotnet build`
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause
- Contact: Joel Parker Henderson <joel@joelparkerhenderson.com>
- Canonical catalog: [../components.tsv](../components.tsv) — 407 components
- Root spec: [../spec.md](../spec.md)
- Sibling headless library: [../lily-design-system-blazor-headless/](../lily-design-system-blazor-headless/)
