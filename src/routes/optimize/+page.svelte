<svelte:head>
    <title>Optimize a Lily application — Lily Design System</title>
    <meta
        name="description"
        content="Keep a Lily application small: copy markup for zero runtime cost, import only the components you use, understand each catalog's package format, and measure the resulting bundle."
    />
</svelte:head>

<section class="page-intro">
    <h1>Optimize a Lily application</h1>
    <p class="page-intro-tagline">
        Import only what the page uses, load one theme, and measure the built application—not the
        size of Lily's full catalog on disk.
    </p>
</section>

<section
    class="section prose"
    style="margin: 0 auto; max-width: 64rem;"
>
    <h2>Start with the smallest adoption path</h2>
    <p>
        Copying a component's semantic HTML adds no JavaScript dependency and no runtime beyond the
        markup itself. Choose a headless package when framework props, state, focus management, or
        keyboard behaviour save more code than the import costs. Choose a helper only when you need
        the complete interaction it owns.
    </p>

    <h2>Import the components you use</h2>
    <p>
        The JavaScript packages declare <code>sideEffects: false</code>, so a production bundler may
        discard unused exports. Prefer named imports and verify the production output; do not use
        the full installed footprint as a bundle estimate.
    </p>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <pre tabindex="0"><code
            >{`import { Button, Field, EmailInput } from "@lilydesignsystem/react-headless";`}</code
        ></pre>
    <p>
        Svelte ships compiled component files so the consumer's compiler can optimize them. Vue
        emits per-component chunks. React bundles its catalog into a small number of ESM files.
        Those packaging differences make file counts incomparable; the application bundle after
        tree-shaking is the useful result.
    </p>

    <h2>Measured package sizes</h2>
    <p>
        These are npm registry <code>unpackedSize</code> measurements from 26 August 2026, recorded
        in the repository's
        <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/BENCHMARKS.md"
            >benchmark report</a
        >. They measure the installed package before bundling, not bytes sent to a user.
    </p>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <div
        role="region"
        aria-label="Measured Lily package sizes"
        tabindex="0"
        style="overflow-x: auto;"
    >
        <table>
            <thead
                ><tr><th>Package</th><th>Measured version</th><th>Unpacked</th><th>Files</th></tr
                ></thead
            >
            <tbody>
                <tr
                    ><td><code>@lilydesignsystem/svelte-headless</code></td><td>0.3.0</td><td
                        >1,364 KB</td
                    ><td>987</td></tr
                >
                <tr
                    ><td><code>@lilydesignsystem/vue-headless</code></td><td>0.3.0</td><td
                        >660 KB</td
                    ><td>496</td></tr
                >
                <tr
                    ><td><code>@lilydesignsystem/react-headless</code></td><td>0.3.0</td><td
                        >572 KB</td
                    ><td>5</td></tr
                >
                <tr
                    ><td><code>@lilydesignsystem/react-theme-picker</code></td><td>0.1.0</td><td
                        >38 KB</td
                    ><td>4</td></tr
                >
                <tr
                    ><td><code>@lilydesignsystem/svelte-date-time-picker</code></td><td>0.1.0</td
                    ><td>82 KB</td><td>6</td></tr
                >
            </tbody>
        </table>
    </div>
    <p>
        The 0.3.0 packaging work reduced the installed React and Svelte packages by 80% and Vue by
        75% compared with 0.2.0. No current benchmark yet reports minified and compressed
        application bundles for 10, 50, and 200 components; do not turn the installed figures above
        into that claim.
    </p>

    <h2>Load one theme</h2>
    <p>
        Load one stylesheet from <code>@lilydesignsystem/themes</code>. The theme picker swaps the
        <code>href</code> of one managed link, so changing theme fetches one replacement stylesheet rather
        than loading all 63. If you own the visual design, a stylesheet containing only the hooks you
        use can be smaller still; Lily's planned CSS slicer is not shipped.
    </p>

    <h2>Measure the production build</h2>
    <ol>
        <li>Build in production mode with source maps reported separately.</li>
        <li>
            Record minified and compressed sizes for the same application before and after the Lily
            imports.
        </li>
        <li>
            Inspect the bundle graph for unused barrel exports and duplicate framework runtimes.
        </li>
        <li>
            Test interaction and rendering on the slowest supported device; bytes alone do not
            measure responsiveness.
        </li>
        <li>
            Record tool, framework, browser, hardware, versions, and date so another person can
            reproduce the result.
        </li>
    </ol>

    <h2>Pin pre-1.0 versions</h2>
    <p>
        Lily remains pre-1.0, so a minor release may contain a breaking change. Pin exact package
        versions and review the changelog before updating. The documentation will not offer a
        version switcher until a first stable 1.0 release exists; a switcher with only unstable
        snapshots would imply a support promise the project does not make.
    </p>
</section>
