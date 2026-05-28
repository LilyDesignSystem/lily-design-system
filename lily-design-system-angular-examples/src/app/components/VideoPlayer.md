# VideoPlayer

a video player with play-in-view behavior, custom controls, and IntersectionObserver support

This is the Angular headless implementation. See `components/video-player/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

```html
<lily-video-player></lily-video-player>
```

## Files

- `VideoPlayer.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `VideoPlayer.spec.ts` — vitest + TestBed render test
