<!--
    07. Wiring Paraglide JS (Inlang).

    Paraglide compiles each translation to a tree-shakeable function.
    Locale is set via `setLocale()` and read via `getLocale()`. The
    picker calls `setLocale` from its `onChange` callback.

    Prerequisites:
        pnpm add @inlang/paraglide-js
        npx @inlang/paraglide-js init
        // Compiles to ./src/lib/paraglide/

    Outcome: choosing a locale calls setLocale, which flips the
    runtime locale. Wrap UI in `{#key current}` to re-render bound
    message calls.
-->
<script lang="ts">
    import LocaleSelect from "../LocaleSelect.svelte";
    // import { setLocale, getLocale, type Locale } from "$lib/paraglide/runtime.js";
    // import * as m from "$lib/paraglide/messages.js";

    // Demo-only stand-ins so this file compiles without Paraglide installed.
    type Locale = string;
    let _internal = $state<Locale>("en");
    const getLocale = () => _internal;
    const setLocale = (l: Locale) => (_internal = l);
    const m = {
        greeting: () => `Hello (${_internal})`,
        body: () => `This page is currently in ${_internal}.`,
    };

    let current = $state<string>(getLocale());
</script>

<LocaleSelect
    label="Language"
    locales={["en", "fr", "ar"]}
    bind:value={current}
    onChange={(code) => setLocale(code as Locale)}
    storageKey="paraglide-locale"
/>

{#key current}
    <h1>{m.greeting()}</h1>
    <p>{m.body()}</p>
{/key}
