# SvelteKit cookie example

End-to-end recipe for sending the page in the user's theme from the
server, via the cookie the picker keeps (`lily-theme` by default), so the first
paint matches the user's choice: no flicker, no hydration mismatch.

Files in this folder match SvelteKit's filesystem-routing convention.
Drop them under `src/routes/` in a SvelteKit project.

| File                | Role                                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------ |
| `hooks.server.ts`   | Reads the `lily-theme` cookie with `readThemeCookie`, fills `data-theme` and the `<link>`. |
| `+layout.server.ts` | Exposes the choice to all routes.                                                          |
| `+layout.svelte`    | Renders the picker with `systemLabel` and the default cookie.                              |
| `+page.svelte`      | A trivial page that demonstrates the result.                                               |
| `app.html.snippet`  | The `%theme%` and `%theme-links%` placeholders for `src/app.html`.                         |

Required setup in your project:

1. Have theme CSS files at `static/assets/themes/<slug>.css`.
2. Add `theme: string` to your `App.Locals` interface in
   `src/app.d.ts`.

## Flow

```
browser → server: GET /  (Cookie: lily-theme=dark)
                 hooks.server.ts: readThemeCookie → "dark"
                 the page is sent with <html data-theme="dark"> and dark.css linked
                 +layout.server.ts returns { theme: "dark" } to the client
                 the picker hydrates with value="dark": nothing changes on screen
```

When the user chooses, the picker writes the cookie itself
(`lily-theme=<choice>; Path=/; Max-Age=34560000; SameSite=Lax`, `Secure` on
https); no endpoint is needed. A choice of "Follow this device" is kept
as `lily-theme=system`: the server links both themes by
`prefers-color-scheme`, and the picker follows the device from then on.
