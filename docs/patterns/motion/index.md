# Motion recipes

How to animate Lily components in your own CSS without costing anyone access. Lily's headless components never move on their
own ([AGENTS/accessibility.md](../../../AGENTS/accessibility.md)); motion is a choice your stylesheet makes, so these recipes are
CSS and a few lines of script, not components. Each one names the WCAG criteria it keeps, and each has a
`prefers-reduced-motion` fallback. The SvelteKit examples app shows all five at `/motion-recipes`, checked by
`e2e/motion-recipes.spec.ts` with reduced motion emulated. Source: [spec/lessons/magicui](../../../spec/lessons/magicui/index.md).

## Rules every recipe follows

- **Motion is opt in, never opt out.** Write animations inside `@media (prefers-reduced-motion: no-preference)`, so a browser or
  user that asks for less motion gets none by default, and an old browser gets the still version.
- **Reduced motion is not no information.** The still version says everything the moving one does.
- **Anything that moves for more than five seconds can be paused** with a real control, not only by hovering (WCAG 2.2.2).
- **Hover and focus parity.** An effect shown on hover is shown on keyboard focus too (`:hover, :focus-visible`, or
  `:focus-within` for a group), or it is decoration only and carries no information or action (WCAG 2.1.1, 1.4.13).
- **Never hide content to reveal it.** Content waiting to animate in is still in the page, in the accessibility tree, readable and at
  full contrast; motion changes how it arrives, not whether it is there (WCAG 1.3.1, 1.4.3, 2.4.7).
- **Copies are hidden once.** A repeated copy made for a visual loop is `aria-hidden="true"` and `inert`, so it is neither read
  twice nor reachable by Tab.
- **Animated text keeps its real text.** The value at rest is real text in the DOM; a live region announces only the value it lands
  on (the animated-text rule in [AGENTS/accessibility.md](../../../AGENTS/accessibility.md)).

## Marquee

A strip of items that scrolls on its own: logos, partners, headlines. Lily has no `marquee` component (spec/lessons/magicui item 1
is a maintainer decision); this is the CSS-only version.

```html
<section
  class="marquee"
  aria-label="Our partners"
>
  <button
    type="button"
    class="marquee-pause"
    aria-pressed="false"
  >
    Pause the partner list
  </button>
  <div class="marquee-track">
    <ul class="marquee-list">
      <li>North Clinic</li>
      <li>South Clinic</li>
      <li>East Clinic</li>
    </ul>
    <ul
      class="marquee-list"
      aria-hidden="true"
      inert
    >
      <li>North Clinic</li>
      <li>South Clinic</li>
      <li>East Clinic</li>
    </ul>
  </div>
</section>
```

```css
/* Still (reduced motion, or paused): the items wrap and the copy is not drawn, so nothing is clipped. */
.marquee-list {
  display: flex;
  flex-wrap: wrap;
}
.marquee-list[aria-hidden="true"] {
  display: none;
}
@media (prefers-reduced-motion: no-preference) {
  .marquee:not([data-paused]) {
    overflow: hidden;
  }
  .marquee:not([data-paused]) .marquee-track {
    display: flex;
    inline-size: max-content;
    animation: marquee 30s linear infinite;
  }
  .marquee:not([data-paused]) .marquee-list {
    flex-wrap: nowrap;
  }
  .marquee:not([data-paused]) .marquee-list[aria-hidden="true"] {
    display: flex;
  }
  .marquee:hover .marquee-track,
  .marquee:focus-within .marquee-track {
    animation-play-state: paused;
  }
}
@keyframes marquee {
  to {
    transform: translateX(-50%);
  }
}
/* Right to left: scroll the other way. */
:dir(rtl) .marquee-track {
  animation-direction: reverse;
}
```

```js
const marquee = document.querySelector(".marquee");
const pause = marquee.querySelector(".marquee-pause");
pause.addEventListener("click", () => {
  const paused = pause.getAttribute("aria-pressed") !== "true";
  pause.setAttribute("aria-pressed", String(paused));
  marquee.toggleAttribute("data-paused", paused);
});
```

- The first list is the content; the copy exists only to close the loop, so it is `aria-hidden` and `inert`.
- The pause button is a real toggle (`aria-pressed`) with the consumer's words, and it stops the motion for good, not only while
  the pointer rests on it (WCAG 2.2.2). Hover and focus both pause it (parity).
- Under reduced motion, or once paused, the strip is still and its items wrap, so none is clipped at 320px (WCAG 1.4.10). Keeps:
  1.4.10, 2.1.1, 2.2.2, 2.3.3.

## A number that changes

A `statistic` whose value changes (a count of waiting patients, a total). The value is real text; the motion is a short slide of
the new value, and the announcement is the final value, once.

```html
<div class="statistic">
  <span class="statistic-label">Waiting</span>
  <span
    class="statistic-value"
    aria-live="polite"
    data-changed
    >13</span
  >
</div>
```

```css
@media (prefers-reduced-motion: no-preference) {
  .statistic-value[data-changed] {
    animation: statistic-arrive 300ms ease-out;
  }
}
@keyframes statistic-arrive {
  from {
    transform: translateY(0.4em);
    opacity: 0.4;
  }
}
```

```js
function setValue(element, text) {
  element.removeAttribute("data-changed");
  void element.offsetWidth; // restart the animation
  element.textContent = text; // the real value, at once
  element.setAttribute("data-changed", "");
}
```

- The text changes immediately; only its arrival moves, so a screen reader and a copy-paste always get the true value.
- Do not count up through every number in between: each one would be announced, or would be wrong for a moment. If you want rolling
  digits, draw them in an `aria-hidden` copy that is removed when it settles.
- Under reduced motion the number simply changes. Keeps: 2.3.3, 4.1.3.

## Ease in on scroll, without hiding or fading anything

Content that rises into place as it scrolls into view (the "fade-in" of most libraries, without the fade). It is never removed,
made invisible or faded first, so a reader, a search engine and a keyboard user who tabs to it see it at once, at full contrast.

```css
@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .ease-in {
      animation: ease-in linear both;
      animation-timeline: view();
      animation-range: entry 0% cover 25%;
    }
  }
}
.ease-in:focus-within {
  animation: none;
}
@keyframes ease-in {
  from {
    transform: translateY(1.5rem);
  }
}
```

- **Move, do not fade.** Text below full opacity fails contrast for as long as it is faint: body text faded to 0.35 measures about
  2:1, and a link stays under 4.5:1 even at 0.75 (WCAG 1.4.3). If you must fade, fade a decorative layer, never the text.
- Never start from `visibility: hidden` or `display: none`, and apply the start state by the animation alone, so without support,
  without CSS or under reduced motion the content is simply there.
- A focused element inside is shown at once (`:focus-within`), so keyboard focus is never on something still moving (WCAG 2.4.7).
- No script, no IntersectionObserver class that a failed script would leave hidden. Keeps: 1.3.1, 1.4.3, 2.3.3, 2.4.7.

## Theme change transition

A short cross-fade when the theme changes, using the View Transition API. `theme-picker` will offer this as the opt-in
`viewTransition` option (tasks.md P32-T4); until then, wrap your own apply step:

```js
function applyTheme(apply) {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (document.startViewTransition && !reduce) document.startViewTransition(apply);
  else apply();
}
```

```css
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 200ms;
}
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation: none;
  }
}
```

- The theme is applied the same way either way; the transition only changes how the switch looks.
- Without the API, or under reduced motion, the theme changes at once. Keeps: 2.3.3.

## Terminal transcript

A record of commands and their output, as on an install page. Input lines are `<kbd>`, output lines `<samp>`, and the prompt is
CSS-generated text, so copying a command never copies the prompt.

```html
<pre
  class="code-block terminal"
  tabindex="0"
  aria-label="Installing the Svelte catalog"
><code><kbd>npm install @lilydesignsystem/svelte-headless</kbd>
<samp>added 1 package in 2s</samp></code></pre>
```

```css
.terminal kbd::before {
  content: "$ " / "";
}
```

- `content: "$ " / ""` gives the prompt an empty alternative text, so a screen reader does not read "dollar" before every command.
- The block scrolls inside itself (`tabindex="0"`, a name), not the page (WCAG 1.4.10).
- No typing effect. If you add one, it follows the animated-text rule: the full command is real text at rest, the effect is an
  `aria-hidden` copy, and under reduced motion there is none. Keeps: 1.3.1, 1.4.10, 2.3.3.

## Sources

- [WCAG 2.2: Pause, Stop, Hide (2.2.2)](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html),
  [Animation from Interactions (2.3.3)](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html),
  [Content on Hover or Focus (1.4.13)](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html)
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion),
  [scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations),
  [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)
- [Magic UI](https://magicui.design/) (the components these recipes answer), reviewed in
  [spec/lessons/magicui](../../../spec/lessons/magicui/index.md)

---

Lily™ and Lily Design System™ are trademarks.
