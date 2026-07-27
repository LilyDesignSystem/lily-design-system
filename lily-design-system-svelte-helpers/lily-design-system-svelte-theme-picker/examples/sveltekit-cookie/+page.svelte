<h1>SvelteKit cookie theme demo</h1>

<p>
  The select in the layout writes the active theme to a cookie. On the
  next request, the server reads the cookie and inlines
  <code>data-theme</code> on <code>&lt;html&gt;</code> before the page
  is sent — so the first paint already matches your choice.
</p>
