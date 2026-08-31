# Migrating from NHS.UK frontend to Lily

_Prepared 2026-08-29 (plan P5-T4) against NHS.UK frontend v9.x — v10 is
in pre-release; re-check this table when it goes stable, the same
trigger [spec/theme](../../spec/theme/index.md) records for the theme
stylesheet. This is a naming and structure map, not a compatibility
layer — Lily is not a drop-in replacement for `nhsuk-frontend`; see
[COMPARISONS.md](../../COMPARISONS.md)._

## How to read this table

- **nhsuk-frontend class** is what you're grepping for in your
  templates today.
- **Lily component** is the PascalCase name and kebab-case slug; follow
  the link to its full contract (element, ARIA, keyboard, props).
- Markup is **not** a like-for-like swap. Lily is headless: you keep
  the semantic structure and behaviour, and write the CSS yourself
  (or start from one of the six NHS reference themes under
  [`themes/`](../../themes/) — England/Scotland/Wales, patient and
  practitioner variants).

## Component mapping

### Form elements

| nhsuk-frontend | Lily component | Notes |
| --- | --- | --- |
| Buttons | [`Button`](../../components/button/) | |
| Character count | — | **Gap** — compose `TextArea` + your own live region |
| Checkboxes | [`CheckboxInput`](../../components/checkbox-input/) | |
| Date input | [`DateInput`](../../components/date-input/) | For a calendar-dialog picker, see the [`date-time-picker` helper](../../AGENTS/helpers.md) |
| Error message | [`ErrorMessage`](../../components/error-message/) | |
| Error summary | [`ErrorSummary`](../../components/error-summary/) | |
| Fieldset | [`Fieldset`](../../components/fieldset/) | |
| File upload | [`FileUpload`](../../components/file-upload/) | |
| Hint text | [`Hint`](../../components/hint/) | |
| Password input | [`PasswordInput`](../../components/password-input/) | |
| Radios | [`RadioInput`](../../components/radio-input/) | |
| Search input | [`SearchInput`](../../components/search-input/) | |
| Select | [`Select`](../../components/select/) | |
| Text input | [`TextInput`](../../components/text-input/) | |
| Textarea | — | **Gap** — check the current catalog; if genuinely absent, [request it](../../RFC.md) |

### Content presentation

| nhsuk-frontend | Lily component | Notes |
| --- | --- | --- |
| Card | [`Card`](../../components/card/) | |
| Details | [`Details`](../../components/details/) | Native `<details>`; see also [`Expander`](../../components/expander/) for a styled non-native disclosure |
| Do and Don't lists | [`DoList`](../../components/do-list/) / [`DontList`](../../components/dont-list/) | Two components, one per list type; each with its own `*ListItem` |
| Expander | [`Expander`](../../components/expander/) | |
| Images | [`Figure`](../../components/figure/) | |
| Inset text | [`InsetText`](../../components/inset-text/) | |
| Notification banners | [`Notification`](../../components/notification/) | |
| Panel | [`Panel`](../../components/panel/) | |
| Review date | [`ReviewDate`](../../components/review-date/) | |
| Summary list | [`SummaryList`](../../components/summary-list/) | Family: `SummaryList` + `SummaryListItem` |
| Table | [`Table`](../../components/table/) | Family includes `TableHead`/`TableBody`/`TableFoot`/`TableRow`/`TableTH`/`TableTD` |
| Tabs | [`TabBar`](../../components/tab-bar/) | |
| Tag | [`Tag`](../../components/tag/) | See also [`StatusTag`](../../components/status-tag/) |
| Task list | [`TaskList`](../../components/task-list/) | |
| Warning callout | [`WarningCallout`](../../components/warning-callout/) | |

### Navigation

| nhsuk-frontend | Lily component | Notes |
| --- | --- | --- |
| Action link | [`ActionLink`](../../components/action-link/) | |
| Back link | [`BackLink`](../../components/back-link/) | |
| Breadcrumbs | [`BreadcrumbNav`](../../components/breadcrumb-nav/) | Family: `BreadcrumbNav` + `BreadcrumbList` + `BreadcrumbListItem` |
| Contents list | [`ContentsNav`](../../components/contents-nav/) | Family: `ContentsNav` + `ContentsList` + `ContentsListItem` |
| Footer | [`Footer`](../../components/footer/) | Generic; NHS branding is your CSS |
| Header | [`Header`](../../components/header/) | Generic; NHS branding is your CSS |
| Pagination | [`PaginationNav`](../../components/pagination-nav/) | |
| Skip link | [`SkipLink`](../../components/skip-link/) | |

**36 of 38 map directly; 2 are open catalog gaps** (character count,
textarea) worth an [RFC](../../RFC.md) rather than a workaround, unlike
GOV.UK's gaps, none of which is a page-level pattern here — NHS.UK's
component list is more consistently component-shaped than GOV.UK's.

## National identifiers (NHS-specific, no upstream equivalent)

nhsuk-frontend has no equivalent to Lily's 92 national personal
identifier components — including the ten UK-specific ones (NHS
number, and identifiers for other UK nations and territories). See
[spec/national-identifiers](../../spec/national-identifiers/index.md).

## What Lily has that NHS.UK doesn't

Lily's catalog is 491 components against NHS.UK's 38; most of the
difference is scope NHS.UK doesn't attempt. See
[COMPARISONS.md](../../COMPARISONS.md) for the honest positioning.

---

Lily™ and Lily Design System™ are trademarks. Not affiliated with or
endorsed by NHS England, NHS Digital, or NHS.UK.
