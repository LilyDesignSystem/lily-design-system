# ContentsLink

One table of contents link.

See `components/contents-link/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `contents-link`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ContentsLink>
    Content
</ContentsLink>
```

## Count

`countLabel` (with an optional `count`) shows a visible, localised count inside the link, after the text, so the link's
accessible name includes it; `count` sets `data-count` (and `data-complete` at 0). The count is text, never colour alone
(WCAG 1.4.1), and an `aria-label` replaces the whole name, so include the count in it if you set one.
See the canonical `components/contents-link/index.md`.
