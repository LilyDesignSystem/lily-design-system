# Share Picker

Label: '➤' U+27A4 Black Rightwards Arrowhead

Button:

```html
<button
  type="button"
  class="share-picker-button"
  aria-label="Share Picker"
  aria-expanded="false"
  aria-controls="share-picker-list"
>
  <span class="share-picker-icon" aria-hidden="true">➤</span>
</button>
```

List:

```html
<ul
  class="share-picker-list"
  id="share-picker-list"
  aria-label="Share Picker"
  hidden=""
></ul>
```

List item with share picker slug:

```html
<li class="share-picker-list-item">
  <button type="button" class="share-picker-copy-link">Copy link</button>
</li>
```

List items:

- Copy Link
- Email Link
- Share on LinkedIn
- Share on Bluesky
- Share on Threads
- Share on Reddit
- Share on Mastodon -> use mastodonshare.com
