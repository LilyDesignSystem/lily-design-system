# ScrollerBase

A low-level scroll position tracking primitive for scrollytelling.

See `components/scroller-base/index.md` for canonical documentation.

Each direct child is a step, current when it crosses the line `Offset` of the way down the viewport. `ScrollerBase.razor.js` watches the page, and sends progress at most once a frame.

## Parameters

- `Label`: string
- `Offset`: double, default 0.5
- `OnIndexChange`: EventCallback<int>; `OnProgressChange`: EventCallback<double>
- `ChildContent` — the steps; `CssClass`, `AdditionalAttributes`

## Usage

```razor
<ScrollerBase OnIndexChange="@(i => step = i)">
    <section>One</section>
    <section>Two</section>
</ScrollerBase>
```
