# Blazor Server cookie example

End-to-end recipe for resolving the theme on the server (via a
cookie) so the first paint matches the user's choice — no flicker,
no prerender mismatch.

Files in this folder match a Blazor Web App layout. Drop them into
a Blazor Web App project under `Components/` and `Program.cs`.

| File                       | Role                                                              |
| -------------------------- | ----------------------------------------------------------------- |
| `Program.snippet.cs`       | DI + POST `/api/theme` endpoint that writes the cookie.           |
| `App.razor`                | Reads the `theme` cookie via `IHttpContextAccessor` and emits `<html data-theme="…">` + the matching `<link>`. |
| `SettingsPage.razor`       | Renders the picker, cascades the initial theme, posts to `/api/theme` on change. |

Required setup in your project:

1. Have theme CSS files at `wwwroot/assets/themes/<slug>.css`.
2. Configure `IHttpContextAccessor` in `Program.cs` (see
   `Program.snippet.cs`).

## Flow

```
browser → server: GET /  (Cookie: theme=dark)
                 IHttpContextAccessor.HttpContext reads cookie → "dark"
                 App.razor writes <html data-theme="dark"> + <link href="/.../dark.css">
                 SettingsPage mounts the picker with Value="dark" — no flicker
```

When the user changes themes, the picker's `OnChange` POSTs to
`/api/theme` so the next SSR request sees the new cookie.

## SSR caveat

Reading the `theme` cookie in `App.razor` requires `IHttpContextAccessor`,
which Blazor doesn't enable by default for component lifetime safety
reasons. The example registers it explicitly because the read happens
during the initial render, not inside a long-lived component.

## A simpler variant

If you only need client-side persistence and tolerate a one-frame
flash, drop the server bits and use `StorageKey`. The full Blazor
Server recipe exists for the case where flicker-free first paint
matters.
