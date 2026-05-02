# ScrollerBase

A low-level scroll-position tracking primitive for scrollytelling. Renders a `<div>` whose direct children are treated as steps; reports the index of the currently active step (via `IntersectionObserver`) and the overall scroll progress (0 at the top, 1 at the bottom) through optional callbacks.

The trigger line for "active step" sits at `offset` × viewport height from the top of the viewport.

## Props

- `className`: string (optional) — CSS class appended to `scroller-base`
- `label`: string (optional) — accessible label for the scroll region (`aria-label`)
- `offset`: number (default `0.5`) — trigger position within the viewport (0=top, 0.5=center, 1=bottom)
- `onIndexChange`: (index: number) => void — fired when the active step index changes
- `onProgressChange`: (progress: number) => void — fired when the overall scroll progress changes
- `children`: ReactNode (required) — step elements (each direct child element is one step)
- `...restProps`: unknown — additional attributes spread onto the `<div>`

## Usage

```tsx
const [step, setStep] = useState(0);
return (
  <ScrollerBase label="My story" onIndexChange={setStep}>
    <section>Step 1</section>
    <section>Step 2</section>
    <section>Step 3</section>
  </ScrollerBase>
);
```

## References

- IntersectionObserver API: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
- Reuters Graphics ScrollerBase
