# Motion Picker

Label: '⏸︎' U+23F8 Pause Sign + U+FE0E Variation Selector-15 (text presentation)

Same icon-button + listbox shape as Theme Picker, Locale Picker and
Text Size Picker. The one behavioural difference: the initial value
defers **unconditionally** to the platform's `(prefers-reduced-motion:
reduce)` media query when the consumer offers the `reduce` /
`no-preference` slugs — motion has a real accessibility signal
(WCAG 2.3.3), so deferring to it is the correct default, not an opt-in.

Button:

```html
<button
	type="button"
	class="motion-picker-button"
	aria-label="Motion Picker"
	aria-haspopup="listbox"
	aria-expanded="false"
	aria-controls="motion-picker-list"
><span class="motion-picker-icon" aria-hidden="true">⏸︎</span></button>
```

List:

```html
<ul
	class="motion-picker-list"
	id="motion-picker-list"
	role="listbox"
	aria-label="Motion Picker"
	tabindex="-1"
	hidden=""
>
```

List items:

```html
<li role="option" class="motion-picker-option" id="motion-picker-option-no-preference" aria-selected="true">No Preference</li>
<li role="option" class="motion-picker-option" id="motion-picker-option-reduce" aria-selected="false">Reduce</li>
```

Applies `data-motion="{slug}"` to the document root; consumer CSS/JS maps
the slug to whatever gets suppressed.
