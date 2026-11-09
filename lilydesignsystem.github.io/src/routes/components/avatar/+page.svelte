<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>Avatar</h1>\n<p>An avatar circle is a component that displays a user&#39;s profile image or fallback initials within a circular frame, commonly used to represent a user identity in apps, websites, and social platforms. This visual element provides a quick, recognizable way for users to identify themselves or others, often appearing in headers, comments, chat interfaces, and account menus.</p>\n<p><strong>Status:</strong> stable — exercised in composed page flows under e2e and axe, beyond the per-component checks.</p>\n<p>The component handles image loading gracefully: if an image source is provided, it renders an AvatarImage; if the image fails to load or no source is provided, it falls back to displaying the user&#39;s initials via AvatarText.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<p>Avatar with image and initials fallback:</p>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;Avatar\n  src=&quot;/photos/sarah-mitchell.jpg&quot;\n  alt=&quot;Dr Sarah Mitchell&quot;\n  initials=&quot;SM&quot;\n/&gt;\n</code></pre>\n<p>Avatar with initials only (no photo available):</p>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;Avatar\n  alt=&quot;Nurse James Lee&quot;\n  initials=&quot;JL&quot;\n/&gt;\n</code></pre>\n<p>Avatar group showing a care team:</p>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;AvatarGroup label=&quot;Care team&quot;&gt;\n  &lt;Avatar\n    src=&quot;/photos/sarah-mitchell.jpg&quot;\n    alt=&quot;Dr Sarah Mitchell&quot;\n    initials=&quot;SM&quot;\n  /&gt;\n  &lt;Avatar\n    alt=&quot;Nurse James Lee&quot;\n    initials=&quot;JL&quot;\n  /&gt;\n  &lt;Avatar\n    alt=&quot;Dr Priya Sharma&quot;\n    initials=&quot;PS&quot;\n  /&gt;\n&lt;/AvatarGroup&gt;\n</code></pre>\n";
  const rest: string = "<h2>Help</h2>\n<p>Use Avatar as the outer container for user avatars. It renders either an AvatarImage (when a photo is available) or an AvatarText (initials fallback). Common scenarios include user profiles, comment threads, chat interfaces, account menus, and team member lists.</p>\n<h2>Syntax</h2>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;Avatar\n  alt=&quot;...&quot;\n  src=&quot;...&quot;\n  initials=&quot;...&quot;\n/&gt;\n</code></pre>\n<h2>Props</h2>\n<table>\n<thead>\n<tr>\n<th>Prop</th>\n<th>Type</th>\n<th>Default</th>\n<th>Description</th>\n</tr>\n</thead>\n<tbody><tr>\n<td><code>src</code></td>\n<td><code>string</code></td>\n<td>(optional)</td>\n<td>URL of the avatar image</td>\n</tr>\n<tr>\n<td><code>alt</code></td>\n<td><code>string</code></td>\n<td>(required)</td>\n<td>Accessible description of the person, used as <code>aria-label</code> on the container and <code>alt</code> on the image</td>\n</tr>\n<tr>\n<td><code>initials</code></td>\n<td><code>string</code></td>\n<td>(optional)</td>\n<td>Fallback text displayed when no image is available or the image fails to load</td>\n</tr>\n<tr>\n<td><code>...restProps</code></td>\n<td>HTML attributes</td>\n<td></td>\n<td>Additional attributes spread onto the outer <code>&lt;span&gt;</code> element</td>\n</tr>\n</tbody></table>\n<h2>Examples</h2>\n<p>Team member list:</p>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;Avatar\n  src=&quot;/team/alice.jpg&quot;\n  alt=&quot;Alice Smith&quot;\n  initials=&quot;AS&quot;\n/&gt;\n&lt;Avatar\n  src=&quot;/team/bob.jpg&quot;\n  alt=&quot;Bob Jones&quot;\n  initials=&quot;BJ&quot;\n/&gt;\n&lt;Avatar\n  alt=&quot;Charlie Brown&quot;\n  initials=&quot;CB&quot;\n/&gt;\n</code></pre>\n<h2>Keyboard Interactions</h2>\n<ul>\n<li>None -- this is a decorative/informational component, not interactive</li>\n</ul>\n<h2>ARIA</h2>\n<ul>\n<li><code>role=&quot;img&quot;</code> -- on the outer container, conveying that the entire avatar is an image representation</li>\n<li><code>aria-label</code> -- set from the <code>alt</code> prop, providing the accessible name for the avatar</li>\n<li><code>aria-hidden=&quot;true&quot;</code> -- on the inner initials <code>&lt;span&gt;</code>, preventing duplicate announcements since the outer element already has <code>aria-label</code></li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use to display a user&#39;s visual identity, such as a profile photo or initials fallback, in headers, comment threads, chat messages, or contact lists.</li>\n<li>Use when you need graceful fallback from an image to initials when the photo is unavailable or fails to load.</li>\n<li>Use with AvatarImage for a photo and AvatarText as a fallback when no image is available.</li>\n<li>Use in contexts where quick visual identification of people helps users navigate, such as team rosters or conversation threads.</li>\n<li>Use with the <code>alt</code> prop to provide an accessible name for the avatar via <code>aria-label</code>.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not use for decorative icons or illustrations -- use Icon instead.</li>\n<li>Do not use for organisation logos or non-person images -- use Image with appropriate alt text.</li>\n<li>Do not use when only one avatar is shown alongside extended profile information -- use a Person component instead.</li>\n</ul>\n<h2>Headless</h2>\n<p>This component provides <code>role=&quot;img&quot;</code>, <code>aria-label</code>, and image-to-initials fallback logic with zero visual styling. The consumer is responsible for all CSS including circular framing, sizing, background color for initials, font styling, border, and shadow effects.</p>\n<h2>Styles</h2>\n<p>The consumer provides all CSS styling. The component renders with a <code>.avatar</code> class for targeting. No default styles are included — this is a fully headless component.</p>\n<h2>Testing</h2>\n<ul>\n<li>Verify the component renders a <code>&lt;span&gt;</code> element with class <code>avatar</code></li>\n<li>Verify role=&quot;img&quot;` -- on the outer container, conveying that the entire avatar is an image representation</li>\n<li>Verify aria-label<code>-- set from the</code>alt` prop, providing the accessible name for the avatar</li>\n<li>Verify aria-hidden=&quot;true&quot;<code>-- on the inner initials</code>&lt;span&gt;<code>, preventing duplicate announcements since the outer element already has </code>aria-label</li>\n<li>Verify keyboard interactions work correctly</li>\n<li>Verify pass-through attributes are applied</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li><strong>Designers</strong>: Maintain consistent avatar sizes throughout the application. Use a contrasting background color behind initials text to ensure legibility.</li>\n<li><strong>Developers</strong>: Always provide the <code>alt</code> prop for accessibility. When using both <code>src</code> and <code>initials</code>, the component automatically falls back to initials if the image fails to load.</li>\n</ul>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders a <code>&lt;span&gt;</code> element with class <code>avatar</code></li>\n<li>Spreads <code>restProps</code> onto the root element for consumer customization</li>\n</ul>\n<h2>Composition</h2>\n<p>Avatar follows a parent/child composition pattern:</p>\n<ul>\n<li><strong>Avatar</strong> -- outer <code>&lt;span&gt;</code> container with <code>role=&quot;img&quot;</code> and <code>aria-label</code> for the accessible name.</li>\n<li><strong>AvatarImage</strong> -- <code>&lt;img&gt;</code> element displayed when a valid image source is available.</li>\n<li><strong>AvatarText</strong> -- <code>&lt;span&gt;</code> element displayed as a fallback with initials or short text.</li>\n</ul>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;Avatar\n  src=&quot;/photo.jpg&quot;\n  alt=&quot;Jane Doe&quot;\n  initials=&quot;JD&quot;\n/&gt;\n</code></pre>\n<h2>Related components</h2>\n<ul>\n<li><code>avatar-image</code> — an avatar indicator inside image such as a user photo</li>\n<li><code>avatar-text</code> — an avatar indicator inner text such as a user name</li>\n<li><code>avatar-group</code> — a group of avatar components</li>\n</ul>\n<h2>References</h2>\n<ul>\n<li>WAI-ARIA Img Role: <a href=\"https://www.w3.org/TR/wai-aria-1.2/#img\">https://www.w3.org/TR/wai-aria-1.2/#img</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<span class=\"avatar\" role=\"img\" aria-label=\"Jane Doe\">JD</span>";
  const svelteSource: string = "// In your Svelte component:\nimport Avatar from \"lily-design-system-svelte-headless/components/Avatar/Avatar.svelte\";\n\n<Avatar>\n  <!-- content -->\n</Avatar>\n";
  const usageCode: string = "<script lang=\"ts\">\n  import Avatar from \"./Avatar.svelte\";\n  import AvatarImage from \"../AvatarImage/AvatarImage.svelte\";\n<\/script>\n\n<Avatar alt=\"Jane Doe\">\n  <AvatarImage\n    src=\"/photos/jane.jpg\"\n    alt=\"Jane Doe\"\n  />\n</Avatar>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Avatar — Lily Design System</title>
  <meta name="description" content="An avatar circle is a component that displays a user's profile image or fallback initials within a circular frame, commonly used to represent a user identity in apps, websites, and social platforms. This visual element provides a quick, recognizable way for users to identify themselves or others,…" />
</svelte:head>

<article class="component-page component-page-intro prose" style="max-width: 64rem; margin: 0 auto; padding: 0.5rem 1rem 1rem;">
  {@html intro}
</article>

<!-- BEGIN auto-generated component example -->
<section class="component-example" aria-labelledby="example-heading" style="max-width: 64rem; margin: 0 auto; padding: 0 1rem 2rem;">
  <h2 id="example-heading">Example</h2>
  <div class="component-example-rendered" style="padding: 1rem; border: 1px solid #d8dde0; border-radius: 0.5rem; background: #ffffff;">{@html demoHtml}</div>
  <details style="margin-top: 1rem;">
    <summary style="cursor: pointer; font-weight: 600;">Show demo markup</summary>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <pre tabindex="0" style="overflow-x: auto; padding: 1rem; color: #212b32; background: #f0f4f5; border-radius: 0.5rem;"><code>{demoHtml}</code></pre>
  </details>
  {#each variants as variant (variant.title)}
    <h3 style="margin-top: 1.5rem;">{variant.title}</h3>
    <div class="component-example-rendered" style="padding: 1rem; border: 1px solid #d8dde0; border-radius: 0.5rem; background: #ffffff;">{@html variant.html}</div>
    <details style="margin-top: 0.5rem;">
      <summary style="cursor: pointer; font-weight: 600;">Show markup</summary>
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <pre tabindex="0" style="overflow-x: auto; padding: 1rem; color: #212b32; background: #f0f4f5; border-radius: 0.5rem;"><code>{variant.html}</code></pre>
    </details>
  {/each}
  {#if usageCode}
    <details style="margin-top: 1.5rem;" open>
      <summary style="cursor: pointer; font-weight: 600;">Usage example</summary>
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <pre tabindex="0" style="overflow-x: auto; padding: 1rem; color: #212b32; background: #f0f4f5; border-radius: 0.5rem;"><code>{usageCode}</code></pre>
    </details>
  {/if}
  <details style="margin-top: 1rem;">
    <summary style="cursor: pointer; font-weight: 600;">Show Svelte source</summary>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <pre tabindex="0" style="overflow-x: auto; padding: 1rem; color: #212b32; background: #f0f4f5; border-radius: 0.5rem;"><code>{svelteSource}</code></pre>
  </details>
</section>
<!-- END auto-generated component example -->

{#if usage}
<article class="component-page component-page-usage prose" style="max-width: 64rem; margin: 0 auto; padding: 0 1rem 2rem;">
  {@html usage}
</article>
{/if}

<article class="component-page prose" style="max-width: 64rem; margin: 0 auto; padding: 0 1rem 2rem;">
  {@html rest}
</article>

<!-- BEGIN generated: canonical contract (bin/generate-api-docs) -->
<section class="component-contract prose" aria-labelledby="contract-heading" style="max-width: 64rem; margin: 0 auto; padding: 0 1rem 2rem;">
  <h2 id="contract-heading">Canonical contract</h2>
  <p>
    Generated from this component's
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/avatar/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: avatar</li>
      <li>PascalCase: Avatar</li>
      <li>Description: an avatar indicator that shows an avatar image or avatar text</li>
      <li>Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks</li>
      <li>HTML tag: &lt;span&gt;</li>
      <li>CSS class: .avatar</li>
      <li>Interactive: no</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li><code>role="img"</code> -- on the outer container, conveying that the entire avatar is an image representation</li>
      <li><code>aria-label</code> -- set from the <code>alt</code> prop, providing the accessible name for the avatar</li>
      <li><code>aria-hidden="true"</code> -- on the inner initials <code>&lt;span&gt;</code>, preventing duplicate announcements since the outer element already has <code>aria-label</code></li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>None -- this is a decorative/informational component, not interactive</li>
    </ul>
    <h3>Props</h3>
    <p>| Prop           | Type            | Default    | Description                                                                                        |</p>
    <p>| -------------- | --------------- | ---------- | -------------------------------------------------------------------------------------------------- |</p>
    <p>| <code>src</code>          | <code>string</code>        | (optional) | URL of the avatar image                                                                            |</p>
    <p>| <code>alt</code>          | <code>string</code>        | (required) | Accessible description of the person, used as <code>aria-label</code> on the container and <code>alt</code> on the image |</p>
    <p>| <code>initials</code>     | <code>string</code>        | (optional) | Fallback text displayed when no image is available or the image fails to load                      |</p>
    <p>| <code>...restProps</code> | HTML attributes |            | Additional attributes spread onto the outer <code>&lt;span&gt;</code> element                                       |</p>
</section>
<!-- END generated: canonical contract -->
