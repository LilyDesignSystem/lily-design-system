<svelte:head>
  <title>Lily + Claude Code — Lily Design System</title>
  <meta
    name="description"
    content="26 Claude Skills give Claude Code a curated, loadable entry point into Lily Design System — general concepts, per-framework umbrellas, and per-subproject deep dives for the headless library and the *-picker helpers."
  />
</svelte:head>

<section class="page-intro">
  <h1>Skills on AI agents make Lily even easier</h1>
  <p class="page-intro-tagline">
    Lily ships focused skills — general, per-framework, and
    per-subproject — so an agent loads exactly the context it needs and
    nothing it doesn't.
  </p>
</section>

<section class="section prose" style="margin: 0 auto;">
  <h2>What skill do you want?</h2>
  <p>
    Each tier answers a different question. Load the general skill when you
    don't know Lily yet. Load a framework skill when you know your framework
    but not which subproject you need. Load a headless-skill or
    helpers-skill directly when you already know exactly what you're
    working on.
  </p>

  <ul>
    <li>
      <strong>General / maintainer</strong> — "What is Lily?" / "How is this
      monorepo put together?" —
      <a href="https://github.com/LilyDesignSystem/lily-design-system-skill"
        ><code>lily-design-system-skill</code></a
      >,
      <a href="https://github.com/LilyDesignSystem/lily-design-system-maintainer-skill"
        ><code>lily-design-system-maintainer-skill</code></a
      >
    </li>
    <li>
      <strong>Framework umbrella</strong> — "What's available for
      {`{framework}`}, and which piece do I need?" — 8, one
      <code>{`{framework}`}-skill</code> each
    </li>
    <li>
      <strong>Headless / helpers</strong> — "How exactly do I use
      {`{framework}`}'s components / *-picker helpers?" — 16, one
      <code>{`{framework}`}-headless-skill</code> and one
      <code>{`{framework}`}-helpers-skill</code> each
    </li>
  </ul>

  <h2>The eight frameworks</h2>
  <p>
    Every framework gets the same three-deep stack. The umbrella skill maps
    all of that framework's real subprojects — including the example app,
    which neither of its two sibling skills covers — and points down into
    them rather than repeating their contracts.
  </p>

  <table>
    <thead>
      <tr>
        <th>Framework</th>
        <th>Umbrella</th>
        <th>Headless</th>
        <th>Helpers</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Angular</td>
        <td><a aria-label="Angular umbrella skill" href="https://github.com/LilyDesignSystem/lily-design-system-angular-skill">skill</a></td>
        <td><a aria-label="Angular headless skill" href="https://github.com/LilyDesignSystem/lily-design-system-angular-headless-skill">skill</a></td>
        <td><a aria-label="Angular helpers skill" href="https://github.com/LilyDesignSystem/lily-design-system-angular-helpers-skill">skill</a></td>
      </tr>
      <tr>
        <td>Blazor</td>
        <td><a aria-label="Blazor umbrella skill" href="https://github.com/LilyDesignSystem/lily-design-system-blazor-skill">skill</a></td>
        <td><a aria-label="Blazor headless skill" href="https://github.com/LilyDesignSystem/lily-design-system-blazor-headless-skill">skill</a></td>
        <td><a aria-label="Blazor helpers skill" href="https://github.com/LilyDesignSystem/lily-design-system-blazor-helpers-skill">skill</a></td>
      </tr>
      <tr>
        <td>HTML</td>
        <td><a aria-label="HTML umbrella skill" href="https://github.com/LilyDesignSystem/lily-design-system-html-skill">skill</a></td>
        <td><a aria-label="HTML headless skill" href="https://github.com/LilyDesignSystem/lily-design-system-html-headless-skill">skill</a></td>
        <td><a aria-label="HTML helpers skill" href="https://github.com/LilyDesignSystem/lily-design-system-html-helpers-skill">skill</a></td>
      </tr>
      <tr>
        <td>Nunjucks</td>
        <td><a aria-label="Nunjucks umbrella skill" href="https://github.com/LilyDesignSystem/lily-design-system-nunjucks-skill">skill</a></td>
        <td><a aria-label="Nunjucks headless skill" href="https://github.com/LilyDesignSystem/lily-design-system-nunjucks-headless-skill">skill</a></td>
        <td><a aria-label="Nunjucks helpers skill" href="https://github.com/LilyDesignSystem/lily-design-system-nunjucks-helpers-skill">skill</a></td>
      </tr>
      <tr>
        <td>React</td>
        <td><a aria-label="React umbrella skill" href="https://github.com/LilyDesignSystem/lily-design-system-react-skill">skill</a></td>
        <td><a aria-label="React headless skill" href="https://github.com/LilyDesignSystem/lily-design-system-react-headless-skill">skill</a></td>
        <td><a aria-label="React helpers skill" href="https://github.com/LilyDesignSystem/lily-design-system-react-helpers-skill">skill</a></td>
      </tr>
      <tr>
        <td>Svelte</td>
        <td><a aria-label="Svelte umbrella skill" href="https://github.com/LilyDesignSystem/lily-design-system-svelte-skill">skill</a></td>
        <td><a aria-label="Svelte headless skill" href="https://github.com/LilyDesignSystem/lily-design-system-svelte-headless-skill">skill</a></td>
        <td><a aria-label="Svelte helpers skill" href="https://github.com/LilyDesignSystem/lily-design-system-svelte-helpers-skill">skill</a></td>
      </tr>
      <tr>
        <td>Vue</td>
        <td><a aria-label="Vue umbrella skill" href="https://github.com/LilyDesignSystem/lily-design-system-vue-skill">skill</a></td>
        <td><a aria-label="Vue headless skill" href="https://github.com/LilyDesignSystem/lily-design-system-vue-headless-skill">skill</a></td>
        <td><a aria-label="Vue helpers skill" href="https://github.com/LilyDesignSystem/lily-design-system-vue-helpers-skill">skill</a></td>
      </tr>
      <tr>
        <td>Web Components</td>
        <td><a aria-label="Web Components umbrella skill" href="https://github.com/LilyDesignSystem/lily-design-system-web-components-skill">skill</a></td>
        <td>
          <a
            aria-label="Web Components headless skill"
            href="https://github.com/LilyDesignSystem/lily-design-system-web-components-headless-skill"
            >skill</a
          >
          (33/491, partial)
        </td>
        <td><a aria-label="Web Components helpers skill" href="https://github.com/LilyDesignSystem/lily-design-system-web-components-helpers-skill">skill</a></td>
      </tr>
    </tbody>
  </table>
  <p>
    Web Components is the one exception in both directions: its headless
    catalog is a deliberate 33-of-491 slice (native custom elements, no
    framework runtime), and there is no Web Components example app yet — its
    umbrella skill says so rather than implying one exists.
  </p>

  <h2>Add one skill</h2>
  <p>
    Each skill is a <a href="https://code.claude.com/docs/en/skills"><code>SKILL.md</code></a>
    file — plus supporting files, no build step. Clone the one you need into wherever your Claude Code setup loads
    skills from (see the official docs linked above for your project's or
    account's skills directory):
  </p>
  <pre><code>{`git clone https://github.com/LilyDesignSystem/lily-design-system-svelte-skill`}</code></pre>
  <p>
    Working across several frameworks, or on the monorepo itself? Clone the
    <a href="https://github.com/LilyDesignSystem/lily-design-system">canonical monorepo</a>
    instead — every one of the 26 skills already lives at its root, alongside
    the headless libraries, the helpers catalogs, and the example apps they
    describe.
  </p>
</section>
