# Lifecycle — LocaleSelect (Blazor)

The Blazor-flavoured walk-through of the select's lifecycle. The
canonical contract is in [`../spec/index.md`](../spec/index.md) §5; this file
maps the Svelte canonical's `$effect` lifecycle to Blazor's
`OnAfterRenderAsync`.

## Lifecycle diagram

```
mount (server-side render of markup)
  │
  ▼
SSR / prerender produces the <div> + <button> + hidden <ul role="listbox"> markup
— no DOM mutation, no IJSRuntime call.
  │
  ▼
interactivity activates (Blazor Server circuit, or WASM loaded)
  │
  ▼
OnAfterRenderAsync(firstRender: true) ─► resolve initial value
  │                                       (props.Value > storage > navigator (if DetectFromNavigator)
  │                                        > DefaultValue > "en" > Locales[0])
  │                                       │
  │                                       ▼
  │                                     if resolved != Value:
  │                                         Value = resolved
  │                                         await ValueChanged.InvokeAsync(Value)
  │                                         StateHasChanged()
  │                                     await ApplyLocaleAsync(resolved)
  │
  ▼
ApplyLocaleAsync(code):
  1. JS eval: document.documentElement.setAttribute('lang', Bcp47LocaleTag(code))
  2. JS eval: if ApplyDir: document.documentElement.setAttribute('dir', IsRtlLocale(code) ? 'rtl' : 'ltr')
  3. JS eval: if StorageKey: localStorage.setItem(StorageKey, code)
  4. await OnChange.InvokeAsync(code)  — consumer-form, not BCP 47 normalised

user activates the button (click, ArrowDown / ArrowUp / Enter / Space)
  │
  ▼
OpenList(startIndex?) ─► _open = true
  │                      _activeIndex = startIndex ?? selected ?? 0
  │                      _focusListPending = true; _suppressFocusOut = true
  │                      StateHasChanged()
  │                      │
  │                      ▼
  │                    OnAfterRenderAsync ─► _listElement.FocusAsync()
  │                      (deferred: the <ul> cannot take focus while it
  │                       still carries `hidden`)
  ▼
user picks a different option (click on <li>, or Enter / Space on the active one)
  │
  ▼
ChooseAsync(index) ─► CloseList()  ─► _open = false; _activeIndex = -1
  │                    │               _focusButtonPending = true
  │                    │               _suppressFocusOut = true
  │                    │               StateHasChanged()
  │                    │               │
  │                    │               ▼
  │                    │             OnAfterRenderAsync ─► _buttonElement.FocusAsync()
  │                    ▼
  │                  SetLocaleAsync(next)
  │                    │
  │                    ▼
  │                  Value = next
  │                  await ValueChanged.InvokeAsync(Value)
  │                  await ApplyLocaleAsync(next)
  │                  StateHasChanged()
```

`Escape` runs `CloseList()` without a `SetLocaleAsync`; `Tab` runs
`CloseList(refocus: false)` so focus moves on; the root's `focusout`
does the same. Because both pending-focus flags are consumed inside
`OnAfterRenderAsync`, a focus move never races the `hidden` toggle.

## Why `OnAfterRenderAsync`, not `OnInitializedAsync`

`OnInitializedAsync` runs during prerender; `IJSRuntime` isn't
guaranteed available there and a call would throw
`InvalidOperationException`. `OnAfterRenderAsync(firstRender)` is the
canonical hook for "run once the DOM is interactive" work.

## Initial-value resolution

```csharp
private async Task<string> ResolveInitialAsync()
{
    if (!string.IsNullOrEmpty(Value)) return Value;

    if (!string.IsNullOrEmpty(StorageKey))
    {
        try
        {
            var stored = await JS.InvokeAsync<string?>("eval",
                $"(function(){{try{{return localStorage.getItem({JsonString(StorageKey!)});}}catch(e){{return null;}}}})()");
            if (!string.IsNullOrEmpty(stored)) return stored!;
        }
        catch { }
    }

    if (DetectFromNavigator)
    {
        try
        {
            var langs = await JS.InvokeAsync<string[]?>("eval",
                "(function(){try{if(navigator.languages&&navigator.languages.length>0)return Array.from(navigator.languages);if(navigator.language)return [navigator.language];return [];}catch(e){return [];}})()");
            if (langs is not null)
            {
                var match = Locales.MatchNavigatorLanguage(langs, Locales);
                if (!string.IsNullOrEmpty(match)) return match;
            }
        }
        catch { }
    }

    if (!string.IsNullOrEmpty(DefaultValue)) return DefaultValue!;
    if (Locales.Count == 0) return "";
    foreach (var l in Locales) if (l == "en") return "en";
    return Locales[0];
}
```

## Apply

```csharp
public async Task SetLocaleAsync(string code)
{
    if (string.IsNullOrEmpty(code)) return;
    if (code == Value) { await ApplyLocaleAsync(code); return; }
    Value = code;
    await ValueChanged.InvokeAsync(Value);
    await ApplyLocaleAsync(code);
    StateHasChanged();
}

private async Task ApplyLocaleAsync(string code)
{
    var script = BuildApplyScript(code, ApplyDir, StorageKey);
    try { await JS.InvokeVoidAsync("eval", script); } catch { }
    await OnChange.InvokeAsync(code);
}
```

`SetLocaleAsync` is `public` so consumers can drive the control from
their own UI — hold a `@ref` to the component and call it. It is not
reachable from `LocaleSelectContext`, which now carries only `Value`,
`Open`, and `LabelFor`.

## Why one giant `eval` call per change

Each `InvokeVoidAsync` call is a round-trip over SignalR (Blazor
Server) or a WASM boundary crossing (Blazor WebAssembly). Bundling
three DOM mutations into one JS evaluation makes the change atomic
and cheap:

1. Set `lang` on `<html>`.
2. Set `dir` on `<html>` (if `ApplyDir`).
3. Persist to `localStorage` (if `StorageKey`).

A consumer who wants finer-grained interop can bypass the component
and write `lang` / `dir` themselves, but the default path is one
round-trip per change.

## Why `OnChange` emits the consumer form, not the BCP 47 form

The `lang` attribute on the DOM is normalised to BCP 47 hyphen
form, but the `OnChange` payload (and the bindable `Value`)
preserves the consumer's original form (`en_US` if the consumer
put `en_US` in `Locales`). This keeps round-trips lossless and
lets the consumer's i18n library — which might use the underscore
form internally — receive the same string it stored.

## Reactivity

Only `Value` triggers re-apply. Other parameters (`Locales`,
`ApplyDir`, `DetectFromNavigator`) are read inside the apply
function on every fire, so changes take effect on the next value
change, not retroactively.

If a consumer wants to re-apply when `ApplyDir` toggles, they can
write back to `Value`:

```csharp
private async Task ToggleApplyDir()
{
    applyDir = !applyDir;
    var current = locale;
    locale = "";
    await Task.Yield();
    locale = current;
}
```

## SSR

During static SSR (Blazor Web App with non-interactive render
mode), `OnAfterRenderAsync` never fires. The select's markup
arrives with whatever `Value` the consumer passed; no DOM mutation
occurs because there is no DOM yet — just an HTML response.

That's the recipe for flicker-free SSR: pre-resolve the locale on
the server (cookie), write `lang="…"` and `dir="…"` on `<html>` in
`App.razor`, and pass the resolved code as `Value`. See
[`./ssr.md`](./ssr.md).

## Unmount

The component does not clean up `lang` / `dir` on unmount. That's
intentional: the select may be unmounted because the consumer
navigated away from a settings page; the locale should stay
applied.

## Watch vs the navigator-detection helper

`Locales.MatchNavigatorLanguage` is only called inside
`OnAfterRenderAsync(true)`. The select never re-runs detection
mid-session — the user's choice should win over `navigator.languages`
once expressed. If a consumer wants to re-detect (e.g. on a
settings reset), they can call the exported helper manually and
write the result to the bound `Value`.

## State machine summary

| State           | Trigger                                       | Effect                                              |
| --------------- | --------------------------------------------- | --------------------------------------------------- |
| `_initialised = false` | construction                            | Select is ready to render its markup.               |
| `OnAfterRenderAsync(true)` | first interactive render             | Resolve initial value, apply, fire callbacks.       |
| `_initialised = true` | after first render                       | Future renders skip the initial-value path.         |
| `_open = true`  | button click / `ArrowDown` / `ArrowUp` / `Enter` / `Space` | Show the list, seed `_activeIndex`, queue focus onto the `<ul>`. |
| `_open = false` | selection, `Escape`, `Tab`, or root `focusout` | Hide the list, clear `_activeIndex` and the typeahead buffer; queue focus back onto the button unless `refocus: false`. |
| `SetLocaleAsync(code)` | option chosen, or a consumer `@ref` call  | Mutate state, fire callbacks, apply, re-render.     |
| dispose / unmount | parent removed from render tree              | No-op; locale persists.                              |
