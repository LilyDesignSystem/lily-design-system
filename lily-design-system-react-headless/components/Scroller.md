# Scroller

A scrollytelling container with a sticky `background` that updates as the foreground steps scroll past. Built on top of `ScrollerBase`: each direct child of the foreground is a step that drives the active index, and the consumer renders different background content based on that index.

## Structure

The component renders three regions inside the wrapper:

- `.scroller` — outer wrapper with optional `aria-label`
- `.scroller-background` — sticky region with `aria-live="polite"`; consumer applies `position: sticky` in CSS
- `.scroller-foreground` — column containing scrollable step children (this is the `ScrollerBase`)

## Props

- `className`: string (optional) — CSS class appended to `scroller`
- `label`: string (optional) — accessible label for the scroller region
- `offset`: number (default `0.5`) — step trigger position in the viewport
- `onIndexChange`: (index: number) => void — fired when the active step index changes
- `onProgressChange`: (progress: number) => void — fired with overall scroll progress (0..1)
- `children`: ReactNode (required) — foreground step content (each direct child element is one step)
- `background`: ReactNode (required) — sticky background content that changes with the active step
- `...restProps`: unknown — additional attributes spread onto the wrapper `<div>`

## Usage

```tsx
const [step, setStep] = useState(0);
const visuals = [<Map zoom={1} />, <Map zoom={3} />, <Map zoom={5} />];
return (
  <Scroller
    label="A scrolling map story"
    background={visuals[step]}
    onIndexChange={setStep}
  >
    <section><h2>Step 1</h2><p>...</p></section>
    <section><h2>Step 2</h2><p>...</p></section>
    <section><h2>Step 3</h2><p>...</p></section>
  </Scroller>
);
```

## References

- IntersectionObserver API: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
- Reuters Graphics Scroller
