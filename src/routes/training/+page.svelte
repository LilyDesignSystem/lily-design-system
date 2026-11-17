<svelte:head>
  <title>Training — Lily Design System</title>
  <meta name="description" content="A self-paced course in eight modules: headless components, keyboard, names, forms, themes, worldwide forms, motion and checking your work, each with an exercise and a self-check." />
</svelte:head>

<section class="page-intro">
  <h1>Training</h1>
  <p class="page-intro-tagline">
    A self-paced course for a team adopting Lily: eight modules, each with a
    goal, something to read, an exercise you do in a real browser, and a
    self-check with answers. About a day in all; one module a sitting works well.
  </p>
</section>

<section class="section prose" style="margin: 0 auto;">
  <h2>Before you start</h2>
  <p>
    Pick one framework <a href="/tutorials/">tutorial</a> and finish it first.
    Run one of the example apps locally, or use the
    <a href="/components/">component pages</a> here, for the exercises. You need
    a keyboard, and for module 8 a screen reader: VoiceOver on macOS and iOS,
    NVDA on Windows or TalkBack on Android, all free.
  </p>

  <h2>Module 1 — What headless means</h2>
  <p><strong>Goal:</strong> know what Lily decides and what you decide.</p>
  <p>
    <strong>Read:</strong> the <a href="/about/">about page</a>, and one
    component page, such as <a href="/components/button/">Button</a>, end to end.
  </p>
  <p>
    <strong>Do:</strong> render a <code>Button</code> and a <code>TextInput</code>
    with no stylesheet. Then link one theme, then another. Note what changed and
    what did not.
  </p>
  <details>
    <summary>Self-check: what does a Lily component never ship? What does it always ship?</summary>
    <p>
      Never: CSS, fonts, icons or images (the pickers' icons excepted), English
      text, data fetching, a default locale or currency. Always: the most
      specific HTML element, its kebab-case class hook first, ARIA where HTML
      falls short, keyboard behaviour, and your other attributes passed through.
    </p>
  </details>
  <details>
    <summary>Self-check: you want a red border on one button. Where does it go?</summary>
    <p>In your CSS, on the class hook (<code>.button</code>) or a class you add. Never in the component.</p>
  </details>

  <h2>Module 2 — Keyboard and focus</h2>
  <p><strong>Goal:</strong> use and test every component without a mouse.</p>
  <p>
    <strong>Read:</strong> the Keyboard Interactions table on
    <a href="/components/tab-bar/">TabBar</a>, <a href="/components/listbox/">Listbox</a>
    and <a href="/components/dialog/">Dialog</a>.
  </p>
  <p>
    <strong>Do:</strong> unplug the mouse. On each of those three pages, reach
    the demo with <kbd>Tab</kbd> and do everything the table lists. Open the
    dialog, press <kbd>Escape</kbd>, and note where focus lands.
  </p>
  <details>
    <summary>Self-check: why does a tab bar take one <kbd>Tab</kbd> stop, not one per tab?</summary>
    <p>
      The APG composite pattern: <kbd>Tab</kbd> moves between widgets, and the
      arrow keys move inside one (a roving tab index). A tab bar with ten tab
      stops makes a keyboard user press <kbd>Tab</kbd> ten times to get past it.
    </p>
  </details>
  <details>
    <summary>Self-check: after a modal dialog closes, where should focus be?</summary>
    <p>On the control that opened it. Lily's modal dialogs use <code>showModal()</code>, which also keeps <kbd>Tab</kbd> inside the dialog while it is open.</p>
  </details>

  <h2>Module 3 — Names, roles and states</h2>
  <p><strong>Goal:</strong> give every control a name a screen reader can say, in your words.</p>
  <p><strong>Read:</strong> the ARIA section of <a href="/components/icon-button/">IconButton</a> and <a href="/components/switch-button/">SwitchButton</a>.</p>
  <p>
    <strong>Do:</strong> in your own app, running its development server,
    render an <code>IconButton</code> without its <code>label</code>. Open the
    browser console: Lily warns that the control has no accessible name. Add
    the label and check the warning is gone. (The warnings exist only in a
    development build, so a production page, such as this site, stays silent.)
  </p>
  <details>
    <summary>Self-check: when do you use <code>aria-label</code>, and when visible text?</summary>
    <p>
      Visible text whenever you can: everyone sees it, and speech-input users
      can say it. <code>aria-label</code> only where there is no visible text,
      such as an icon. If both exist, the name must contain the visible words
      (WCAG 2.5.3).
    </p>
  </details>
  <details>
    <summary>Self-check: a status shown only in red. What is missing?</summary>
    <p>Text. Colour can repeat a meaning but never carry it alone (WCAG 1.4.1); the status needs words.</p>
  </details>

  <h2>Module 4 — Forms</h2>
  <p><strong>Goal:</strong> build a form whose errors anyone can find and fix.</p>
  <p><strong>Read and do:</strong> the <a href="/tutorials/forms/">accessible forms tutorial</a>, all five steps.</p>
  <details>
    <summary>Self-check: the form fails validation. Where does focus go, and what is read?</summary>
    <p>To the error summary, which is announced with its heading and its list of links, one per error, each leading to its field.</p>
  </details>
  <details>
    <summary>Self-check: why not disable the submit button until the form is valid?</summary>
    <p>A disabled button cannot say what is wrong, and many people cannot tell why it does nothing.</p>
  </details>

  <h2>Module 5 — Themes and contrast</h2>
  <p><strong>Goal:</strong> restyle Lily without breaking contrast or focus.</p>
  <p>
    <strong>Read:</strong> the <a href="/tutorials/theming/">theming tutorial</a> and
    the <a href="/theme-contrast/">theme contrast</a> table.
  </p>
  <p>
    <strong>Do:</strong> override <code>--color-primary</code> with your own brand
    colour. Check its pair, <code>--color-primary-content</code>, reaches 4.5:1,
    and that the focus ring still shows against the page.
  </p>
  <details>
    <summary>Self-check: your brand colour is too pale for white text. Can you still use it?</summary>
    <p>
      Yes, as decoration (<code>--lily-brand</code>: a header band, a rule, a logo
      background), never for text or a control's boundary. Text and borders use
      the theme's content pairs.
    </p>
  </details>

  <h2>Module 6 — Worldwide</h2>
  <p><strong>Goal:</strong> make no country the default.</p>
  <p><strong>Read and do:</strong> <a href="/tutorials/worldwide/">a form that works worldwide</a>.</p>
  <details>
    <summary>Self-check: why does <code>CurrencyInput</code> have no default currency?</summary>
    <p>Any default would be one country's money, silently wrong everywhere else. A missing <code>currencyCode</code> is a defect in the caller.</p>
  </details>
  <details>
    <summary>Self-check: a page in Arabic. What do you set, and what must your CSS do?</summary>
    <p><code>lang="ar"</code> and <code>dir="rtl"</code> (the locale picker sets both); your CSS uses logical properties so the layout mirrors on its own.</p>
  </details>

  <h2>Module 7 — Motion</h2>
  <p><strong>Goal:</strong> animate without harming anyone.</p>
  <p><strong>Read:</strong> the <a href="/patterns/motion/">motion recipes</a>.</p>
  <p>
    <strong>Do:</strong> turn on "reduce motion" in your operating system and
    reload a page with the marquee recipe. It should stand still and wrap. Then
    reach its pause button by keyboard.
  </p>
  <details>
    <summary>Self-check: something moves on its own for more than five seconds. What must it have?</summary>
    <p>A way to pause, stop or hide it (WCAG 2.2.2), reachable by keyboard, not only by hovering.</p>
  </details>

  <h2>Module 8 — Check your work</h2>
  <p><strong>Goal:</strong> test a page the way Lily tests its own.</p>
  <p>
    <strong>Do:</strong> take one page you built in this course and run four
    checks:
  </p>
  <ol>
    <li>axe (the browser extension, or <code>@axe-core/playwright</code> in a test): no violations.</li>
    <li>Keyboard only: every task done, focus always visible, never trapped.</li>
    <li>Zoom to 400% and narrow the window to 320 pixels: no sideways scrolling, nothing cut off.</li>
    <li>A screen reader: every control has a name, a role and its state, and errors are announced.</li>
  </ol>
  <details>
    <summary>Self-check: axe reports no violations. Is the page accessible?</summary>
    <p>
      Not yet proven. Automated checks find perhaps a third of the problems; the
      keyboard, zoom and screen-reader checks find much of the rest. See the
      <a href="/quality/">quality page</a> for what Lily itself has and has not verified.
    </p>
  </details>

  <h2>After the course</h2>
  <ul>
    <li><a href="/patterns/healthcare/">The healthcare guide</a>, for clinical software.</li>
    <li><a href="/tutorials/helpers/">The helpers</a>: pickers, the data grid, the calendar.</li>
    <li><a href="/help/">Help</a>, and <a href="https://github.com/LilyDesignSystem">the project</a> for questions.</li>
  </ul>
</section>
