<script lang="ts">
  const html: string = "<h1>BarcodeImage</h1>\n\n<p>A barcode-image is a visual machine-readable symbolic code image, such as a 1D linear barcode-image (UPC, EAN, Code 128) or a stacked symbology rendered as a flat image and scanned by a hardware or camera-based scanner. Typical uses include retail SKUs, inventory tracking, patient wristbands, shipping labels, ticket scanning, and library catalogs.</p>\n\n<p>This headless component renders a standard <code>&lt;img&gt;</code> element with class <code>barcode-image</code> whose <code>src</code> attribute carries the barcode-image image. Required <code>alt</code> text describes what the barcode-image encodes.</p>\n\n<h2>Props</h2>\n\n<ul>\n<li><code>src</code>: string (required) -- the barcode-image image URL or data-URL</li>\n<li><code>alt</code>: string (required) -- alternative text describing what the barcode-image encodes</li>\n<li><code>loading</code>: \"lazy\" | \"eager\" (optional) -- controls native browser loading behavior</li>\n<li><code>...restProps</code>: Any additional HTML attributes</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li><code>alt=\"...\"</code> -- provides the accessible name for the barcode-image image; required for all non-decorative images</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Use to display 1D linear barcode-images (UPC, EAN, Code 128, Code 39) generated as an image.</li>\n<li>Use for printed-and-scanned workflows: retail checkout, inventory, shipping, ticketing, library, patient identification.</li>\n<li>Use when the encoded value is best represented as a flat raster or vector image.</li>\n</ul>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>qr-code</code> — a QR code image generated from text or URL data</li>\n<li><code>image</code> — an image element with alt text</li>\n<li><code>icon</code> — a container for displaying an icon</li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<img class=\"barcode-image\" src=\"data:image/svg+xml;utf8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%2240%22%3E%3Crect width=%22160%22 height=%2240%22 fill=%22white%22/%3E%3C/svg%3E\" alt=\"Order number 12345\" />";
  const svelteSource: string = "// In your Svelte component:\nimport BarcodeImage from \"lily-design-system-svelte-headless/components/BarcodeImage/BarcodeImage.svelte\";\n\n<BarcodeImage src=\"/barcode-images/order-12345.svg\" alt=\"Order number 12345\" />\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>BarcodeImage — Lily Design System</title>
  <meta name="description" content="A visual machine-readable symbolic code image, such as for a scanner." />
</svelte:head>

<nav class="component-page-back" aria-label="Breadcrumb" style="max-width: 64rem; margin: 0 auto; padding: 1.5rem 1rem 0;">
  <a href="/components/">← All components</a>
</nav>

<article class="component-page prose" style="max-width: 64rem; margin: 0 auto; padding: 1rem 1rem 2rem;">
  {@html html}
</article>

<!-- BEGIN auto-generated component example -->
<section class="component-example" aria-labelledby="example-heading" style="max-width: 64rem; margin: 0 auto; padding: 0 1rem 2rem;">
  <h2 id="example-heading">Example</h2>
  <div class="component-example-rendered" style="padding: 1rem; border: 1px solid #d8dde0; border-radius: 0.5rem; background: #ffffff;">{@html demoHtml}</div>
  <details style="margin-top: 1rem;">
    <summary style="cursor: pointer; font-weight: 600;">Show Svelte source</summary>
    <pre style="overflow-x: auto; padding: 1rem; background: #f0f4f5; border-radius: 0.5rem;"><code>{svelteSource}</code></pre>
  </details>
</section>
<!-- END auto-generated component example -->
