## Text Size Picker

Label: 'A' U+0041 Latin Capital Letter A

Button:

```html
<button
	type="button"
	class="text-size-picker-button"
	aria-label="Text Size Picker"
	aria-haspopup="listbox"
	aria-expanded="false"
	aria-controls="text-size-picker-list"
><span class="text-size-picker-icon" aria-hidden="true">A</span></button> 
```

List:

```html
<ul 
	class="text-size-picker-list"
	id="text-size-picker-list"
	role="listbox"
	aria-label="Text Size Picker"
	tabindex="-1"
	hidden=""
>
```

List items:

```html
<li role="option" class="text-size-picker-option" id="text-size-picker-option-largest" aria-selected="false">Largest</li>
<li role="option" class="text-size-picker-option" id="text-size-picker-option-larger" aria-selected="false">Larger</li>
<li role="option" class="text-size-picker-option" id="text-size-picker-option-large" aria-selected="false">Large</li>
<li role="option" class="text-size-picker-option" id="text-size-picker-option-medium" aria-selected="false">Medium</li>
<li role="option" class="text-size-picker-option" id="text-size-picker-option-small" aria-selected="false">Small</li>
<li role="option" class="text-size-picker-option" id="text-size-picker-option-smaller" aria-selected="false">Smaller</li>
<li role="option" class="text-size-picker-option" id="text-size-picker-option-smallest" aria-selected="false">Smallest</li>
```
