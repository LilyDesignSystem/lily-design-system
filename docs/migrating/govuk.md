# Migrating from GOV.UK Frontend to Lily

_Prepared 2026-08-29 (plan P5-T4) against GOV.UK Frontend v6 (see
[spec/theme](../../spec/theme/index.md) for the palette this project
tracks). This is a naming and structure map, not a compatibility
layer — Lily is not a drop-in replacement for `govuk-frontend`; see
[COMPARISONS.md](../../COMPARISONS.md)._

## How to read this table

- **govuk-frontend class** is what you're grepping for in your
  templates today.
- **Lily component** is the PascalCase name and kebab-case slug; follow
  the link to its full contract (element, ARIA, keyboard, props).
- Markup is **not** a like-for-like swap. Lily is headless: you keep
  the semantic structure and behaviour, and write the CSS yourself
  (or start from [`themes/united-kingdom-government-digital-service.css`](../../themes/united-kingdom-government-digital-service.css),
  refreshed to the v6.0.0 palette).

## Component mapping

| govuk-frontend | Lily component | Notes |
| --- | --- | --- |
| Accordion | [`AccordionNav`](../../components/accordion-nav/) | Family: `AccordionNav` + `AccordionList` + `AccordionListItem` |
| Back link | [`BackLink`](../../components/back-link/) | |
| Breadcrumbs | [`BreadcrumbNav`](../../components/breadcrumb-nav/) | Family: `BreadcrumbNav` + `BreadcrumbList` + `BreadcrumbListItem` |
| Button | [`Button`](../../components/button/) | |
| Character count | — | **Gap** — no dedicated component; compose `TextArea` + your own live region, or request one ([RFC.md](../../RFC.md)) |
| Checkboxes | [`CheckboxInput`](../../components/checkbox-input/) | |
| Cookie banner | — | **Gap** — compose `Banner` + `Button`; no cookie-consent-specific behaviour is provided (headless components own no persistence, [AGENTS/headless.md](../../AGENTS/headless.md)) |
| Date input | [`DateInput`](../../components/date-input/) | For a full date *picker* (calendar dialog), see the [`date-time-picker` helper](../../AGENTS/helpers.md) instead |
| Details | [`Details`](../../components/details/) | Native `<details>`; see also [`Expander`](../../components/expander/) if you want a styled, non-native disclosure |
| Error message | [`ErrorMessage`](../../components/error-message/) | |
| Error summary | [`ErrorSummary`](../../components/error-summary/) | |
| Exit this page | — | **Gap** — this is a safety *pattern* (rapid navigate-away + history scrub), not a component; compose `Button` + your own navigation logic |
| Feedback | — | **Gap** — a page pattern, not a component; compose `Form` + `Field` |
| Fieldset | [`Fieldset`](../../components/fieldset/) | |
| File upload | [`FileUpload`](../../components/file-upload/) | |
| Generic header / GOV.UK header | [`Header`](../../components/header/) | Lily's `Header` is generic; GOV.UK's crown-and-service-name branding is your CSS and markup inside it |
| GOV.UK footer | [`Footer`](../../components/footer/) | Generic; branding is yours |
| Inset text | [`InsetText`](../../components/inset-text/) | |
| Language navigation | — | **Gap as a component** — use the [`locale-picker` helper](../../AGENTS/helpers.md) instead, which owns the full `lang`/`dir` application GOV.UK's pattern only markup-sketches |
| Notification banner | [`Notification`](../../components/notification/) | |
| Pagination | [`PaginationNav`](../../components/pagination-nav/) | Family: `PaginationNav` + `PaginationList` + `PaginationListItem` |
| Panel | [`Panel`](../../components/panel/) | |
| Password input | [`PasswordInput`](../../components/password-input/) | |
| Phase banner | [`PhaseBanner`](../../components/phase-banner/) | |
| Radios | [`RadioInput`](../../components/radio-input/) | |
| Select | [`Select`](../../components/select/) | |
| Service navigation | [`NavigationMenu`](../../components/navigation-menu/) | |
| Skip link | [`SkipLink`](../../components/skip-link/) | |
| Summary list | [`SummaryList`](../../components/summary-list/) | Family: `SummaryList` + `SummaryListItem` |
| Table | [`Table`](../../components/table/) | Family: `Table` + `TableHead` + `TableBody` + `TableFoot` + `TableRow` + `TableTH` + `TableTD` |
| Tabs | [`TabBar`](../../components/tab-bar/) | |
| Tag | [`Tag`](../../components/tag/) | See also [`StatusTag`](../../components/status-tag/) |
| Task list | [`TaskList`](../../components/task-list/) | Family: `TaskList` + `TaskListItem` |
| Text input | [`TextInput`](../../components/text-input/) | |
| Textarea | — | **Gap** — check the current catalog; if genuinely absent, [request it](../../RFC.md) |
| Warning text | [`WarningCallout`](../../components/warning-callout/) | |

**31 of 37 map directly; 6 are gaps** — three are page-level *patterns*
GOV.UK documents alongside its components rather than components
themselves (exit-this-page, feedback, cookie banner — compose them from
primitives), one is better served by a Lily *helper* than a component
(language navigation → `locale-picker`), and two (character count,
textarea) are open catalog gaps worth an RFC.

## What Lily has that GOV.UK doesn't

Lily's catalog is 491 components against GOV.UK's 37; most of the
difference is scope GOV.UK doesn't attempt — editorial/scrollytelling
primitives, data visualisation, 92 national personal identifier
components, kanban/gantt table families. See
[COMPARISONS.md](../../COMPARISONS.md) for the honest positioning
rather than a component-count boast.

---

Lily™ and Lily Design System™ are trademarks. Not affiliated with or
endorsed by GDS or the Government Digital Service.
