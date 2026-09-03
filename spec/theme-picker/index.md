# Theme Picker

Label: '◑' U+25D1 Circle with Right Half Black

Button:

```html
<button 
	type="button" 
	class="theme-picker-button" 
	aria-label="Theme Picker" 
	aria-haspopup="listbox" 
	aria-expanded="false" 
	aria-controls="theme-picker-list"
><span class="theme-picker-icon" aria-hidden="true">◑</span></button>
```

List:

```html
<ul
	class="theme-picker-list"
	id="theme-picker-list"
	role="listbox"
	aria-label="Theme Picker List"
	tabindex="-1"
	hidden=""
>
```

List item with theme picker option <slug>:

```html
<li 
	role="option"
	class="theme-picker-option" 
	id="theme-picker-option-lorem-ipsum"
	aria-selected="false"
>Lorem Ipsum</li>
```
