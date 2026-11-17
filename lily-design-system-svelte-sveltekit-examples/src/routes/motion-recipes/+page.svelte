<script lang="ts">
    // Motion recipes (docs/patterns/motion, tasks.md P32-T3): five ways to animate Lily markup in the consumer's CSS, each
    // still under prefers-reduced-motion and each keeping a named WCAG criterion. e2e/motion-recipes.spec.ts checks them with
    // reduced motion emulated.
    import Header from "#lib/components/Header/Header.svelte";
    import BackLink from "#lib/components/BackLink/BackLink.svelte";

    const clinics = [
        "North Clinic",
        "South Clinic",
        "East Clinic",
        "West Clinic",
        "Central Clinic",
    ];

    let paused = $state(false);

    let waiting = $state(12);
    let valueEl: HTMLElement | undefined = $state(undefined);
    function addPatient() {
        waiting += 1;
        if (!valueEl) return;
        valueEl.removeAttribute("data-changed");
        void valueEl.offsetWidth; // restart the arrival animation
        valueEl.setAttribute("data-changed", "");
    }

    let demoTheme = $state("light");
    function applyTheme(apply: () => void) {
        const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
        const start = (document as Document & { startViewTransition?: (cb: () => void) => unknown })
            .startViewTransition;
        if (start && !reduce) start.call(document, apply);
        else apply();
    }
    function switchTheme() {
        applyTheme(() => (demoTheme = demoTheme === "light" ? "dark" : "light"));
    }
</script>

<svelte:head>
    <title>Motion recipes — Lily Design System</title>
</svelte:head>

<Header label="Site header">
    <div class="page-wrapper">
        <h1>Motion recipes</h1>
    </div>
</Header>

<main class="page-wrapper">
    <BackLink href="/">Back to examples</BackLink>
    <p>
        Lily components never move on their own. These five recipes animate them in this page's CSS,
        only when the browser does not ask for reduced motion, and say the same thing when they are
        still.
    </p>

    <h2>Marquee</h2>
    <section
        class="motion-marquee"
        aria-label="Our partner clinics"
        data-paused={paused ? "" : undefined}
    >
        <button
            type="button"
            class="button motion-marquee-pause"
            aria-pressed={paused}
            onclick={() => (paused = !paused)}
        >
            Pause the clinic list
        </button>
        <div class="motion-marquee-viewport">
            <div class="motion-marquee-track">
                <ul class="motion-marquee-list">
                    {#each clinics as clinic (clinic)}<li>{clinic}</li>{/each}
                </ul>
                <ul
                    class="motion-marquee-list"
                    aria-hidden="true"
                    inert
                >
                    {#each clinics as clinic (clinic)}<li>{clinic}</li>{/each}
                </ul>
            </div>
        </div>
    </section>

    <h2>A number that changes</h2>
    <div class="statistic motion-statistic">
        <span class="statistic-label">Patients waiting</span>
        <span
            class="statistic-value"
            aria-live="polite"
            bind:this={valueEl}>{waiting}</span
        >
    </div>
    <button
        type="button"
        class="button"
        onclick={addPatient}>Add a patient</button
    >

    <h2>Ease in on scroll</h2>
    <div class="motion-fade-in card">
        <p>
            This card rises into place as it scrolls into view, but it is never hidden or faded
            first.
        </p>
        <a href="#top-of-recipes">A link inside it</a>
    </div>

    <h2>Theme change transition</h2>
    <div
        class="motion-theme-box"
        data-demo-theme={demoTheme}
    >
        <p>This panel is in the {demoTheme} theme.</p>
    </div>
    <button
        type="button"
        class="button"
        onclick={switchTheme}>Switch the panel's theme</button
    >

    <h2>Terminal transcript</h2>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex (a scrolling code block is a tab stop so a keyboard can scroll it, WCAG 2.1.1) -->
    <pre
        class="code-block motion-terminal"
        tabindex="0"
        aria-label="Installing the Svelte catalog"><code
            ><kbd>npm install @lilydesignsystem/svelte-headless</kbd>
<samp>added 1 package in 2s</samp></code
        ></pre>
    <p id="top-of-recipes">Source: <code>docs/patterns/motion/index.md</code>.</p>
</main>

<style>
    /* Still (reduced motion, or paused): the items wrap and the copy is not drawn, so nothing is clipped (WCAG 1.4.10). */
    .motion-marquee-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem 2rem;
        margin: 0;
        padding-inline: 1rem;
        list-style: none;
    }
    .motion-marquee-list[aria-hidden="true"] {
        display: none;
    }
    @media (prefers-reduced-motion: no-preference) {
        .motion-marquee:not([data-paused]) .motion-marquee-viewport {
            overflow: hidden;
        }
        .motion-marquee:not([data-paused]) .motion-marquee-track {
            display: flex;
            inline-size: max-content;
            animation: motion-marquee 30s linear infinite;
        }
        .motion-marquee:not([data-paused]) .motion-marquee-list {
            flex-wrap: nowrap;
        }
        .motion-marquee:not([data-paused]) .motion-marquee-list[aria-hidden="true"] {
            display: flex;
        }
        .motion-marquee:hover .motion-marquee-track,
        .motion-marquee:focus-within .motion-marquee-track {
            animation-play-state: paused;
        }
        :global(.statistic-value[data-changed]) {
            animation: motion-statistic-arrive 300ms ease-out;
        }
        @supports (animation-timeline: view()) {
            .motion-fade-in {
                animation: motion-fade-in linear both;
                animation-timeline: view();
                animation-range: entry 0% cover 25%;
            }
        }
    }
    @media (prefers-reduced-motion: reduce) {
        :global(::view-transition-group(*)),
        :global(::view-transition-old(*)),
        :global(::view-transition-new(*)) {
            animation: none;
        }
    }
    .motion-fade-in:focus-within {
        animation: none;
    }
    .motion-statistic .statistic-value {
        display: inline-block;
    }
    .motion-theme-box {
        padding: 1rem;
        border: 1px solid currentColor;
    }
    .motion-theme-box[data-demo-theme="dark"] {
        background: #1f2937;
        color: #f9fafb;
    }
    .motion-terminal :global(kbd::before) {
        content: "$ " / "";
    }
    .motion-terminal {
        overflow-x: auto;
    }
    @keyframes motion-marquee {
        to {
            transform: translateX(-50%);
        }
    }
    @keyframes motion-statistic-arrive {
        from {
            transform: translateY(0.4em);
            opacity: 0.4;
        }
    }
    /* Move, never fade: text faded below full opacity fails contrast (WCAG 1.4.3) for as long as it is faint. */
    @keyframes motion-fade-in {
        from {
            transform: translateY(1.5rem);
        }
    }
</style>
