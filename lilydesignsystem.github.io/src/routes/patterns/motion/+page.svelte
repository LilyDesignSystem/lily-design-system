<!--
  The motion recipes, from docs/patterns/motion/index.md (tasks.md P32-T3). Keep the two in step: edit the Markdown, then
  regenerate this page from it, then run bin/extract-site-pages. English only for now; translations would be machine drafts.
-->
<svelte:head>
    <title>Motion recipes — Lily Design System</title>
    <meta
        name="description"
        content="How to animate Lily components in your own CSS without costing anyone access: a marquee, a changing number, an ease-in on scroll, a theme transition and a terminal transcript, each still under reduced motion."
    />
</svelte:head>

<section class="page-intro">
    <h1 id="motion-title">Motion recipes</h1>
    <div class="page-intro-tagline">
        <p>
            How to animate Lily components in your own CSS without costing anyone access. Lily&#39;s
            headless components never move on their own (<a
                href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/AGENTS/accessibility.md"
                >AGENTS/accessibility.md</a
            >); motion is a choice your stylesheet makes, so these recipes are CSS and a few lines
            of script, not components. Each one names the WCAG criteria it keeps, and each has a
            <code>prefers-reduced-motion</code> fallback. The SvelteKit examples app shows all five
            at <code>/motion-recipes</code>, checked by
            <code>e2e/motion-recipes.spec.ts</code> with reduced motion emulated. Source:
            <a
                href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/lessons/magicui/index.md"
                >spec/lessons/magicui</a
            >.
        </p>
    </div>
</section>

<section
    class="prose"
    style="max-width: 64rem; margin: 0 auto; padding: 0 1rem 2rem;"
>
    <h2>Rules every recipe follows</h2>
    <ul>
        <li>
            <strong>Motion is opt in, never opt out.</strong> Write animations inside
            <code>@media (prefers-reduced-motion: no-preference)</code>, so a browser or user that
            asks for less motion gets none by default, and an old browser gets the still version.
        </li>
        <li>
            <strong>Reduced motion is not no information.</strong> The still version says everything the
            moving one does.
        </li>
        <li>
            <strong>Anything that moves for more than five seconds can be paused</strong> with a real
            control, not only by hovering (WCAG 2.2.2).
        </li>
        <li>
            <strong>Hover and focus parity.</strong> An effect shown on hover is shown on keyboard
            focus too (<code>:hover, :focus-visible</code>, or
            <code>:focus-within</code> for a group), or it is decoration only and carries no information
            or action (WCAG 2.1.1, 1.4.13).
        </li>
        <li>
            <strong>Never hide content to reveal it.</strong> Content waiting to animate in is still in
            the page, in the accessibility tree, readable and at full contrast; motion changes how it
            arrives, not whether it is there (WCAG 1.3.1, 1.4.3, 2.4.7).
        </li>
        <li>
            <strong>Copies are hidden once.</strong> A repeated copy made for a visual loop is
            <code>aria-hidden=&quot;true&quot;</code>
            and <code>inert</code>, so it is neither read twice nor reachable by Tab.
        </li>
        <li>
            <strong>Animated text keeps its real text.</strong> The value at rest is real text in
            the DOM; a live region announces only the value it lands on (the animated-text rule in
            <a
                href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/AGENTS/accessibility.md"
                >AGENTS/accessibility.md</a
            >).
        </li>
    </ul>
    <h2>Marquee</h2>
    <p>
        A strip of items that scrolls on its own: logos, partners, headlines. Lily has no <code
            >marquee</code
        > component (spec/lessons/magicui item 1 is a maintainer decision); this is the CSS-only version.
    </p>
    <pre><code class="language-html"
            >&lt;section
  class=&quot;marquee&quot;
  aria-label=&quot;Our partners&quot;
&gt;
  &lt;button
    type=&quot;button&quot;
    class=&quot;marquee-pause&quot;
    aria-pressed=&quot;false&quot;
  &gt;
    Pause the partner list
  &lt;/button&gt;
  &lt;div class=&quot;marquee-track&quot;&gt;
    &lt;ul class=&quot;marquee-list&quot;&gt;
      &lt;li&gt;North Clinic&lt;/li&gt;
      &lt;li&gt;South Clinic&lt;/li&gt;
      &lt;li&gt;East Clinic&lt;/li&gt;
    &lt;/ul&gt;
    &lt;ul
      class=&quot;marquee-list&quot;
      aria-hidden=&quot;true&quot;
      inert
    &gt;
      &lt;li&gt;North Clinic&lt;/li&gt;
      &lt;li&gt;South Clinic&lt;/li&gt;
      &lt;li&gt;East Clinic&lt;/li&gt;
    &lt;/ul&gt;
  &lt;/div&gt;
&lt;/section&gt;
</code></pre>
    <pre><code class="language-css"
            >/* Still (reduced motion, or paused): the items wrap and the copy is not drawn, so nothing is clipped. */
.marquee-list &#123;
  display: flex;
  flex-wrap: wrap;
&#125;
.marquee-list[aria-hidden=&quot;true&quot;] &#123;
  display: none;
&#125;
@media (prefers-reduced-motion: no-preference) &#123;
  .marquee:not([data-paused]) &#123;
    overflow: hidden;
  &#125;
  .marquee:not([data-paused]) .marquee-track &#123;
    display: flex;
    inline-size: max-content;
    animation: marquee 30s linear infinite;
  &#125;
  .marquee:not([data-paused]) .marquee-list &#123;
    flex-wrap: nowrap;
  &#125;
  .marquee:not([data-paused]) .marquee-list[aria-hidden=&quot;true&quot;] &#123;
    display: flex;
  &#125;
  .marquee:hover .marquee-track,
  .marquee:focus-within .marquee-track &#123;
    animation-play-state: paused;
  &#125;
&#125;
@keyframes marquee &#123;
  to &#123;
    transform: translateX(-50%);
  &#125;
&#125;
/* Right to left: scroll the other way. */
:dir(rtl) .marquee-track &#123;
  animation-direction: reverse;
&#125;
</code></pre>
    <pre><code class="language-js"
            >const marquee = document.querySelector(&quot;.marquee&quot;);
const pause = marquee.querySelector(&quot;.marquee-pause&quot;);
pause.addEventListener(&quot;click&quot;, () =&gt; &#123;
  const paused = pause.getAttribute(&quot;aria-pressed&quot;) !== &quot;true&quot;;
  pause.setAttribute(&quot;aria-pressed&quot;, String(paused));
  marquee.toggleAttribute(&quot;data-paused&quot;, paused);
&#125;);
</code></pre>
    <ul>
        <li>
            The first list is the content; the copy exists only to close the loop, so it is <code
                >aria-hidden</code
            >
            and <code>inert</code>.
        </li>
        <li>
            The pause button is a real toggle (<code>aria-pressed</code>) with the consumer&#39;s
            words, and it stops the motion for good, not only while the pointer rests on it (WCAG
            2.2.2). Hover and focus both pause it (parity).
        </li>
        <li>
            Under reduced motion, or once paused, the strip is still and its items wrap, so none is
            clipped at 320px (WCAG 1.4.10). Keeps: 1.4.10, 2.1.1, 2.2.2, 2.3.3.
        </li>
    </ul>
    <h2>A number that changes</h2>
    <p>
        A <code>statistic</code> whose value changes (a count of waiting patients, a total). The value
        is real text; the motion is a short slide of the new value, and the announcement is the final
        value, once.
    </p>
    <pre><code class="language-html"
            >&lt;div class=&quot;statistic&quot;&gt;
  &lt;span class=&quot;statistic-label&quot;&gt;Waiting&lt;/span&gt;
  &lt;span
    class=&quot;statistic-value&quot;
    aria-live=&quot;polite&quot;
    data-changed
    &gt;13&lt;/span
  &gt;
&lt;/div&gt;
</code></pre>
    <pre><code class="language-css"
            >@media (prefers-reduced-motion: no-preference) &#123;
  .statistic-value[data-changed] &#123;
    animation: statistic-arrive 300ms ease-out;
  &#125;
&#125;
@keyframes statistic-arrive &#123;
  from &#123;
    transform: translateY(0.4em);
    opacity: 0.4;
  &#125;
&#125;
</code></pre>
    <pre><code class="language-js"
            >function setValue(element, text) &#123;
  element.removeAttribute(&quot;data-changed&quot;);
  void element.offsetWidth; // restart the animation
  element.textContent = text; // the real value, at once
  element.setAttribute(&quot;data-changed&quot;, &quot;&quot;);
&#125;
</code></pre>
    <ul>
        <li>
            The text changes immediately; only its arrival moves, so a screen reader and a
            copy-paste always get the true value.
        </li>
        <li>
            Do not count up through every number in between: each one would be announced, or would
            be wrong for a moment. If you want rolling digits, draw them in an <code
                >aria-hidden</code
            > copy that is removed when it settles.
        </li>
        <li>Under reduced motion the number simply changes. Keeps: 2.3.3, 4.1.3.</li>
    </ul>
    <h2>Ease in on scroll, without hiding or fading anything</h2>
    <p>
        Content that rises into place as it scrolls into view (the &quot;fade-in&quot; of most
        libraries, without the fade). It is never removed, made invisible or faded first, so a
        reader, a search engine and a keyboard user who tabs to it see it at once, at full contrast.
    </p>
    <pre><code class="language-css"
            >@media (prefers-reduced-motion: no-preference) &#123;
  @supports (animation-timeline: view()) &#123;
    .ease-in &#123;
      animation: ease-in linear both;
      animation-timeline: view();
      animation-range: entry 0% cover 25%;
    &#125;
  &#125;
&#125;
.ease-in:focus-within &#123;
  animation: none;
&#125;
@keyframes ease-in &#123;
  from &#123;
    transform: translateY(1.5rem);
  &#125;
&#125;
</code></pre>
    <ul>
        <li>
            <strong>Move, do not fade.</strong> Text below full opacity fails contrast for as long as
            it is faint: body text faded to 0.35 measures about 2:1, and a link stays under 4.5:1 even
            at 0.75 (WCAG 1.4.3). If you must fade, fade a decorative layer, never the text.
        </li>
        <li>
            Never start from <code>visibility: hidden</code> or <code>display: none</code>, and
            apply the start state by the animation alone, so without support, without CSS or under
            reduced motion the content is simply there.
        </li>
        <li>
            A focused element inside is shown at once (<code>:focus-within</code>), so keyboard
            focus is never on something still moving (WCAG 2.4.7).
        </li>
        <li>
            No script, no IntersectionObserver class that a failed script would leave hidden. Keeps:
            1.3.1, 1.4.3, 2.3.3, 2.4.7.
        </li>
    </ul>
    <h2>Theme change transition</h2>
    <p>
        A short cross-fade when the theme changes, using the View Transition API. <code
            >theme-picker</code
        >
        will offer this as the opt-in
        <code>viewTransition</code> option (tasks.md P32-T4); until then, wrap your own apply step:
    </p>
    <pre><code class="language-js"
            >function applyTheme(apply) &#123;
  const reduce = matchMedia(&quot;(prefers-reduced-motion: reduce)&quot;).matches;
  if (document.startViewTransition &amp;&amp; !reduce) document.startViewTransition(apply);
  else apply();
&#125;
</code></pre>
    <pre><code class="language-css"
            >::view-transition-old(root),
::view-transition-new(root) &#123;
  animation-duration: 200ms;
&#125;
@media (prefers-reduced-motion: reduce) &#123;
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) &#123;
    animation: none;
  &#125;
&#125;
</code></pre>
    <ul>
        <li>
            The theme is applied the same way either way; the transition only changes how the switch
            looks.
        </li>
        <li>Without the API, or under reduced motion, the theme changes at once. Keeps: 2.3.3.</li>
    </ul>
    <h2>Terminal transcript</h2>
    <p>
        A record of commands and their output, as on an install page. Input lines are <code
            >&lt;kbd&gt;</code
        >, output lines <code>&lt;samp&gt;</code>, and the prompt is CSS-generated text, so copying
        a command never copies the prompt.
    </p>
    <pre><code class="language-html"
            >&lt;pre
  class=&quot;code-block terminal&quot;
  tabindex=&quot;0&quot;
  aria-label=&quot;Installing the Svelte catalog&quot;
&gt;&lt;code&gt;&lt;kbd&gt;npm install @lilydesignsystem/svelte-headless&lt;/kbd&gt;
&lt;samp&gt;added 1 package in 2s&lt;/samp&gt;&lt;/code&gt;&lt;/pre&gt;
</code></pre>
    <pre><code class="language-css"
            >.terminal kbd::before &#123;
  content: &quot;$ &quot; / &quot;&quot;;
&#125;
</code></pre>
    <ul>
        <li>
            <code>content: &quot;$ &quot; / &quot;&quot;</code> gives the prompt an empty alternative
            text, so a screen reader does not read &quot;dollar&quot; before every command.
        </li>
        <li>
            The block scrolls inside itself (<code>tabindex=&quot;0&quot;</code>, a name), not the
            page (WCAG 1.4.10).
        </li>
        <li>
            No typing effect. If you add one, it follows the animated-text rule: the full command is
            real text at rest, the effect is an
            <code>aria-hidden</code> copy, and under reduced motion there is none. Keeps: 1.3.1, 1.4.10,
            2.3.3.
        </li>
    </ul>
    <h2>Sources</h2>
    <ul>
        <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html"
                >WCAG 2.2: Pause, Stop, Hide (2.2.2)</a
            >,
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html"
                >Animation from Interactions (2.3.3)</a
            >,
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html"
                >Content on Hover or Focus (1.4.13)</a
            >
        </li>
        <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion"
                >MDN: prefers-reduced-motion</a
            >,
            <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations"
                >scroll-driven animations</a
            >,
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API"
                >View Transition API</a
            >
        </li>
        <li>
            <a href="https://magicui.design/">Magic UI</a> (the components these recipes answer),
            reviewed in
            <a
                href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/lessons/magicui/index.md"
                >spec/lessons/magicui</a
            >
        </li>
    </ul>
</section>
