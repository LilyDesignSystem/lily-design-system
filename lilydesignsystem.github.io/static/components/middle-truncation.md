# MiddleTruncation

A string shortened in the middle to fit the width its container gives it, keeping the start and the end: `quarterly-rep…final-3.pdf`. Use it for file names, URLs, identifiers, hashes and e-mail addresses, where the end carries as much meaning as the start and a trailing ellipsis would cut off the part that matters.

**Status:** experimental — implemented and unit-tested in all nine headless catalogs (2026-10-23). Blazor, Nunjucks and plain HTML differ in how they measure; see "Per-library notes".

## Implementation Notes

- Renders `<span class="middle-truncation {class}" data-strategy>` holding `.middle-truncation-visual` (`aria-hidden="true"`, the shortened string) and `.middle-truncation-full` (the whole text)
- The width is measured in the browser with canvas text metrics in the root's computed font and compared with the root's `clientWidth`; a `ResizeObserver` re-measures (at most once per animation frame)
- Until measured, on the server, and when the root has no layout width, the full text is shown, so nothing is lost without JavaScript
- Cuts on grapheme clusters (`Intl.Segmenter`, falling back to code points), never inside a surrogate pair or an emoji sequence
- `data-truncated` is present while the text is shortened
- The algorithm is the pure `truncateMiddle()` in `shared/middle-truncation.ts`; it takes the measuring function as an argument, so it is tested without a browser

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `class` | string | `""` | Appended to the base class |
| `text` | string (required) | — | The full text |
| `ellipsis` | string (required) | — | The cut marker. No default: the headless layer ships no text, and the marker differs by language and context |
| `strategy` | `"even"` \| `"fixed-end"` \| `"min-end"` | `"even"` | How the room is shared |
| `end` | number | — | Characters kept at the end for `fixed-end` and `min-end` |
| `...restProps` | HTML attributes | — | Spread onto the root `<span>` |

## Usage

```svelte
<MiddleTruncation text="quarterly-report-final-version-3.pdf" ellipsis="…" strategy="min-end" end={6} />
```

```css
/* consumer CSS */
.middle-truncation { display: block; overflow: hidden; white-space: nowrap; }
.middle-truncation-full {
  position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap;
}
```

## Per-library notes

- **Svelte, React, Vue, Angular, Web Components, Alpine** measure in the browser exactly as described above; each carries a copy of `shared/middle-truncation.ts` (the Alpine copy is the same module with its types stripped). Angular has no rest-props spread; Web Components take `text`, `ellipsis`, `strategy` and `end` as attributes.
- **HTML**: the snippet's `<script>` finds every `.middle-truncation`, reads the full text from `.middle-truncation-full` and `data-ellipsis` / `data-strategy` / `data-end`, and measures in the browser. The algorithm inside the script is generated from the shared module between its `BEGIN`/`END` markers.
- **Nunjucks**: a server cannot measure, so the macro renders the markup and data attributes only (the HTML script, or the Web Components element, then shortens in the browser); `shortened` takes text computed on the server.
- **Blazor**: no JS interop, so no pixel measuring. `MaxCharacters` is a budget of user-perceived characters, ellipsis included, and the same strategies apply; without it the full text is shown.

## Keyboard Interactions

None. The component is not interactive.

## ARIA

- The shortened string is `aria-hidden="true"`; assistive technology, find-in-page and copy get the full text from `.middle-truncation-full`
- No role and no `aria-label`; the text is the content
- A `title` attribute is not used: it reaches hovering pointers only, not keyboard, touch or screen-reader users

## When to Use

- A file name, URL, hash, identifier or e-mail address in a bounded space where the end matters as much as the start
- A table cell or list row of unpredictable text length that must stay on one line
- When the full text must stay reachable by screen readers and copy

## When Not to Use

- Use CSS `text-overflow: ellipsis` — when cutting the end is fine and no JavaScript is wanted
- Use `Tooltip` or `HoverCard` — when the full text should appear on demand; combine with this component, do not replace it
- Use a wrapped or multi-line layout — when the text can simply take more room
- Do not use it for prose: a sentence cut in the middle is unreadable

## Headless

This component decides the text and its structure only: which characters stay, and that the full text remains in the accessibility tree. It decides no width, font, colour or hiding; the consumer's CSS supplies the bounded block and the visually hidden full text.

## Styles

The 57 reference themes style `.middle-truncation` as a bounded one-line block and hide `.middle-truncation-full` with the clip-rect pattern. In your own CSS, target `.middle-truncation` (the bounded block), `.middle-truncation-visual` and `.middle-truncation-full` (visually hide this one, never `display: none`). `[data-truncated]` styles the shortened state, and `[data-strategy]` the strategy. No default styles are included.

## Testing

- Base class first, then the consumer class
- The visual text is shortened to the measured width and re-measured on resize, changing only the visual string
- The shortened text is `aria-hidden`; the full text is not
- Each strategy keeps the right characters; `end` of 0 keeps none; a width below the ellipsis still returns the ellipsis
- Grapheme clusters are never split
- Full text when it fits or when there is no layout width
- Rest props reach the root

## Advice

Pass the ellipsis in the reader's language and writing system (`…` is not right everywhere). For a file name, `min-end` with `end` set to the extension plus a few characters keeps `.pdf` readable. Measure in the font actually used: load web fonts first, or the width is measured in a fallback and the result is a little off until the next resize.

The measure uses the root's own font, so do not put a different font on the inner spans.

## Related components

- `tooltip`
- `hover-card`
- `clipboard-copy-button` — copy the full value
- `code`

## References

- [MDN: Intl.Segmenter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)
- [MDN: CanvasRenderingContext2D.measureText()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/measureText)
- [WCAG 1.4.4 Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html)

---

Lily™ and Lily Design System™ are trademarks.
