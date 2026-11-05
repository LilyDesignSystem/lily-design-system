# ScrollerVideo

a video-driven scrollytelling component with frame-by-frame scrubbing

This is the Angular headless implementation. See `components/scroller-video/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

```html
<lily-scroller-video
  src="/river.webm"
  label="The river"
  alt="A river from the air"
>
  <section>One</section>
</lily-scroller-video>
```

## Files

- `ScrollerVideo.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `ScrollerVideo.spec.ts` — vitest + TestBed render test
