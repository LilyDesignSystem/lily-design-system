<script lang="ts">
    // Colour picker: the Svelte colour-picker helper in a form (spec/helpers, color-picker contract). The picker holds a
    // form value and keeps the recent colours in a bound array; the page paints the swatches with its own CSS, since the
    // helper ships none. e2e/color-picker.spec.ts checks it, and e2e/accessibility.spec.ts runs axe on it.
    //
    // The helper is not on npm yet, so the page imports it from its package directory in this monorepo. Once
    // @lilydesignsystem/svelte-color-picker is published, depend on it and import { ColorPicker } from the package.
    import Header from "#lib/components/Header/Header.svelte";
    import BackLink from "#lib/components/BackLink/BackLink.svelte";
    import Button from "#lib/components/Button/Button.svelte";
    import ColorPicker from "../../../../lily-design-system-svelte-color-picker/ColorPicker.svelte";

    const labels = {
        picker: "Highlight colour",
        recent: "Recent colours",
        palette: "Colours",
        transparent: "Transparent",
        custom: "Custom colour",
        hex: "Hex",
        name: "Colour name",
        hue: "Hue",
        saturation: "Saturation",
        lightness: "Lightness",
        brightness: "Brightness",
        hsl: "HSL",
        hsb: "HSB",
        rgb: "RGB",
        cmyk: "CMYK",
        red: "Red",
        green: "Green",
        blue: "Blue",
        cyan: "Cyan",
        magenta: "Magenta",
        yellow: "Yellow",
        key: "Black",
        invalid: "Not a colour. Enter a hex value such as #005eb8, or a CSS colour name.",
    };

    let colour = $state("#005eb8");
    let recent = $state<string[]>([]);
    let submitted = $state("");

    function onsubmit(event: SubmitEvent) {
        event.preventDefault();
        const data = new FormData(event.currentTarget as HTMLFormElement);
        submitted = String(data.get("highlight") ?? "");
    }
</script>

<svelte:head>
    <title>Colour picker — Lily Design System</title>
</svelte:head>

<Header label="Site header">
    <div class="page-wrapper">
        <h1>Colour picker</h1>
    </div>
</Header>

<main class="page-wrapper">
    <BackLink href="/">Back to examples</BackLink>

    <p>
        Choose a highlight colour from the palette, from your recent colours, or by entering it as a
        hex value, a CSS colour name, or HSL, HSB, RGB or CMYK numbers. Every swatch is a radio
        button with a name, so the colour is never shown by colour alone.
    </p>

    <form
        {onsubmit}
        onreset={() => (submitted = "")}
    >
        <ColorPicker
            {labels}
            bind:value={colour}
            bind:recent
            name="highlight"
            class="color-picker-example"
        />
        <div class="color-picker-example-actions">
            <Button type="submit">Save colour</Button>
            <Button type="reset">Start again</Button>
        </div>
    </form>

    <!-- The readout sits outside the form, as on /time-wheels: a form reset would reset an <output> inside it. -->
    <p class="color-picker-example-chosen">
        <span
            class="color-picker-example-sample"
            aria-hidden="true"
            style="--sample: {colour || 'transparent'}"
        ></span>
        Chosen: <output>{colour || "none"}</output>
    </p>

    {#if submitted}
        <p class="color-picker-example-submitted">Saved: {submitted}</p>
    {/if}
</main>

<style>
    :global(.color-picker-example) {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        max-inline-size: 40rem;
    }
    :global(.color-picker-example fieldset) {
        border: 0;
        margin: 0;
        padding: 0;
        min-inline-size: 0;
    }
    :global(.color-picker-example .color-picker-recent),
    :global(.color-picker-example .color-picker-palette-row) {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem;
    }
    :global(.color-picker-example .color-picker-palette) {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
    :global(.color-picker-example .color-picker-recent:empty) {
        min-block-size: 1.75rem;
    }
    :global(.color-picker-example .color-picker-swatch) {
        appearance: none;
        margin: 0;
        inline-size: 1.75rem;
        aspect-ratio: 1;
        border-radius: 0.25rem;
        border: 1px solid CanvasText;
        background: var(--color-picker-swatch);
        cursor: pointer;
    }
    :global(.color-picker-example .color-picker-swatch:checked) {
        box-shadow:
            0 0 0 2px Canvas,
            0 0 0 4px CanvasText;
    }
    :global(.color-picker-example .color-picker-swatch:focus-visible) {
        outline: 3px solid var(--lily-focus-ring, Highlight);
        outline-offset: 3px;
    }
    :global(.color-picker-example .color-picker-transparent) {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        align-self: flex-start;
        min-block-size: 2.75rem;
        padding-inline: 1rem;
    }
    :global(.color-picker-example .color-picker-transparent[aria-pressed="true"]) {
        font-weight: bold;
        box-shadow: 0 0 0 3px CanvasText;
    }
    :global(.color-picker-example .color-picker-separator) {
        inline-size: 100%;
        margin: 0;
    }
    :global(.color-picker-example .color-picker-custom) {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        align-items: flex-end;
    }
    :global(.color-picker-example .color-picker-custom input) {
        max-inline-size: 8rem;
    }
    :global(.color-picker-example .color-picker-custom fieldset input) {
        max-inline-size: 5rem;
    }
    .color-picker-example-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin-block-start: 1rem;
    }
    .color-picker-example-chosen {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    .color-picker-example-sample {
        display: inline-block;
        inline-size: 2rem;
        aspect-ratio: 1;
        border: 1px solid CanvasText;
        background: var(--sample);
    }
</style>
