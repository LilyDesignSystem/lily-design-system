# Sheet

A panel that slides in from a screen edge as an overlay.

See `components/sheet/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `Open`: bool (default false) — whether the panel is shown; two-way bindable with `@bind-Open`; Escape sets it to false
- `Side`: "left" | "right" | "top" | "bottom" (default "right") — exposed as `data-side`
- `CssClass`: string — extra CSS classes appended to `sheet`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<Sheet Label="..." @bind-Open="isOpen">
    Content
</Sheet>
```

## Modality

While `Open` is true it renders a native `<dialog aria-modal="true">` opened with `showModal()` through JS interop
(the collocated `Drawer.razor.js` module, shared by Drawer, Sheet and SlideOutDrawer): the page behind it is inert,
Tab stays inside it, Escape (keydown or the native `cancel` event) closes it, and focus returns to the element that
had it when it opened. The interop runs after render, so during prerender the dialog stays closed.
