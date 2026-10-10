# Server rendering

The macro renders everything the page needs on the server: the button, the tooltip text, and the panel with **your content**
(the `{% call %}` body), which is present in the HTML whether or not JavaScript runs.

Without JavaScript the panel stays `hidden` and cannot be opened — a disclosure needs script. If something in the panel must
work without it (a link to the site map, say), render it outside the picker as well, or render the panel open with
`open: true` and style it as a plain block.

With JavaScript, load `menu-picker.client.js` once and call `autoInit()`; it wires every `[data-lily-menu-picker-root]`.
Nothing runs during rendering, so there is no hydration step and no server/client mismatch.
