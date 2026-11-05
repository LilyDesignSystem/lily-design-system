# CallToAction

a prominent prompt encouraging user action

This is the Angular headless implementation. See `components/call-to-action/index.md`
in the canonical repo root for the cross-framework documentation.

Without `href` it is a button; a native click bubbles to the host, so listen with `(click)`.

## Selector

```html
<lily-call-to-action href="/join">Join us</lily-call-to-action>
```

## Files

- `CallToAction.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `CallToAction.spec.ts` — vitest + TestBed render test
