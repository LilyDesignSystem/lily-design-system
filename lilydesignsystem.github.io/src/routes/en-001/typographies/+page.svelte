<script lang="ts">
  import { onMount } from 'svelte';
  import StylesNav from '#lib/components/StylesNav.svelte';

  const sizes = [
    { slug: 'smallest', pct: 80 },
    { slug: 'smaller', pct: 90 },
    { slug: 'small', pct: 95 },
    { slug: 'normal', pct: 100 },
    { slug: 'large', pct: 110 },
    { slug: 'larger', pct: 125 },
    { slug: 'largest', pct: 150 }
  ];

  // One sentence per script, each in its own language, so a font stack can be judged on the glyphs it will really draw.
  const scripts = [
    { lang: 'en', name: 'Latin', text: 'The quick brown fox jumps over the lazy dog.' },
    { lang: 'cy', name: 'Welsh (Latin)', text: 'Mae’r ŵyr yn dysgu darllen ac ysgrifennu.' },
    { lang: 'ar', name: 'Arabic', text: 'النص العربي يُكتب من اليمين إلى اليسار.', dir: 'rtl' },
    { lang: 'he', name: 'Hebrew', text: 'עברית נכתבת מימין לשמאל.', dir: 'rtl' },
    { lang: 'hi', name: 'Devanagari', text: 'हिन्दी पाठ बाएँ से दाएँ लिखा जाता है।' },
    { lang: 'th', name: 'Thai', text: 'ข้อความภาษาไทยไม่มีช่องว่างระหว่างคำ' },
    { lang: 'ja', name: 'Japanese', text: '日本語の文章は、漢字とかなを組み合わせて書きます。' },
    { lang: 'ko', name: 'Korean', text: '한글은 음절 단위로 모아 씁니다.' },
    { lang: 'zh-Hans', name: 'Chinese (Simplified)', text: '中文使用汉字书写。' }
  ];

  let body = $state('');
  let mono = $state('');
  let lineHeight = $state('');
  onMount(() => {
    const read = () => {
      const cs = getComputedStyle(document.documentElement);
      body = cs.getPropertyValue('--lily-font-body').trim() || cs.fontFamily;
      mono = cs.getPropertyValue('--lily-font-mono').trim();
      lineHeight = cs.getPropertyValue('--lily-line-height-body').trim();
    };
    read();
    let t: ReturnType<typeof setTimeout>;
    const mo = new MutationObserver(() => {
      clearTimeout(t);
      t = setTimeout(read, 400);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'lang'] });
    mo.observe(document.head, { childList: true, subtree: true, attributes: true, attributeFilter: ['href'] });
    return () => {
      mo.disconnect();
      clearTimeout(t);
    };
  });

  const stack = `/* A theme defines only its Latin stack. */
:root { --lily-font-body-latin: "Inter", system-ui, sans-serif; }
/* The shared "Writing systems" section then builds --lily-font-body
   from it plus the system fonts for each element's [lang]. */`;
</script>

<svelte:head>
  <title>Typographies — Lily Design System</title>
  <meta
    name="description"
    content="Lily's font stacks that follow the reader's language, the heading scale and the seven-step text size."
  />
</svelte:head>

<section class="page-intro">
  <h1>Typographies</h1>
  <p class="page-intro-tagline">
    Lily names its type roles and lets the theme pick the face. A reader can resize the text, and the font follows the
    language of each element, so a Thai sentence is drawn in a Thai font whatever the page’s main language is.
  </p>
</section>

<section class="prose">
  <StylesNav current="typographies" />

  <h2>When to use these styles</h2>
  <p>
    Use the role tokens for every piece of text: body, monospace, and the heading scale. They keep hierarchy,
    readability and the reader’s own settings working together.
  </p>

  <h2>When not to</h2>
  <p>
    Do not set a font size in <code>vw</code> alone, do not shrink text below <code>1rem</code>, and do not pick a
    heading level for its size. Choose the level for the page’s structure and style it to suit.
  </p>

  <h2>Font stacks</h2>
  <p>This page is using these stacks right now, for the theme you have chosen.</p>
  <dl class="specs">
    <dt>Body</dt>
    <dd><code>{body || '…'}</code></dd>
    <dt>Monospace</dt>
    <dd><code>{mono || '…'}</code></dd>
    <dt>Body line height</dt>
    <dd><code>{lineHeight || '…'}</code></dd>
  </dl>
  <p>
    Lily names fonts and never ships them. A theme records its font and the font’s licence, and every stack ends in a
    generic family so there is always a fallback.
  </p>
  <pre><code>{stack}</code></pre>

  <h2>Writing systems</h2>
  <p>
    Mark the language on the element (<code>lang="th"</code>) and the stack does the rest. Scripts with tall marks get
    a taller line height automatically.
  </p>
  <ul class="scripts">
    {#each scripts as s (s.lang)}
      <li>
        <span class="script-name">{s.name}</span>
        <span lang={s.lang} dir={s.dir ?? 'ltr'} class="script-text">{s.text}</span>
      </li>
    {/each}
  </ul>

  <h2>Headings</h2>
  <p>
    Use one <code>h1</code> per page and descend one level at a time. Screen reader users move between headings, so
    the outline matters more than the size. The specimen below shows a typical scale; your theme sets the real one.
  </p>
  <div class="headings" aria-label="Heading scale specimen" role="group">
    <p class="spec spec-1">Level 1: the page title</p>
    <p class="spec spec-2">Level 2: a major section</p>
    <p class="spec spec-3">Level 3: a subsection</p>
    <p class="spec spec-4">Level 4: a group within a subsection</p>
    <p class="spec spec-5">Level 5: a component heading</p>
    <p class="spec spec-6">Level 6: the smallest heading</p>
  </div>
  <p>The specimen is set in plain text so it does not add headings to this page’s own outline.</p>

  <h2>Body text</h2>
  <ul>
    <li>Body text is at least <code>1rem</code>, with a line height from <code>--lily-line-height-body</code>.</li>
    <li>Keep lines to about 45 to 75 characters; the content-width tokens (<code>--content-width-narrow</code> to <code>-wider</code>) do this.</li>
    <li>Align text to the start, not the left, so right-to-left scripts mirror correctly.</li>
    <li>Do not justify text, do not use all capitals for sentences, and do not underline anything that is not a link.</li>
    <li>Labels run up to 30 percent longer in other languages, so leave room.</li>
  </ul>

  <h2>The reader sets the size</h2>
  <p>
    The text-size picker sets <code>data-text-size</code> on the root, a seven-step scale that scales the root font
    size. Because everything is in <code>rem</code>, the layout follows. Test at the largest step and at 400 percent
    zoom.
  </p>
  <ul class="sizes">
    {#each sizes as s (s.slug)}
      <li style={`font-size: ${s.pct}%`}><strong>{s.slug}</strong> <span>{s.pct}%</span></li>
    {/each}
  </ul>
</section>

<style>
  .specs {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 0.25rem 1rem;
  }
  .specs dd {
    margin: 0;
    overflow-wrap: anywhere;
  }
  .scripts {
    display: grid;
    gap: 0.5rem;
    margin: 0 0 1.5rem;
    padding: 0;
    list-style: none;
  }
  .scripts li {
    display: grid;
    grid-template-columns: minmax(7rem, 10rem) 1fr;
    gap: 0.5rem 1rem;
    align-items: baseline;
    padding-block: 0.5rem;
    border-block-end: 1px solid var(--color-base-300, currentColor);
  }
  .script-name {
    font-size: 0.875rem;
    color: var(--lily-text-muted, inherit);
  }
  .script-text {
    font-size: 1.25rem;
  }
  .spec {
    margin-block: 0.5rem;
    font-weight: 700;
    line-height: 1.2;
  }
  .spec-1 { font-size: 2.25rem; }
  .spec-2 { font-size: 1.75rem; }
  .spec-3 { font-size: 1.5rem; }
  .spec-4 { font-size: 1.25rem; }
  .spec-5 { font-size: 1.125rem; }
  .spec-6 { font-size: 1rem; }
  .sizes {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1.5rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  @media (max-width: 30rem) {
    .scripts li {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
