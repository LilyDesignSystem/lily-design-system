<h1>SvelteKit cookie text-size demo</h1>

<p>
  The picker in the layout writes the active size to a cookie. On the
  next request, the server reads the cookie and inlines
  <code>data-text-size</code> on <code>&lt;html&gt;</code> before the
  page is sent — so the first paint already matches your choice, with
  no post-hydration reflow.
</p>
