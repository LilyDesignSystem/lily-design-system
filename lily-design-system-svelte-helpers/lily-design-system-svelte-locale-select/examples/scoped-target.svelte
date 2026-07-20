<!--
    Scoped target — change locale of one region, not the whole page.

    Useful for multilingual content panels: a single page with three
    cards each in a different language. Pass `target={cardEl}` so the
    select writes lang/dir to that element instead of <html>.

    Outcome: the surrounding page stays in its document language; the
    chosen panel switches independently. Three panels each scoped to
    their own select.
-->
<script lang="ts">
    import LocaleSelect from "../LocaleSelect.svelte";

    let panelA: HTMLElement | null = $state(null);
    let panelB: HTMLElement | null = $state(null);

    let aLocale = $state("en");
    let bLocale = $state("fr");
</script>

<article>
    <h1>Document language stays English; panels switch independently.</h1>

    <section bind:this={panelA} class="panel">
        <h2>Panel A</h2>
        <LocaleSelect
            label="Panel A language"
            locales={["en", "fr", "ar"]}
            target={panelA}
            bind:value={aLocale}
        />
        <p>Current panel locale: <code>{aLocale}</code></p>
    </section>

    <section bind:this={panelB} class="panel">
        <h2>Panel B</h2>
        <LocaleSelect
            label="Panel B language"
            locales={["en", "fr", "ar"]}
            target={panelB}
            bind:value={bLocale}
        />
        <p>Current panel locale: <code>{bLocale}</code></p>
    </section>
</article>
