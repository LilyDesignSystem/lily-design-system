# Locale Picker

Label: '🌐︎' U+1F310 Globe with Meridians

Button:

```html
<button 
	type="button" 
	class="locale-picker-button" 
	aria-label="Locale Picker" 
	aria-haspopup="listbox" 
	aria-expanded="false" 
	aria-controls="locale-picker-list"
><span class="locale-picker-icon" aria-hidden="true">🌐︎</span></button>
```

List:

```html
<ul 
	class="locale-picker-list" 
	id="locale-picker-list" 
	role="listbox" 
	aria-label="Locale Picker List" 
	tabindex="-1" 
	hidden=""
>
```

List item with locale picker option <slug>:

```html
<li 
	role="option"
	class="locale-picker-option"
	id="locale-picker-option-en-us"
	aria-selected="true"
>English (US)</li>
```
