# Lily Design System™ - Solid Headless: specification

## Summary

A tenth headless catalog, for Solid 2.0 (released 2026-11-17): the 637 catalog components as Solid components, with the
same root elements, class hooks, ARIA, keyboard contracts and no English defaults as the other catalogs. Requested by the
maintainer on 2026-11-17; tracked in the root [tasks.md](../../tasks.md) as Phase 36.

## Scope

- In scope: `components/{Name}.tsx` for every row of [components.tsv](../../components.tsv), each with tests; a typed barrel and a
  built package (`@lilydesignsystem/solid-headless`); the root `bin/` checks that already cover the other catalogs.
- Later phases, not this subproject: Solid helper packages (`lily-design-system-solid-*`), a Solid example app, and the
  `lily-design-system-solid-*-skill` packages.
- Out of scope: SolidStart (retired by Solid 2.0), Solid 1.x compatibility.

## Decisions

1. **Solid 2.0 only.** `solid-js` and `@solidjs/web` ^2.0.0 as peers. Solid 1 has a different props and effects API
   (`splitProps`, `mergeProps`, `onMount`, `createResource`), and supporting both would double every stateful component.
2. **Ported from the React catalog**, the nearest in syntax (JSX), by `bin/convert-react-to-solid.py` for the components
   with no hooks, then by hand. The React tests are ported with them, so each component meets the same assertions.
3. **`class`, not `className`**, matching Solid, Svelte, Vue and HTML.
4. **`attr()` for ARIA and data booleans.** Solid renders a boolean attribute value as presence; the catalog's
   contract is `aria-pressed="false"`, which React, Vue and Svelte render. Every non-literal `aria-*` / `data-*`
   value that can be boolean goes through `components/attr.ts`.
5. **Text inputs listen to `input`** and keep the public `onChange` prop, so a value reaches the consumer per keystroke
   as in the other catalogs.
6. **Testing:** Vitest 5 in jsdom with `@solidjs/vite-plugin` 3 and `@solidjs/testing-library` 1.0.0-rc.2, the first
   release that supports Solid 2 (a release candidate; move to 1.0.0 when it ships).
7. **No Storybook yet.** Storybook has no Solid 2 framework package; revisit when one exists.

## Status (2026-11-17)

- 488 of 637 components ported; 2,901 tests passing; `tsc --noEmit` clean; ESLint 0 errors; Prettier clean.
- Not published (`"private": true`); no build or barrel yet.

## Remaining components (149)

These use internal state, effects, refs, `useId` or form reset, or compose one that does: `AccordionCheckbox`, `AccordionListItem`, `ActionBar`, `ActionGroup`, `AiLabel`, `AlertDialog`, `Autosuggest`, `Avatar`, `AvatarImage`, `AvatarText`, `Banner`, `BodyMap`, `BodyText`, `CalendarDayTable`, `CalendarMonthTable`, `CalendarTable`, `CalendarWeekTable`, `CalendarYearTable`, `Caption`, `Carousel`, `Cascader`, `CharacterCounter`, `ChatNav`, `CheckboxInput`, `ClipboardCopyButton`, `Coachmark`, `Code`, `Collapsible`, `Combobox`, `Command`, `Container`, `ContainerWithFixedWidth`, `ContainerWithFluidWidth`, `ContentsNav`, `ContextMenu`, `ContextualHelp`, `DataTable`, `DateField`, `DecisionSupportCard`, `Details`, `Dial`, `Dialog`, `Diff`, `DoList`, `DoListItem`, `DontList`, `Drawer`, `DropdownMenu`, `Editable`, `Emoji`, `EndNotes`, `ErrorSummary`, `Expander`, `Field`, `Figure`, `FileDialog`, `FileTree`, `FileUpload`, `FiveFaceRatingView`, `FlexStack`, `FloatingPanel`, `Footnote`, `GanttTable`, `GoToTop`, `GovernmentBanner`, `GrailLayout`, `Grid`, `HamburgerMenu`, `Headline`, `Hero`, `HorizontalScroller`, `HoverCard`, `IconButton`, `IconList`, `ImageCropper`, `InsetText`, `InternationalPatientSummary`, `InternationalPatientSummarySection`, `KanbanTable`, `KbdShortcut`, `Listbox`, `MedicalBanner`, `MedicationView`, `MentionsInput`, `Menu`, `MenuBar`, `MenuItem`, `MiddleTruncation`, `MultiSelect`, `MultiSelectWithExtras`, `NavigationMenu`, `NumericRatingScalePicker`, `ObservationView`, `Panel`, `PasswordInputOrTextInputDiv`, `PinInputDiv`, `PopconfirmDialog`, `Popover`, `Popup`, `QuantityInputDiv`, `RangeFieldset`, `RepeatableFieldset`, `ScrollBar`, `Scroller`, `ScrollerBase`, `ScrollerVideo`, `SectionHeading`, `SegmentGroup`, `Sheet`, `ShowMore`, `Sidebar`, `SignaturePad`, `Skeleton`, `SlideOutDrawer`, `SliderButton`, `Sonner`, `SplitButton`, `Splitter`, `SplitView`, `SwitchButton`, `TabBar`, `Table`, `TableBody`, `TableFoot`, `TableHead`, `TableRow`, `TagGroup`, `TaskBar`, `TaskList`, `TaskListItem`, `TextAreaInputWithCharacterCounter`, `ThemeProvider`, `ThemeView`, `Thinking`, `TileMap`, `TimeoutDialog`, `Timer`, `TimerButton`, `ToggleButton`, `ToolBar`, `ToolCall`, `Tooltip`, `TreeList`, `TreeMenu`, `TreeNav`, `TreeSelect`, `VideoPlayer`, `Visible`, `WheelPicker`.

## Tasks

- [ ] **S1** Port the 149 remaining components by hand, with their tests (including a Solid `form-reset.ts`).
      Verify: every row of `components.tsv` has `components/{Name}.tsx` and a passing test.
- [ ] **S2** `build.mjs`: generate the `index.ts` barrel and build `dist/` (Solid's compiled output plus types and the
      `solid` export condition). Verify: a scratch consumer imports and renders a component.
- [ ] **S3** Add the catalog to the root checks (`bin/check-class-names`, `check-html-tags`, `check-coverage`,
      `check-dev-warnings`, `check-built-english`, `check-identifier-inputs`, `check-port-data-attributes`) and to CI's
      headless matrix. Verify: `bin/test` and CI cover `lily-design-system-solid-headless`.
- [ ] **S4** Publish `@lilydesignsystem/solid-headless` 0.1.0 (maintainer approval).

## Acceptance criteria

- [ ] 637 components, each root element the contract's HTML tag, base class first.
- [ ] Every component's React tests pass in their Solid form.
- [ ] No hardcoded English; no CSS; rest props spread on the root.
- [ ] The package builds, and a consumer can import it.

## Sources

- [Solid 2.0 announcement](https://www.solidjs.com/blog/solid-2-0-the-long-hold/)
- The types of `solid-js` 2.0.0, `@solidjs/signals` and `@solidjs/web` 2.0.0, for `merge`, `omit`, `createEffect`,
  `onSettled`, `createUniqueId` and `dynamic`.

---

Lily™ and Lily Design System™ are trademarks.
