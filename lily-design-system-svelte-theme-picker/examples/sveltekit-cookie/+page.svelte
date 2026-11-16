<h1>SvelteKit cookie theme demo</h1>

<p>
    The picker in the layout keeps your choice in a cookie. On the next request the server reads it
    and sends <code>data-theme</code> on <code>&lt;html&gt;</code> and the theme's stylesheet with the
    page, so the first paint already matches your choice. "Follow this device" links the light and dark
    themes by media query, so the browser chooses until the picker takes over.
</p>
