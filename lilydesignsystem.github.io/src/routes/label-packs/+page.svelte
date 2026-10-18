<svelte:head>
  <title>Label packs — Lily Design System</title>
  <meta
    name="description"
    content="Ready-made labels for Lily's data grid, kanban board, calendar, Gantt chart and filter in 46 locales: how to load a pack in every framework, and why 45 of them are still unreviewed machine drafts."
  />
</svelte:head>

<section class="page-intro">
  <h1>Label packs</h1>
  <p class="page-intro-tagline">
    Lily ships no English defaults, so the grid-like helpers used to need a hundred-odd strings written and
    translated by every app. A label pack is that work done once, for 46 locales.
  </p>
</section>

<section class="prose" style="max-width: 64rem; margin: 0 auto; padding: 0 1rem 2rem;">
  <h2>What a pack holds</h2>
  <p>
    One JSON file per locale in
    <a href="https://github.com/LilyDesignSystem/lily-design-system/tree/main/shared/label-packs"
      ><code>shared/label-packs/</code></a
    >
    holds the <code>labels</code> for <code>data-grid</code>, <code>kanban-board</code>, <code>calendar</code>,
    <code>gantt-chart</code> and <code>filter</code> — names for controls, live-region announcements, export headers,
    the filter's operator names. About 185 strings each. Strings that take values are templates with
    <code>&#123;placeholders&#125;</code>; wording that depends on a value (ascending or descending, collapsed or
    expanded, a dependency type) is an object keyed by that value.
  </p>

  <h2>Loading a pack</h2>
  <ul>
    <li>
      <strong>Svelte, React, Vue, Angular, HTML, Web Components</strong> —
      <code>labelsFor("data-grid", pack)</code> returns a ready <code>labels</code>.
    </li>
    <li>
      <strong>Nunjucks</strong> — <code>nunjucksLabelsFor("kanban-board", pack)</code> returns
      <code>&#123; macro, client &#125;</code>: pass <code>macro</code> as the macro's <code>labels</code> and
      <code>client</code> as the client's <code>labels</code> option.
    </li>
    <li>
      <strong>Blazor</strong> — <code>LabelPack.FromJson(json).ToDataGridLabels()</code>, and
      <code>ToKanbanLabels()</code>, <code>ToCalendarLabels()</code>, <code>ToGanttLabels()</code>,
      <code>ToFilterLabels()</code> in their packages.
    </li>
  </ul>
  <p>
    A key a pack lacks leaves that label unset — the control is unnamed, and the helper says so in development — rather than
    showing text from another language. Labels that depend on how a locale writes dates (weekday names, period titles, the
    Gantt column label) are not in a pack: build them with <code>Intl</code>.
  </p>

  <h2>Read this before shipping a pack</h2>
  <p>
    Only English is reviewed. The other 45 packs are machine drafts, marked <code>"reviewed": false</code> in the file, and
    a native speaker should check them — screen-reader names and announcements most of all — before a product relies on
    them. Welsh, which most deserves a careful read, is among the drafts. The packs are not yet published as an npm or
    NuGet package; copy the file you need from the repository.
  </p>

  <h2>The 46 locales</h2>
  <p>
    ar, bg, bh, bn, cs, cy, da, de, el, en, es, et, eu, fa, fi, fr, ga, gu, ha, hi, hr, hu, id, it, ja, jv, ko, lt, lv, mr,
    mt, nl, pa, pl, pt, ro, ru, sk, sl, sv, ta, te, tr, ur, vi and zh — each as <code>&lt;code&gt;-001</code>. (Bhojpuri keeps
    the requested tag <code>bh</code>; its ISO code is <code>bho</code>.)
  </p>

  <p>
    The full contract is in the
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/label-packs/index.md"
      >label-packs specification</a
    >.
  </p>
</section>
