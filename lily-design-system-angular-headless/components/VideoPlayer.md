# VideoPlayer

a video player with play-in-view behavior, custom controls, and IntersectionObserver support

This is the Angular headless implementation. See `components/video-player/index.md`
in the canonical repo root for the cross-framework documentation.

Project custom controls with the `controls` attribute and a caption with the `caption` attribute. `autoplay` means play while in view.

## Selector

```html
<lily-video-player src="/tour.webm" label="Product tour" [autoplay]="true" [muted]="true" />
```

## Files

- `VideoPlayer.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `VideoPlayer.spec.ts` — vitest + TestBed render test
