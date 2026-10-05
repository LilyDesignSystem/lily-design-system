# ToolCall

## Metadata

- Component: tool-call
- PascalCase: ToolCall
- Description: a collapsible record of one tool invocation by an AI agent, with a name, a status word, and its input, output or error
- Status: beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows
- HTML tag: <details>
- CSS class: .tool-call
- Interactive: yes

## Key Behaviors

- The root of a tool-call record: a native `<details>` closed by default. Put `ToolCallName` and `ToolCallStatus` in the summary and `ToolCallInput`, `ToolCallOutput` or `ToolCallError` in the body.
- Spreads `restProps` onto the root; draws, times and animates nothing

## ARIA

- Native `<details>`/`<summary>` semantics; no ARIA role is added
- `aria-busy="true"` only while `status="running"`
- `data-status` is for consumer CSS; the visible status word (in `ToolCallStatus`) carries the meaning, never colour alone

## Keyboard

- Enter / Space on the native `<summary>` toggles

## Props

- `class`: string -- Appended to the base class
- `status`: string (optional) -- `pending`, `running`, `done` or `error`; sets `data-status`, and `aria-busy="true"` only while running
- `open`: boolean -- Whether expanded (bindable / `v-model` / `@bind-Open` / `open` attribute)
- `summary`: slot -- Summary content: name and status words
- `children`: slot -- The body
- `...restProps`: HTML attributes -- Spread onto the root `<details>`

## Acceptance Criteria

- [ ] Renders <details> with class="tool-call"
- [ ] Attribute behaviour as above
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.tool-call` in css-style-sheet-template.css
